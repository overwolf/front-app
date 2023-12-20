import path from 'node:path'
import { readFile, writeFile, unlink, stat } from 'node:fs/promises'
import { exec } from 'node:child_process'
import semver from 'semver'
import { copy } from 'fs-extra'
import { COMPRESSION_LEVEL, zip } from 'zip-a-folder'
import { Compiler } from 'webpack'

import { kPackageJSONPath, kManifestPath, kProjectPath, kPublicPath, kOWPluginName, kStaticPath, kBuildPath } from './constants'


interface PackageJSON {
  version: string
}

export interface OverwolfWebpackPluginOptions {
  makeOPK?: boolean
  makeOPKSuffix?: string
  setVersion?: string
}

const updatePackageVersion = (type: string) => {
  console.log('Changing package version:', type)

  const cmd = `npm version ${type} --no-git-tag-version --allow-same-version`

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (stdout) {
        console.log(`${cmd}: stdout:`, stdout)
      }

      if (stderr) {
        console.error(`${cmd}: stderr:`, stderr)
      }

      if (error === null) {
        setTimeout(resolve, 2500)
        return
      }

      if (error instanceof Error) {
        console.error(`${cmd}: error:`, error)
        reject(error)
      }
    })
  })
}

const copyManifest = async (distPath: string) => {
  const [pkg, manifest] = await Promise.all([
    readJSONFile<PackageJSON>(kPackageJSONPath),
    readJSONFile<overwolf.extensions.Manifest>(kManifestPath)
  ])

  manifest.meta.version = pkg.version

  const manifestCopyPath = path.join(distPath, 'manifest.json')

  const manifestJSON = JSON.stringify(manifest, null, '  ')

  await writeFile(manifestCopyPath, manifestJSON)
}

const makeOPK = async (distPath: string, suffix = '') => {
  console.log('Making OPK from dist:', distPath, suffix)

  const manifest = await readJSONFile<overwolf.extensions.Manifest>(
    kManifestPath
  )

  const packageJSON = await readJSONFile<PackageJSON>(kPackageJSONPath)

  const { version } = packageJSON

  const dotSuffix = suffix ? `.${suffix}` : ''

  const opkPath = path.join(
    kProjectPath,
    `builds/${manifest.meta.name}-${version}${dotSuffix}.opk`
  )

  const opkExists = await stat(opkPath).catch(() => null)

  console.log('opkExists:', opkExists)

  if (opkExists) {
    await unlink(opkPath)
  }

  await zip(
    distPath,
    opkPath,
    { compression: COMPRESSION_LEVEL.uncompressed }
  )
}

const readJSONFile = async <T>(path: string): Promise<T> => {
  const json = await readFile(path, { encoding: 'utf-8' })

  if (!json) {
    throw new Error(`Could not read ${path}`)
  }

  return JSON.parse(json)
}

const isValidVersionArg = (version: string) => {
  switch (version) {
    case 'major':
    case 'minor':
    case 'patch':
      return true
    default:
      return Boolean(semver.valid(version) && !semver.prerelease(version))
  }
}

const copyPublicDirAndManifest = async (distPath: string) => {
  const staticPath = path.join(distPath, kStaticPath)

  console.log('Copying public dir to:', staticPath)

  await copy(kPublicPath, staticPath, { dereference: true })

  await copyManifest(distPath)
}

export class OverwolfWebpackPlugin {
  #makeOPK: boolean
  #makeOPKSuffix?: string
  #setVersion?: string

  constructor(options: OverwolfWebpackPluginOptions = {}) {
    this.#makeOPK = options.makeOPK ?? false
    this.#makeOPKSuffix = options.makeOPKSuffix
    this.#setVersion = options.setVersion
  }

  apply(compiler: Compiler) {
    compiler.hooks.beforeRun.tapPromise(kOWPluginName, async () => {
      if (this.#setVersion && isValidVersionArg(this.#setVersion)) {
        await updatePackageVersion(this.#setVersion)
      }
    })

    compiler.hooks.afterEmit.tapPromise(kOWPluginName, async () => {
      await copyPublicDirAndManifest(kBuildPath)

      console.log('makeOPK:', this.#makeOPK)

      if (this.#makeOPK) {
        if (this.#makeOPKSuffix) {
          await makeOPK(compiler.outputPath, this.#makeOPKSuffix)
        } else {
          await makeOPK(compiler.outputPath)
        }
      }
    })
  }
}

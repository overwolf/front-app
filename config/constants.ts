import path from 'node:path'


export const
  kAppTitle = 'Front App',
  kOWPluginName = 'OverwolfWebpackPlugin',
  kProjectPath = path.resolve(__dirname, '../'),
  kBuildPath = path.join(kProjectPath, './dist/'),
  kManifestPath = path.resolve(kProjectPath, 'manifest.json'),
  kPackageJSONPath = path.resolve(kProjectPath, 'package.json'),
  kPublicPath = path.resolve(kProjectPath, 'public/'),
  kStaticPath = './assets-static/'

export const kWindowNames = [
  'background',
  'desktop',
  'ingame',
  'loading',
  'notices'
]

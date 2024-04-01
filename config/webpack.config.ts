import { basename, extname } from 'node:path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// eslint-disable-next-line import/no-unresolved
import million from 'million/compiler'

import { OverwolfWebpackPlugin } from './overwolf.webpack'
import { kAppTitle, kBuildPath, kWindowNames } from './constants'


interface EnvArg {
  production?: boolean
  makeOPK?: boolean
  makeOPKSuffix?: string
  setVersion?: string
}

const makeHTMLTemplate = ({ htmlWebpackPlugin }: Record<string, any>) => (
  `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    ${htmlWebpackPlugin.tags?.headTags}
    <title>${kAppTitle}</title>
  </head>
  <body>
    ${htmlWebpackPlugin.tags?.bodyTags}
  </body>
</html>
`
)

const makeHTMLPlugin = (chunk: string) => new HtmlWebpackPlugin({
  templateContent: makeHTMLTemplate,
  filename: `${chunk}.html`,
  chunks: [chunk],
  publicPath: '',
  inject: false
})

const makePostCSSLoader = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [autoprefixer]
    }
  }
})

export const makeConfig = (env: EnvArg): Configuration => {
  const isProd = Boolean(env.production)

  const mode = isProd ? 'production' : 'development'

  const entries = kWindowNames.reduce((acc, name) => {
    acc[name] = `./src/${name}`
    return acc
  }, {} as Record<string, string>)

  return {
    mode,
    devtool: isProd ? false : 'inline-source-map',
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss']
    },
    entry: entries,
    output: {
      clean: true,
      path: kBuildPath,
      filename: '[name].js',
      chunkFilename: 'chunks/[id].js',
      assetModuleFilename: (pathData) => {
        if (!pathData || !pathData.filename) {
          return 'assets/[name].[ext]'
        }

        const
          name = basename(pathData.filename),
          extension = extname(pathData.filename).slice(1)

        return `assets/${extension}/${name}`
      }
    },
    module: {
      rules: [
        // Add support for native node modules
        {
          // We're specifying native_modules in the test because the asset relocator
          // loader generates a "fake" .node file which is really a cjs file.
          test: /native_modules[/\\].+\.node$/,
          use: 'node-loader'
        },
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|\.webpack)/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        },
        {
          test: /\.(svg|png|jpg|jpeg)$/i,
          issuer: /\.[jt]sx?$/,
          type: 'asset/resource'
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            makePostCSSLoader()
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            makePostCSSLoader(),
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      million.webpack({
        auto: true,
        mute: true
      }),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[id].css',
        ignoreOrder: true
      }),
      new OverwolfWebpackPlugin(env),
      ...kWindowNames.map(makeHTMLPlugin)
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      }
    }
  }
}

export default makeConfig

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TooSimplePlugin = require('./too-simple-plugin')
const EXTRA_LOADER = path.join(__dirname, './extra-loader')

function getEntry (appPath, pages) {
  return pages.reduce((pre, page) => {
    pre[page] = `${path.resolve(appPath, page)}.jsx?mptype=page`
    return pre
  }, {})
}

const defaultOptions = {
  vendorsFile: '_vendors/index',
  pathToAppJSON: path.join(process.cwd(), './app.json'),
  outputPath: path.join(process.cwd(), './dist')
}

function getConfig (options = {}) {
  let { vendorsFile, pathToAppJSON, outputPath } = Object.assign(defaultOptions, options)
  pathToAppJSON = path.isAbsolute(pathToAppJSON) ? pathToAppJSON : path.join(process.cwd(), pathToAppJSON)
  const appJSON = require(pathToAppJSON)
  const appPath = path.parse(pathToAppJSON).dir

  return {
    entry: getEntry(appPath, appJSON.pages),
    output: {
      path: path.isAbsolute(outputPath) ? outputPath : path.join(process.cwd(), outputPath),
      filename: '[name].js',
      globalObject: 'wx'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: 'cover 99.5% or ie >= 9' }]
                ],
                plugins: [
                  ['@babel/plugin-transform-runtime', { helpers: false }],
                  // Stage 0
                  '@babel/plugin-proposal-function-bind',
                  // Stage 2
                  ['@babel/plugin-proposal-decorators', { legacy: true }],
                  // Stage 3
                  ['@babel/plugin-proposal-class-properties', { loose: false }],
                  ['babel-plugin-common-jsx', { functionName: 'mpjsx.createElement' }]
                ]
              }
            },
            {
              loader: EXTRA_LOADER,
              options: {
                exts: ['.less', '.css', '.wxss']
              }
            }
          ]
        },
        {
          test: /regenerator-runtime(\/|\\)runtime\.js$/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'cover 99.5% or ie >= 9' }]
              ],
              plugins: [
                ['babel-plugin-global-assignment', { globalObject: 'wx' }]
              ]
            }
          }]
        },
        {
          test: /\.(css|wxss)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].wxss'
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].wxss'
              }
            },
            'less-loader'
          ]
        }
      ]
    },
    mode: 'none',
    optimization: {
      splitChunks: {
        name: vendorsFile,
        chunks: 'initial'
      }
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: pathToAppJSON },
        { from: path.join(appPath, './app.js') },
        { from: path.join(appPath, './app.wxss') },
        { from: path.join(appPath, './project.config.json') }
      ]),
      new TooSimplePlugin({
        appPath,
        vendorsFile,
        exts: [{
          name: '.json',
          defaultContent: '{}'
        }, {
          name: '.wxml',
          defaultContent: '<mp-jsx-component wx:if="{{root}}" node="{{root}}" applyPageLifetimes="{{applyPageLifetimes}}" />'
        }]
      })
    ]
  }
}

module.exports = getConfig

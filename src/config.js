const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TooSimplePlugin = require('./too-simple-plugin')

function getEntry (appPath, pages) {
  return pages.reduce((pre, page) => {
    pre[page] = `${path.resolve(appPath, page)}?mp`
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
    mode: 'production',
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
        { from: path.join(appPath, './project.config.json') },
        // { from: path.join(__dirname, './components'), to: 'components/' }
      ]),
      new TooSimplePlugin({
        appPath,
        vendorsFile,
        exts: ['.json', '.wxml', '.wxss']
      })
    ]
  }
}

module.exports = getConfig

const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const exts = ['.json', '.wxml', '.wxss']

function getEntry(appPath, pages) {
  return pages.reduce((pre, page) => {
    pre[page] = `${path.resolve(appPath, page)}?mp`
    return pre
  }, {})
}

const defaultOptions = {
  vendorsFile: '_vendors/index.js',
  pathToAppJSON: path.join(process.cwd(), './app.json'),
  outputPath: path.join(process.cwd(), './dist')
}

function getConfig(options = {}) {
  let { vendorsFile, pathToAppJSON, outputPath } = Object.assign(defaultOptions, options)
  pathToAppJSON = path.isAbsolute(pathToAppJSON) ? pathToAppJSON : path.join(process.cwd(), pathToAppJSON)
  const appJSON = require(pathToAppJSON)
  const appPath = path.parse(pathToAppJSON).dir

  return {
    entry: getEntry(appPath, appJSON.pages),
    output: {
      path: path.isAbsolute(outputPath) ? outputPath : path.join(process.cwd(), outputPath),
      filename: '[name].js',
      globalObject: 'getApp()'
    },
    mode: 'production',
    optimization: {
      splitChunks: {
        name: vendorsFile,
        chunks: 'initial'
      }
    },
    plugins: [
      new TooSimplePlugin({ appPath, vendorsFile }),
      new CopyWebpackPlugin([
        {
          from: path.join(pathToAppJSON),
          transform: (content, path) => {
            // todo: add base components dep
            const str = content.toString('utf8')
            return str
          }
        },
        { from: path.join(appPath, './app.js') },
        { from: path.join(appPath, './app.wxss') },
        { from: path.join(appPath, './project.config.json') },
        // { from: path.join(__dirname, './components'), to: 'components/' }
      ])
    ]
  }
}

module.exports = getConfig

class TooSimplePlugin {
  constructor(options) {
    this.options = options
  }

  apply(complier) {
    complier.hooks.emit.tap('too-simple-plugin', compilation => {
      const regExp = /\.js$/;
      try {
        for (let filename in compilation.assets) {
          if (regExp.test(filename) && filename.indexOf('pages/') === 0) {
            const pathObj = path.parse(filename)
            let source = compilation.assets[filename].source()
            source = `require('${path.relative(path.parse(filename).dir, this.options.vendorsFile).replace(/\\/g, '/')}');${source}`
            compilation.assets[filename] = {
              source: () => {
                return source
              },
              size: () => {
                return Buffer.byteLength(source, 'utf8');
              }
            }


            exts.forEach(ext => {
              try {
                const file = `${pathObj.dir}/${pathObj.name}${ext}`
                const currPath = path.resolve(this.options.appPath, file)
                fs.accessSync(currPath, fs.constants.R_OK | fs.constants.W_OK);
                const fileContent = fs.readFileSync(currPath, { encoding: 'utf8' })
                compilation.assets[file] = {
                  source: () => {
                    return fileContent
                  },
                  size: () => {
                    return Buffer.byteLength(fileContent, 'utf8');
                  }
                }
              } catch (error) {
                // skip
              }
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    })
  }
}
const path = require('path')
const fs = require('fs')

const jsRegExp = /\.js$/

class TooSimplePlugin {
  constructor (options) {
    this.options = options
  }

  createAsset (source, encoding = 'utf8') {
    return {
      source: () => source,
      size: () => Buffer.byteLength(source, encoding)
    }
  }

  getFileNameWithoutExt (filename) {
    const obj = path.parse(filename)
    return path.join(obj.dir, obj.name)
  }

  tryFile (file) {
    try {
      const currPath = path.resolve(this.options.appPath, file)
      fs.accessSync(currPath, fs.constants.R_OK | fs.constants.W_OK)
      // return fs.readFileSync(currPath, { encoding: 'utf8' })
      return this.readAsUtf8Sync(currPath)
    } catch (error) {
      return null
    }
  }

  readAsUtf8Sync (file) {
    return fs.readFileSync(file, { encoding: 'utf8' })
  }

  addMpJSXComponetFile (compilation) {
    try {
      const jsContent = this.readAsUtf8Sync(path.join(__dirname, './mp-jsx-component/index.js'))
      const jsonContent = this.readAsUtf8Sync(path.join(__dirname, './mp-jsx-component/index.json'))
      const wxmlContent = require('./mp-jsx-component/index.wxml.js')()

      compilation.assets['_mp-jsx-component/index.js'] = this.createAsset(jsContent)
      compilation.assets['_mp-jsx-component/index.json'] = this.createAsset(jsonContent)
      compilation.assets['_mp-jsx-component/index.wxml'] = this.createAsset(wxmlContent)

      const appJSONContent = JSON.parse(compilation.assets['app.json'].source().toString('utf8'))
      if (!appJSONContent.usingComponents) appJSONContent.usingComponents = {}
      appJSONContent.usingComponents['mp-jsx-component'] = '_mp-jsx-component/index'
      compilation.assets['app.json'] = this.createAsset(JSON.stringify(appJSONContent))
    } catch (error) {
      console.error(error)
    }
  }

  apply (complier) {
    complier.hooks.emit.tap('too-simple-plugin', compilation => {
      let hasVendors = false

      try {
        for (let filename in compilation.assets) {
          if (this.getFileNameWithoutExt(filename) === this.options.vendorsFile) {
            hasVendors = true
          }

          if (jsRegExp.test(filename) && this.getFileNameWithoutExt(filename) in complier.options.entry) {
            console.log('Is page:', filename)
            const pathObj = path.parse(filename)
            let source = compilation.assets[filename].source()
            compilation.assets[filename] = this.createAsset(source)

            this.options.exts.forEach(ext => {
              const file = `${pathObj.dir}/${pathObj.name}${ext}`
              const result = this.tryFile(file)
              if (result) compilation.assets[file] = this.createAsset(result)
            })
          }
        }
      } catch (error) {
        console.error(error)
      }

      if (hasVendors) {
        const appJsAssetSource = compilation.assets['app.js'].source()
        const source = `require('${this.options.vendorsFile}.js');${appJsAssetSource}`
        compilation.assets['app.js'] = this.createAsset(source)
      }

      this.addMpJSXComponetFile(compilation)
    })
  }
}

module.exports = TooSimplePlugin

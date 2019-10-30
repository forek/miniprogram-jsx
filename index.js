const webpack = require('webpack')
const getConfig = require('./src/config.js')

module.exports = function (options = {}) {
  const compiler = webpack(getConfig(options))
  new webpack.ProgressPlugin({ entries: true }).apply(compiler)

  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
    } else {
      const outputOptions = {}
      outputOptions.colors = require('supports-color').stdout
      console.log(stats.toString(outputOptions))
    }
  })
}

module.exports()

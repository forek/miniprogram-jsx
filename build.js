const webpack = require('webpack')
const getConfig = require('./src/config.js')

function compilerCallback (err, stats) {
  if (err) {
    console.error(err)
  } else {
    const outputOptions = {}
    outputOptions.colors = require('supports-color').stdout
    console.log(stats.toString(outputOptions), '\n')
  }
}

module.exports = function (options = {}) {
  const compiler = webpack(getConfig(options))
  new webpack.ProgressPlugin({ entries: true }).apply(compiler)

  // compiler.watch({}, compilerCallback)
  compiler.run(compilerCallback)
}

module.exports()

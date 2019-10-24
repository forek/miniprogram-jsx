const webpack = require('webpack')
const getConfig = require('./src/config.js')

module.exports = function (options = {}) {
  const complier = webpack(getConfig(options))
  complier.run()
}

module.exports()
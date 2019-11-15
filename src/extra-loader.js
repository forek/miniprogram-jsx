const qs = require('querystring')
const path = require('path')

module.exports = function (content) {
  const callback = this.async()
  const query = qs.parse(this.resourceQuery.replace(/^\?/, ''))
  if (query.mptype === 'page') {
    const pathObj = path.parse(this.resourcePath)

    const resolver = (exts, cb) => {
      this.resolve(this.context, `./${pathObj.name}${exts[0]}`, (err, result) => {
        if (err) {
          if (exts.length > 1) {
            resolver(exts.slice(1), cb)
          } else {
            cb(err, null)
          }
        } else {
          cb(null, result)
        }
      })
    }

    resolver(this.query.exts, (err, result) => {
      if (err) return callback(null, content)
      callback(null, `import "${result.replace(/\\/g, '/')}";\n${content}`)
    })
  } else {
    callback(null, content)
  }
}

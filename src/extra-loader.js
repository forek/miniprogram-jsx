const qs = require('querystring')
const path = require('path')

module.exports = function (content) {
  const callback = this.async();
  const query = qs.parse(this.resourceQuery.replace(/^\?/, ''))
  // console.log(this.getResolve().toString())
  if (query.mptype === 'page') {
    const pathObj = path.parse(this.resourcePath)
    this.resolve(this.context, `./${pathObj.name}.wxss`, (err, result) => {
      if (err) {
        callback(err)
      } else {
        callback(null, `import style from "${result.replace(/\\/g, '/')}";\n${content}`)
      }
    })
  } else {
    callback(null, content)
  }
}
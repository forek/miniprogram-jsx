const program = require('commander')
const builder = require('../build')

program
  .version(require('../package.json').version)

program
  .option('-w, --watch', '监听项目文件改动, 自动触发构建')
  .action(function (options) {
    const watch = !!options.watch
    builder({ watch })
  })

program.parse(process.argv)
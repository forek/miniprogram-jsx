#!/usr/bin/env node

const program = require('commander')
const build = require('../build')

program
  .version(require('../package.json').version)

program
  .option('-w, --watch', '监听项目文件改动, 自动触发构建')
  .action(function (options) {
    const watch = !!options.watch
    build({ watch })
  })

program.parse(process.argv)
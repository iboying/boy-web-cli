const chalk = require('chalk')
const readline = require('readline')
const symbols = require('log-symbols')
const stripAnsi = require('strip-ansi')

const format = (label, msg) => {
  return msg
    .split('\n')
    .map((line, i) => {
      return i === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length + line.length - 1)
    })
    .join('\n')
}

exports.log = (msg = '') => {
  console.log(msg)
}

exports.info = (msg) => {
  console.log(symbols.info, format(chalk.bgBlue.black(' INFO '), msg))
}

exports.done = (msg) => {
  console.log(symbols.success, format(chalk.bgGreen.black(' DONE '), msg))
}

exports.warn = (msg) => {
  console.warn(symbols.warning, format(chalk.bgYellow.black(' WARN '), chalk.yellow(msg)))
}

exports.error = (msg) => {
  console.error(symbols.error, format(chalk.bgRed(' ERROR '), chalk.red(msg)))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

exports.clearConsole = (title) => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}

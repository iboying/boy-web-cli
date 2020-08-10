const { error, log } = require('./utils')
const commands = require('./commands')
const { name, version } = require('../package.json')

module.exports = class Service {
  constructor(context) {
    process.boy_CLI_SERVICE = this
    this.context = context
    this.commands = commands
  }

  async run(cmd, args, rawArgv) {
    args._ = args._ || []
    let cmdFunc = this.commands[cmd]

    if (cmd && !cmdFunc) {
      error(`command "${cmd}" does not exist.`)
      process.exit(1)
    }
    if (!cmdFunc && (args.version || args.v)) {
      log(`${name} ${version}`)
      process.exit(1)
    }
    if (!cmdFunc || args.help || args.h) {
      cmdFunc = this.commands.help
    } else {
      args._.shift()
      rawArgv.shift()
    }

    cmdFunc(args, rawArgv)
  }
}

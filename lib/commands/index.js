;['generate', 'show'].forEach((cmd) => {
  const mod = require(`./${cmd}`)
  exports[cmd] = mod
  exports[cmd.charAt(0)] = mod
})

exports.help = require('./help')

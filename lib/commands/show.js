/**
 * command: show
 * alias: s
 * resource: [namespace]resource
 */
const path = require('path')
const { error, extractPath } = require('../utils')

module.exports = (args) => {
  const names = args._
  if (!Array.isArray(names) || names.length === 0) {
    error(`There are no resources to show.
    You can run "boy show --help" for help.`)
    process.exit(1)
  }
  const { context } = process.boy_CLI_SERVICE
  names.map(extractPath).forEach(resource => {
    // const resPath = path.resolve(context, 'src/')
    // TODO: show resource information
  })
}

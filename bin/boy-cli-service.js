#!/usr/bin/env node
const { error } = require('../lib/utils')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  error(
    `You are using Node ${process.version}, but boy-cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`,
  )
  process.exit(1)
}

const Service = require('../lib/Service')
const service = new Service(process.cwd())

const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
  alias: {
    h: 'help',
    v: 'version',
  },
  string: [
    'model',
    'store',
    'view',
    'component',
    'scaffold',
    'only',
  ],
  boolean: [
    'help',
    'version',
    // model
    'shallow',
    'single',
    // view
    'template',
    'entry',
  ],
  default: {
    only: 'index#show#form',
  }
})

const command = args._[0]

service.run(command, args, rawArgv).catch((err) => {
  error(err)
  process.exit(1)
})

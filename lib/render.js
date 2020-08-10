const path = require('path')
const ejs = require('ejs')
const config = require('./config')
const { error, createFileByPath, appendFileByPath } = require('./utils')

function renderTemplate(templateKey, resourcePath, data, cb) {
  if (!config[templateKey]) {
    error(`Template "${templateKey}" does not exist.`)
    process.exit(1)
  }

  const { context } = process.boy_CLI_SERVICE
  const { dir, template } = config[templateKey]
  ejs.renderFile(template, data, async (err, str) => {
    if (!err) {
      const filePath = path.resolve(context, dir, resourcePath)
      cb(filePath, str)
    } else {
      error(err)
    }
  })
}

exports.renderFile = (...args) => {
  renderTemplate(...args, createFileByPath)
}

exports.appendFile = (templateKey, resourcePath, data) => {
  renderTemplate(templateKey, resourcePath, data, (filePath, str) => {
    appendFileByPath(filePath, str, `interface I${data.params.className}`)
  })
}

const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir')
const { snakeCase, pascalCase, camelCase } = require('change-case')
const { plural } = require('pluralize')
const logger = require('./logger')

Object.assign(exports, logger)

exports.createFileByPath = (filePath, str) => {
  const relativePath = path.relative(process.cwd(), filePath)
  if (fs.existsSync(filePath)) {
    logger.info(`Skip => ${relativePath}`)
  } else {
    makeDir.sync(path.dirname(filePath))
    fs.writeFileSync(filePath, str, 'utf8')
    logger.done(`Create => ${relativePath}`);
  }
}

exports.appendFileByPath = (filePath, str, identity) => {
  const relativePath = path.relative(process.cwd(), filePath)
  if (fs.existsSync(filePath)) {
    const text = fs.readFileSync(filePath, 'utf-8')
    if (text.includes(identity)) {
      logger.info(`Existed => ${relativePath} [${identity}]`)
    } else {
      fs.appendFileSync(filePath, str, 'utf-8')
      logger.done(`Append => ${relativePath} [${identity}]`);
  }
  } else {
    makeDir.sync(path.dirname(filePath))
    fs.writeFileSync(filePath, str, 'utf8')
    logger.done(`Append => ${relativePath} [${identity}]`);
  }
}

exports.extractPath = (pathStr = '') => {
  const { sep, normalize, join, parse } = path
  const rightPath = normalize(pathStr)
  const relativePath = rightPath.startsWith(sep) ? rightPath.slice(1) : rightPath
  const { dir, name } = parse(relativePath)
  const paths = dir ? dir.split(sep).map(snakeCase) : []
  const fileName = snakeCase(name)
  const className = pascalCase(name)
  const pathClassName = paths.map(pascalCase).concat(className).join('')
  const pathFileName = camelCase(pathClassName)
  return {
    paths,
    fileDir: join(...paths),
    namespace: join('/', ...paths),
    filePath: join(...paths, fileName),
    fileName,
    className,
    pathFileName,
    pathClassName,
    idName: `${fileName}Id`,
    plural: {
      filePath: join(...paths, plural(fileName)),
      fileName: plural(fileName),
      className: plural(className),
      pathFileName: plural(pathFileName),
      pathClassName: plural(pathClassName),
      idName: `${plural(fileName)}Id`,
    }
  }
}

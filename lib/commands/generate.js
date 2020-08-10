/**
 * command: generate
 * alias: g
 * modules: model | store | view | component | scaffold
 * options: --shallow | --single | --template | --entry | --only
 */
const path = require('path')
const { pascalCase, snakeCase } = require('change-case')
const config = require('../config')
const { error, warn, extractPath } = require('../utils')
const { renderFile, appendFile } = require('../render')

module.exports = (args) => {
  const module = args._[0]
  const runCreator = moduleCreators[module]
  if (!runCreator) {
    error(`Can not create "${module}", only support ${Object.keys(moduleCreators)}.`)
    process.exit(1)
  }
  const resourcePath = args._[1]
  if (!resourcePath) {
    error(`Please set resource for the ${module}.
    For example:
    $ boy generate ${module} admin/user`)
    process.exit(1)
  }
  args._.splice(0, 2)
  runCreator.call(moduleCreators, resourcePath, args)
}

const moduleCreators = {
  model(resourcePath, args) {
    const { shallow, single } = args
    const params = extractPath(resourcePath)
    const schema = getModelSchema(args)
    renderFile('model', `${params.filePath}.ts`, {
      schema,
      params,
      shallow,
      single,
    })
    appendFile('interface', 'model.d.ts', {
      params,
      schema,
    })
  },
  store(resourcePath, args) {
    const params = extractPath(resourcePath)
    renderFile('store', `${params.filePath}.store.ts`, {
      params,
    })
  },
  view(resourcePath, args) {
    const params = extractPath(resourcePath)
    const restfulPages = (args.only ? args.only.split('#') : [])
      .map(snakeCase)
      .filter(name => config.restfulViews.includes(name))
    if (args.entry) {
      restfulPages.push('entry')
    }
    const extraPages = args._.filter(name => !!name.match(/^[A-Za-z\_]+$/)).map(snakeCase)
    const allPages = Array.from(new Set(extraPages.concat(restfulPages)))
    if (allPages.length === 0) {
      warn(`No views specified for this command.
      A right example:
      $ boy generate view User records someOtherPageName --only index#form`)
      process.exit(1)
    }
    const routes = []
    allPages.forEach(name => {
      let templateName = `view_${name}`
      if (args.template && name === 'form') {
        templateName = 'view_form_template'
      } else if (args.entry && name === 'entry') {
        templateName = 'view_show_entry'
      } else if (!config[templateName]) {
        templateName = 'view'
      }
      const configOption = config[templateName] || config.view
      const viewName = pascalCase(configOption.name || name)
      const filePath = path.format({
        root: params.plural.filePath,
        name: '/' + viewName,
        ext: '.vue',
      })
      renderFile(templateName, filePath, {
        schema: getModelSchema(args),
        params,
      })
      // add route config
      const defaultRoute = {
        path: `/${params.plural.filePath}`,
        name: params.plural.pathFileName + viewName,
        componentPath: `@/views/${filePath}`,
      }
      if (viewName === 'Index') {
        routes.push(defaultRoute)
      } else if (viewName === 'Show') {
        routes.push({
          ...defaultRoute,
          path: `/${params.plural.filePath}/:${params.idName}`
        })
      } else if (viewName === 'Entry') {
        routes.push({
          ...defaultRoute,
          path: `/${params.plural.filePath}/:${params.idName}`,
          children: [],
        })
      } else if (viewName === 'Form') {
        routes.push({
          ...defaultRoute,
          name: `${defaultRoute.name}New`,
          path: `/${params.plural.filePath}/:${params.idName}/new`,
        }, {
          ...defaultRoute,
          name: `${defaultRoute.name}Edit`,
          path: `/${params.plural.filePath}/:${params.idName}/edit`
        })
      } else {
        routes.push({
          ...defaultRoute,
          path: `/${params.plural.filePath}/:${params.idName}/${params.fileName}`
        })
      }
    })
    // generate routes
    renderFile('route', `${params.plural.filePath}.route.js`, {
      routes,
    })
  },
  component(resourcePath, args) {
    const params = extractPath(resourcePath)
    const filePath = path.format({
      root: params.fileDir,
      name: `/Com${params.className}`,
      ext: '.vue',
    })
    renderFile('component', filePath, {
      params,
    })
  },
  scaffold(resourcePath, args) {
    this.model(resourcePath, args)
    this.store(resourcePath, args)
    this.view(resourcePath, args)
  },
}

function getModelSchema(args) {
  return args._.map(val => val.split(':'))
    .filter(ary => ary.length === 2)
    .map(ary => ary[1].includes('#') ? [ary[0], `'${ary[1].split('#').join("' | '")}'`] : ary)
}

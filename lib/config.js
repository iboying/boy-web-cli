const path = require('path')

function getTemplatePath(name, ext = 'ejs') {
  return path.resolve(__dirname, `./template/${name}.${ext}`)
}

module.exports = {
  restfulViews: ['index', 'show', 'form'],
  model: {
    dir: 'src/models',
    template: getTemplatePath('model')
  },
  interface: {
    dir: 'src/types',
    template: getTemplatePath('interface')
  },
  store: {
    dir: 'src/store/modules',
    template: getTemplatePath('store')
  },
  component: {
    dir: 'src/components',
    template: getTemplatePath('component')
  },
  route: {
    dir: 'src/router',
    template: getTemplatePath('route')
  },
  view: {
    dir: 'src/views',
    template: getTemplatePath('view')
  },
  view_index: {
    dir: 'src/views',
    name: 'Index',
    template: getTemplatePath('view_index')
  },
  view_show: {
    dir: 'src/views',
    name: 'Show',
    template: getTemplatePath('view_show')
  },
  view_show_entry: {
    dir: 'src/views',
    name: 'Entry',
    template: getTemplatePath('view_show_entry')
  },
  view_form: {
    dir: 'src/views',
    name: 'Form',
    template: getTemplatePath('view_form')
  },
  view_form_template: {
    dir: 'src/views',
    name: 'Form',
    template: getTemplatePath('view_form_template')
  },
}

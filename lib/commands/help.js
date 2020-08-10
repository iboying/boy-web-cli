/**
 * command: help
 * alias: h
 */
const { log } = require('../utils')

const typeLog = {
  main: `
Usage: 
  $ boy <command> [options]

Options:
  -V, --version                                                     输出版本号
  -h, --help                                                        输出帮助信息

Commands:
  generate <targets> <[namespace]resource> [options]                生成指定的项目资源
  show <targets> <[namespace]resource> [options]                    显示指定资源相关的信息，比如：路由、模型、Store、页面等
  help                                                              显示帮助信息

  执行 boy <command> --help 可以获取具体子命令的帮助信息。
  `,
  generate: `
生成指定的项目资源

Usage: 
  $ boy generate <targets> <[namespace]resource> [options]       生成具体资源
  $ boy g <targets> <[namespace]resource> [options]              生成具体资源

Targets:
  model                                                             模型：接口 Restful 模型
  store                                                             store：Vuex module store
  view                                                              可访问页面：和具体业务、接口耦合的页面组件
  component                                                         组件：和接口无关的复用逻辑
  scaffold                                                          脚手架：一次性生成 model、store、view

Resources:
  一个 Restful 实体资源

Namespace:
  资源的命名空间

Options:
  --single                                                          model 开启 single 模式
  --shallow                                                         model 开启 shallow 模式
  --entry                                                           使用资源详情入口页面
  --only <pages>                                                    允许添加的 Restful 路由页面，以 # 号分隔，支持：index#show#form
  --template                                                        form 页面使用表单模板
  
Examples:
  $ boy g scaffold namespace/user CustomView id:number name:string sex:female#male --single --only index#show --entry
  $ boy g model admin/user id:number name:string sex:female#male meta:object --shallow
  $ boy g view admin/user my_view
  $ boy g view admin/people --template
  $ boy g component admin/user_selector
  `,
  show: `
显示指定资源的项目信息

Usage: 
  $ boy show <[namespace]resource>                               显示具体资源信息
  $ boy s <[namespace]resource>                                  显示具体资源信息

Resources:
  一个 Restful 实体资源

Namespace:
  资源的命名空间
  
Examples:
  $ boy show admin/user
  $ boy show user
  `,
}

module.exports = (args) => {
  let cmd = args._[0] || 'main'
  cmd = cmd === 'g' ? 'generate' : cmd
  cmd = cmd === 's' ? 'show' : cmd
  log(typeLog[cmd] || typeLog.main)
}

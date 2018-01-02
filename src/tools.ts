import * as fs from "fs"
var Module = require('module')
export function requirePath(filename:string):any {
  if(!fs.existsSync(filename)) {
    throw new TypeError('Not found manifest file!')
  }
  let code:string = fs.readFileSync(filename, 'utf8')
  let mod = new Module(filename)
  mod.filename = filename
  mod._compile(code, filename)
  mod.paths = Module._nodeModulePaths(filename)
  return mod.exports
}


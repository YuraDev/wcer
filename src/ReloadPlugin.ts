import * as fs from "fs"
import Server from "./socketServer"
import {info, error} from "./logger"
import {merge, template} from "lodash"
import AbstractPlugin from "./abstractPlugin"
import {ConcatSource} from "webpack-sources"
import {requirePath} from "./tools"
import * as client from "raw-loader!./client.ts"

let chunkVersions: object = {}
let manifestTimestamp: number

export default class ReloadPlugin extends AbstractPlugin {
  private port: number
  private server: Server | null = null
  private manifest: Manifest
  private manifestPath: string
  constructor({port, manifest}: Options) {
    super();
    this.port = port || 9090 
    this.manifestPath = manifest || null
  }
  sourceFactory(...sources): Source {
    return new ConcatSource(...sources)
  } 
  watcher (comp, done) {
    if(!this.server && this.manifestPath) {
      this.server = new Server(this.port)
    }
    return done()
  }
  compile (comp) {
    try {
      this.manifest = requirePath(`${this.manifestPath}`)
    } catch(err) {
      error((<Error>err).message)
    }
  }
  injector(comp, chunks) {
    let WSHost =  `ws://localhost:${this.port}/`
    if(!this.server || !this.manifest) return false;
    let {background} = this.manifest;
    let assets = chunks.reduce((res, chunk) => {
      let [filename] = chunk.files;
      if (/\.js$/.test(filename)) {
        let source = template(client)({
          filename, 
          id: chunk.id,
          name: chunk.name || null,
          WSHost
        })
        res[filename] = this.sourceFactory(source, comp.assets[filename])
      }
      return res
    }, {})
    if(!background ||!(background.page || background.scripts)) {
      let scripts: string ='background.reload.js';
      let source = template(client)({
        filename: [scripts],
        id: '-1',
        name: scripts,
        WSHost
      })
      this.manifest.background = {scripts:[scripts], persistent: false}
      assets[scripts] = { 
        source: () => source, 
        size: () => source.length 
      }
    }
    comp.assets = Object.assign({}, comp.assets, assets)
  }
  triggered (comp, done) {
    if(!this.server || !this.manifest) return done();
    let { content_scripts, background } = this.manifest;
    let scripts = background.scripts ? background.scripts : [];
    if(content_scripts && content_scripts.length) {
      content_scripts.forEach(content => scripts = scripts.concat(content.js));
    }
    info(' Starting the Chrome Hot Plugin Reload Server...')
    comp.chunks.forEach(function(chunk, name) {
      var hash = chunkVersions[chunk.name];
      chunkVersions[chunk.name] = chunk.hash;
      if(chunk.hash !== hash ) {
        let changed = chunk.files.filter( file => scripts.indexOf(file) !== -1)
        if(changed.length) {
          this.server.signRestart()
        } else {
          this.server.signReload(chunk.id, chunk.id)
        }
      }
    }.bind(this))
  
    let manifest = comp.fileTimestamps[this.manifestPath]
    if ((manifestTimestamp || 1) < (manifest || Infinity)) {
      manifestTimestamp = Date.now();
      console.log('manifestTimestamp')
      this.server.signRestart()
    }
    return done()
  }
  generate(comp, done) {
    if(!this.manifest) return done()
    comp.fileDependencies.push(this.manifestPath)
    let source = JSON.stringify(this.manifest)
    comp.assets['manifest.json'] = {
      source: () => source,
      size: () => source.length
    }
    return done()
  }
  apply(compiler) { 
    compiler.plugin("watch-run", (comp, done) => this.watcher(comp, done))
    compiler.plugin("compile", (comp) => this.compile(comp))
    compiler.plugin('compilation',
    (comp) => comp.plugin('after-optimize-chunk-assets',
      (chunks) => this.injector(comp, chunks)))
    compiler.plugin('after-emit', (comp, done) => this.triggered(comp, done))
    compiler.plugin('emit', (comp, done) => this.generate(comp, done))
  }
}
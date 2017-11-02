const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const {OPEN, Server} = require('ws')
const {info, error} = require('./logger')
const {ConcatSource} = require('webpack-sources')

const _default = { manifest: undefined,  port: 9090 }
const middleware = fs.readFileSync(path.join(__dirname, 'middleware.js'), 'utf8')

function ReloadPlugin(options) {
  this.chunkVersions = {}
  this.options = _.merge(_default, options)
}
ReloadPlugin.prototype.sourceFactory = (...sources)  => new ConcatSource(...sources)
ReloadPlugin.prototype.watcher = function(comp, done) {
  if(this.server || !this.options.manifest) return done();
  this.server = new Server({port: this.options.port})
  this.server.on('connection', ws => {
    ws.on('message', (data) => info(`Chrome: ${JSON.parse(data).payload}`))
  })
  return done()
}

ReloadPlugin.prototype.compile = function(comp) {
  let {manifest} = this.options
  if (fs.existsSync(manifest)) {
    this.manifest = require(manifest)
    delete require.cache[require.resolve(manifest)]
  } else {
    error(new Error('[ Error: ReloadPlugin - Not found manifest file! ]'))
  }
}

ReloadPlugin.prototype.sign = function(type, payload) { 
  return new Promise((resolve, reject) => {
    try {
      this.server.clients.forEach(client => {
        if (client.readyState === OPEN) {
          client.send(JSON.stringify({type, payload}))
        }
      })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

ReloadPlugin.prototype.injector = function(comp, chunks) {
  if(!this.server || !this.manifest) return false;
  let { background } = this.manifest;
  let assets = chunks.reduce((res, chunk) => {
    let [filename] = chunk.files;
    if (/\.js$/.test(filename)) {
      let source = _.template(middleware)({
        filename, 
        id: chunk.id,
        name: chunk.name || null,
        WSHost: `ws://localhost:${this.options.port}`
      })
      res[filename] = this.sourceFactory(source, comp.assets[filename])
    }
    return res
  }, {})
  if(!background ||!(background.page || background.scripts)) {
    let scripts = ['background.reload.js'];
    let source = _.template(middleware)({
      filename: scripts, 
      id: '-1',
      name: scripts[0],
      WSHost: `ws://localhost:${this.options.port}`
    })
    this.manifest.background = {scripts, persistent: false}
    assets[scripts] = { 
      source: () => source, 
      size: () => source.length 
    }
  }
  comp.assets = Object.assign({}, comp.assets, assets)
}

ReloadPlugin.prototype.triggered = function(comp, done) {
  if(!this.server || !this.manifest) return done();
  let { content_scripts, background } = this.manifest;
  let scripts = background.scripts ? background.scripts : [];
  content_scripts.forEach(content => scripts = scripts.concat(content.js));
  info('[ Starting the Chrome Hot Plugin Reload Server... ]')
  comp.chunks.forEach(function(chunk, name) {
    var hash = this.chunkVersions[chunk.name];
    this.chunkVersions[chunk.name] = chunk.hash;
    if(chunk.hash !== hash) {
      let changed = chunk.files.filter( file => scripts.indexOf(file) != -1)
      if(changed.length) {
        this.sign('restart', true)
      } else {
        this.sign('reload', {id: chunk.id})
      }
    }
  }.bind(this))

  let manifest = comp.fileTimestamps[this.options.manifest]
  if ((this.manifestTimestamp || 1) < (manifest || Infinity)) {
    this.manifestTimestamp =  Date.now();
    this.sign('restart', true)
  }
  return done()
}

ReloadPlugin.prototype.generate = function(comp, done) {
  if(!this.manifest) return done()
  comp.fileDependencies.push(this.options.manifest)
  let source = JSON.stringify(this.manifest)
  comp.assets['manifest.json'] = {
    source: () => source,
    size: () => source.length
  }
  return done()
}

ReloadPlugin.prototype.apply = function(compiler) {
  compiler.plugin("watch-run", (comp, done) => this.watcher(comp, done))
  compiler.plugin("compile", (comp) => this.compile(comp))
  compiler.plugin('compilation',
  (comp) => comp.plugin('after-optimize-chunk-assets',
    (chunks) => this.injector(comp, chunks)))
  compiler.plugin('after-emit', (comp, done) => this.triggered(comp, done))
  compiler.plugin('emit', (comp, done) => this.generate(comp, done))
}

module.exports = ReloadPlugin

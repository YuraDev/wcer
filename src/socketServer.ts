import * as path from "path";
import * as http from "http";
import { info, error, warn } from "./logger"
import * as websocket from "websocket-driver";
import * as cert from "raw-loader!../ssl/server.crt"
import * as key from "raw-loader!../ssl/key.pem"

export default class HotReloaderServer {
  private server: http.Server;
  private sockets: {[key:string]: Socket} = {};
  constructor(port: number, host:string = 'localhost') {
    this.server = http.createServer(function(req, res){ 
      let data = '<h1>WCER</h1><p>Webpack plugin to enable reloading while developing Chrome extensions.</p>'
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length})
      res.write(data);
      res.end();
    })
    this.server.on('error', err => error(err.message))
    this.server.on('upgrade', (req, socket, head) => this.handleUpgrade(req, socket, head))
    this.server.listen(port, host)
  }
  private handleUpgrade(req, socket, head) {
    if (!websocket.isWebSocket(req)) return;
    let driver = websocket.http(req)
    let id = req.url.match(/^\/([^\/]*)/)[1]
    driver.io.write(head)
    this.sockets[id] = driver
    socket.pipe(driver.io).pipe(socket)
    driver.messages.on('data', data => this.message(data, id))
    driver.on('close', () => delete this.sockets[id])
    driver.start()
  }
  private message (json: string, id: string) {
    let {type, data} = JSON.parse(json)
    if(type === 'error') return error(`${data}`)
    if(type === 'warn') return warn(`${data}`)
    info(`${data}`)
  }
  sign(type: string, data: any, sockets?: Array<number> | number): Promise<any> {
    if(typeof sockets !== 'undefined') {
      let socks = Array.isArray(sockets) ? sockets : [sockets]
      for(let sock of socks) {
        if(this.sockets[sock]) {
          this.sockets[sock].text(JSON.stringify({ type, data }))
        }
      }
    } else {
      for(let sock in this.sockets) {
        this.sockets[sock].text(JSON.stringify({ type, data }))
      }
    }
    return Promise.resolve()
  }
  signRestart(sock?: number) {
    return this.sign('restart', true, sock)
  }
  signReload(id:number, sock?: number) {
    return this.sign('reload', {id}, sock)
  }
}
/* -------------------------------------------------- */
/*  Start of Webpack Chrome Hot Extension Middleware  */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
(function (chrome, window) {

  const name = '<%= name %>';
  const wsHost = '<%= WSHost %>';
  const id = parseInt('<%= id %>');
  const filename = '<%= filename %>';
  const {runtime, tabs} = chrome;
  const formatter = (msg) => '[ WCER: '+msg+' ]';
  const logger = (msg, level = 'info') => console[level](formatter(msg));
  const timeFormatter = (date) => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  const manifest = ( runtime && runtime.getManifest ) ? runtime.getManifest() : undefined;
  var path = (manifest? manifest.name : '')+' | '+(name || filename);
  if (path.length > 43) path = path.slice(0, 20) + '...' + path.slice(-20);
  function init() {
    window.WebpackReloadPlugin = true;
    var socket = new WebSocket(wsHost)
    socket.onopen = () => logger(wsHost);
    socket.onmessage = ({data}) => {
      const {type, payload} = JSON.parse(data);
      let send = (type, payload) => socket.send(JSON.stringify({type, payload}))
      if (runtime.reload && type === 'restart') {
        runtime.reload()
        runtime.restart()
        send('restart', formatter(timeFormatter(new Date())+' - '+path+' successfully restart'));
      }
      console.log(id,payload)
      if(type === 'reload' && id === payload.id){
        window.location.reload()
        send('reloaded', formatter(timeFormatter(new Date())+' - '+path+' successfully reloaded'));
      }
    }
    socket.onclose = ({code}) => {
      logger("Socket connection closed. Code "+code+". See more in https://tools.ietf.org/html/rfc6455#section-7.4.1", 'warn')
      setTimeout(()=> {
        logger('WEPR Attempting to reconnect ...');
        init();
        logger('Reconnected. Reloading plugin');
      }, 2000)
    }
  }
  !window.WebpackReloadPlugin ? init() : logger('WebpackReloadPlugin: Socket already started !');
})(chrome, window);
/* ----------------------------------------------- */
/* End of Webpack Chrome Hot Extension Middleware  */
/* ----------------------------------------------- */
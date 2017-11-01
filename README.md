# Webpack Chrome Extension Reloader

+ Creates a manifest.json
+ Reload only the chunk (location.reload) not all files.
+ Restarts the application chrome extension if the file has changed manifest, content_scripts, background.scripts
+ Add background.reload.js if it was not in manifest.js
+ Supports background, content_scripts, devtools, options, popup, tab

```js
const ReloadPlugin  = require('wcer');

module.exports = {
//...
    plugins: [
      new ReloadPlugin({
        port: 9090,
        manifest: path.join(__dirname, '..', 'src', 'manifest.js')
      })
    ] 
//...
}
```
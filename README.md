# Webpack Chrome Extension Reloader [![npm version](https://badge.fury.io/js/wcer.svg)](https://badge.fury.io/js/wcer) 
> Webpack plugin to enable reloading while developing Chrome extensions.

+ Creates a manifest.json
+ Reload only the chunk not all files.
+ Restarts the chrome extension if has changed manifest.js, content_scripts.js, background.scripts
+ Add background.reload.js if it was not in manifest.js to work plugin
+ Supports background, content_scripts, devtools, options, popup, tab

## Installation

```bash
npm install wcer --save-dev
// or
yarn add wcer  --dev
```
## Usage
```js
const ChromeReloadPlugin  = require('wcer');

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
## Example
 + [Vue.js Chrome Extension](https://github.com/YuraDev/vue-chrome-extension-template)
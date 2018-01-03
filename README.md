# Webpack Chrome Extension Reloader [![npm version](https://badge.fury.io/js/wcer.svg)](https://badge.fury.io/js/wcer)

![Webpack Chrome Extension Reloade images](/docs/images/mini.jpg)

+ Creates a manifest.json
+ Reload only the chunk not all files.
+ Restarts the chrome extension if has changed manifest.js, content_scripts.js, background.scripts
+ background, content_scripts, devtools, options, popup, tab

## Installation

```bash
npm install wcer --save-dev
// or
yarn add wcer --dev
```
## Usage
Add wcer to the plugins section of your webpack configuration file.
```js
const ChromeReloadPlugin  = require('wcer');

module.exports = {
//...
    plugins: [
      new ChromeReloadPlugin({
        port: 9090, //optional, default: 9090
        manifest: path.join(__dirname, '..', 'src', 'manifest.js')
      })
    ] 
//...
}
```
## Example
 + [Vue.js Chrome Extension](https://github.com/YuraDev/vue-chrome-extension-template)
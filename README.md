#Webpack Chrome Extension Reloader

+ Creates a manifest.json
+ Reload only the manifest chunk (location.reload)
+ Restarts the application chrome extension if the file has changed manifest, content_scripts, background.scripts
+ Add background.reload.js if it was not in manifest.js
+ Supports background, content_scripts, devtools, options, popup, tab

module.exports = {
  name: 'Chrome Extension',
  version: '1.0.0',
  description: 'chrome extension',
  author: 'yura',
  manifest_version: 2,
  icons: { '16': 'icons/16.png', '128': 'icons/128.png' },
  permissions: [
    '<all_urls>',
    '*://*/*',
    'activeTab',
    'tabs',
    'cookies',
    'background',
    'contextMenus',
    'unlimitedStorage',
    'storage',
    'notifications',
    'identity',
    'identity.email'
  ],
  browser_action: {
    default_title: 'Заголовок',
    default_popup: 'pages/popup.html'
  },
  background: {
    persistent: false,
    page: 'pages/background.html'
  },
  devtools_page: 'pages/devtools.html',
  options_page: 'pages/options.html',
  content_scripts: [{
    js: [ 'js/inject.js' ],
    run_at: 'document_end',
    matches: ['<all_urls>'],
    all_frames: true
  }],
  oauth2: {
    client_id: '120670425664-pk59sqvnb3p5iuupkbu2mj5oe7g0sqca.apps.googleusercontent.com',
    scopes: [
      'https://picasaweb.google.com/data/', 'https://www.googleapis.com/auth/userinfo.profile', 'openid', 'email', 'profile'
    ]
  },
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: [ 'panel.html', 'js/content.js' ]
}

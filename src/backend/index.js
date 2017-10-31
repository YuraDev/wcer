chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
    chrome.tabs.create({ url: 'pages/app.html' })
  })
})

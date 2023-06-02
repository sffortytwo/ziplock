browser.runtime.onMessage.addListener(function(message) {
  if (message.action === 'blocked') {
    alert("This webpage has been blocked because in might be a phishing attempt.\n\nIf you trust this url, add it to the whitelist in the extension options.");
  }
});

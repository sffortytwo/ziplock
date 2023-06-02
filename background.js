function interceptRequest(requestDetails) {
  var blocked = false;
  let url = decodeURI(requestDetails.url);

  //  If this is a .zip TLD and contains an @ symbol
  if (url.indexOf(".zip") != -1 && url.indexOf("@") != -1) {
    // If any of the fake forward slash characters are present, block the request
    if (url.indexOf("⁄") != -1) { blocked = true; }
    if (url.indexOf("∕") != -1) { blocked = true; }
    if (url.indexOf("／") != -1) { blocked = true; }
    if (url.indexOf("⧸") != -1) { blocked = true; }
    if (url.indexOf("⫽") != -1) { blocked = true; }
    console.log(`Blocked: ${blocked}`);
  }

  if (blocked) {
    browser.notifications.create({
      "type": "basic",
      // "iconUrl": browser.extension.getURL("icon.png"), // optional, provide an icon for the notification
      "title": "Request Blocked",
      "message": "This url is a potential phishing attack"
    });
    return { cancel: true };
  }
}

browser.webRequest.onBeforeRequest.removeListener(interceptRequest);
browser.webRequest.onBeforeRequest.addListener(
  interceptRequest,
  { urls: ["<all_urls>"] },
  ["blocking"]
);
// console.log(browser.webRequest.onBeforeRequest.hasListener(interceptRequest));

console.log("background.js has been loaded");

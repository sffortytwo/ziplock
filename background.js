function interceptRequest(requestDetails) {
  var blocked = false;
  //  If this is a .zip TLD
  if (requestDetails.url.indexOf(".zip") != -1 && requestDetails.url.indexOf("@") != -1) {
    console.log(requestDetails.url);
    if (requestDetails.url.indexOf("⁄") != -1) { blocked = true; }
    if (requestDetails.url.indexOf("∕") != -1) { blocked = true; }
    if (requestDetails.url.indexOf("／") != -1) { blocked = true; }
    if (requestDetails.url.indexOf("⧸") != -1) { blocked = true; }
    if (requestDetails.url.indexOf("⫽") != -1) { blocked = true; }
    console.log(`Blocked: ${blocked}`);
  }

  if (blocked) {
    browser.notifications.create({
      "type": "basic",
      // "iconUrl": browser.extension.getURL("icon.png"), // optional, provide an icon for the notification
      "title": "Request Blocked",
      "message": "The request to this URL has been blocked: " + requestDetails.url
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

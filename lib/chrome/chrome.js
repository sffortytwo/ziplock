var app = {};

app.version = function () {return chrome.runtime.getManifest().version};
app.homepage = function () {return chrome.runtime.getManifest().homepage_url};

app.tab = {
  "reload": function () {chrome.tabs.reload()},
  "openOptions": function () {chrome.runtime.openOptionsPage()},
  "open": function (url) {chrome.tabs.create({"url": url, "active": true})}
};

app.button = {
  "clicked": function (callback) {
    chrome.browserAction.onClicked.addListener(callback);
  }
};

app.notifications = {
  "create": function (message) {
    if (config.addon.notifications) {
      chrome.notifications.create("block-site-notifications", {
        "type": "basic", 
        "message": message, 
        "title": "Block Site", 
        "iconUrl": chrome.runtime.getURL("data/icons/64.png")
      }, function () {}); 
    }
  }
};

app.contextmenus = (function () {
  var callback;
  chrome.contextMenus.onClicked.addListener(function (e) {
    if (callback) callback(e);
  });
  /*  */
  return {
    "clicked": function (e) {callback = e},
    "create": function () {
      chrome.contextMenus.removeAll(function () {
        chrome.contextMenus.create({
          "id": "test",
          "title": "Test Block Site",
          "contexts": ["browser_action"]
        });
        /*  */
        chrome.contextMenus.create({
          "id": "info",
          "contexts": ["page"],
          "title": "Block this domain"
        });
      });
    }
  };
})();

app.storage = (function () {
  var objs = {};
  window.setTimeout(function () {
    chrome.storage.local.get(null, function (o) {
      objs = o;
      var script = document.createElement("script");
      script.src = "../common.js";
      document.body.appendChild(script);
    });
  }, 0);
  /*  */
  return {
    "read": function (id) {return objs[id]},
    "changed": function (callback) {chrome.storage.onChanged.addListener(callback)},
    "write": function (id, data) {
      var tmp = {};
      tmp[id] = data;
      objs[id] = data;
      chrome.storage.local.set(tmp, function () {});
    }
  }
})();

if (!navigator.webdriver) {
  chrome.runtime.setUninstallURL(app.homepage() + "?v=" + app.version() + "&type=uninstall", function () {});
  chrome.runtime.onInstalled.addListener(function (e) {
    chrome.management.getSelf(function (result) {
      if (result.installType === "normal") {
        window.setTimeout(function () {
          var previous = e.previousVersion !== undefined && e.previousVersion !== app.version();
          var doupdate = previous && parseInt((Date.now() - config.welcome.lastupdate) / (24 * 3600 * 1000)) > 45;
          if (e.reason === "install" || (e.reason === "update" && doupdate)) {
            var parameter = (e.previousVersion ? "&p=" + e.previousVersion : '') + "&type=" + e.reason;
            app.tab.open(app.homepage() + "?v=" + app.version() + parameter);
            config.welcome.lastupdate = Date.now();
          }
        }, 3000);
      }
    });
  });
}

app.options = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendeponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "options-to-background") {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data, tabId) {
      chrome.runtime.sendMessage({"path": "background-to-options", "method": id, "data": data});
    }
  }
})();
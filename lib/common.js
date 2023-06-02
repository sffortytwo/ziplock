var core = {
    "extract": {
      "hostname": function (e) {
        var hostname = e;
        try {
          var tmp = new URL(e).hostname;
          if (tmp) hostname = tmp.replace("www.", '');
        } catch (e) {}
        /*  */
        return hostname;
      }
    },
    "update": {
      "listener": function (callback) {
        var filter = {"urls": ["*://*.zip/*"], "types": ["main_frame", "sub_frame"]};
        chrome.webRequest.onBeforeRequest.addListener(core.update.observer, filter, ["blocking"]);
        callback(true);
      },
      "observer": function (info) {
        var hostname = core.extract.hostname(info.url);

        // TODO: check if the domain looks suspicious?
        console.error(hostname + " is blocked! to remove this domain from the blocklist, please visit options page.");
        app.notifications.create(hostname + " is blocked! to remove this domain from the blocklist, please visit options page.");

        console.error("Showing the confirmation")
        result = window.confirm("This page looks suspicious, do you want to continue?")
        console.error("After the confirmation with result: " + result)
        
        // TODO: ask user for confirmation? stop/continue, set cancel value depending on that?
        return {"cancel": !result};
      }
    }
  };
  
  core.update.listener(function () {
    if (config.log) console.error(">>", "webrequest observer is updated!");
  });

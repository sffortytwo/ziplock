document.body.style.border = "5px solid red";

console.log("OMERELLO root")


var core = {
    "extract": {
      "hostname": function (e) {
        console.log("OMERELLO extract->hostname")
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
        console.log("OMERELLO core->update->listener")

        var urls = [];
        /*  */
        for (var domain in ["mozilla.org"]) {
          domain = domain.replace("www.", '');
          urls.push("*://" + domain + "/*");      
          urls.push("*://www." + domain + "/*");      
        }
        /*  */
        chrome.webRequest.onBeforeRequest.removeListener(core.update.observer);
        if (urls.length) {
          var filter = {"urls": urls, "types": ["main_frame", "sub_frame"]};
          chrome.webRequest.onBeforeRequest.addListener(core.update.observer, filter, ["blocking"]);
        }

        console.log("OMERELLO core->update->listener before callback")
        /*  */
        callback(true);

        console.log("OMERELLO core->update->listener after callback")
      },
      "observer": function (info) {
        console.log("OMERELLO update->observer")

        var hostname = core.extract.hostname(info.url);
        if (config.log) console.error(">>", "url", info.url, "info", info);
        
        /*  */
        if (hostname in ["mozilla.org"]) {
          var redirect = false;
          if (config.log) console.error(">>", "hostname", hostname, ("blocklist-" + (info.type === "main_frame" ? "domains" : "iframes")), blocklist, "redirect", redirect);
          /*  */
          if (redirect) {
            app.notifications.create(hostname + " is blocked & redirected to:\n" + (redirect || 'N/A'));
            if (config.log) console.error(hostname + " is blocked & redirected to:\n" + (redirect || 'N/A'));
            redirect = (redirect.indexOf("http") === 0 || redirect.indexOf("ftp") === 0) ? redirect : "https://" + redirect;
            return {"redirectUrl": redirect};
          } else {
            if (config.log) console.error(hostname + " is blocked! to remove this domain from the blocklist, please visit options page.");
            app.notifications.create(hostname + " is blocked! to remove this domain from the blocklist, please visit options page.");
            return {"cancel": true};
          }
        }
      }
    }
  };
  
  core.update.listener(function () {
    console.log("OMERELLO core.update.listener begin")

    if (config.log) console.error(">>", "webrequest observer is updated!");
    console.log("OMERELLO core.update.listener end")
    
  });
  
//   app.storage.changed(function () {
//     core.update.listener(function () {
//       app.options.send("update");
//       if (config.log) console.error(">>", "webrequest observer is updated!");
//     });
//   });
  
//   app.contextmenus.clicked(function (e) {  
//     if (e.menuItemId === "test") {
//       app.tab.open(config.test.page);
//     } else {
//       if (e.pageUrl) {
//         var tmp = config.blocklist.domains;
//         var hostname = core.extract.hostname(e.pageUrl);
//         if (hostname) {
//           tmp[hostname] = null;
//           config.blocklist.domains = tmp;
//         }
//         /*  */
//         if (config.log) console.error(">>", "hostname", hostname, "blocklist", config.blocklist.domains);
//         window.setTimeout(app.tab.reload, 300);
//       }
//     }
//   });
  
//   app.options.receive("test", function () {app.tab.open(config.test.page)});
//   app.options.receive("support", function () {app.tab.open(app.homepage())});
//   app.options.receive("blocklist", function (e) {config.blocklist.domains = e});
//   app.options.receive("notifications", function (e) {config.addon.notifications = e});
//   app.options.receive("blocklist-iframes", function (e) {config.blocklist.iframes = e});
//   app.options.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});
  
//   window.setTimeout(app.contextmenus.create, 300);
//   app.button.clicked(function () {app.tab.openOptions()});
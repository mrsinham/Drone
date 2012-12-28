/**
 * Main entry point for the drone background engine
 */


// First of all, ensuring that the servers are loaded
if ('undefined' === typeof(aServers)) {
    alert('unable to find servers to monitor');
}

var oNewConfiguration = new Background.Configuration.Watchers();
oNewConfiguration.loadConfigurationFromArray(aServers);

var oWatcher = new Background.Watcher.Engine();
oWatcher.setConfiguration(oNewConfiguration.getConfiguration());
oWatcher.start();

function focusOrCreateTab(url) {
    chrome.windows.getAll({"populate":true}, function(windows) {
        var existing_tab = null;
        for (var i in windows) {
            var tabs = windows[i].tabs;
            for (var j in tabs) {
                var tab = tabs[j];
                if (tab.url == url) {
                    existing_tab = tab;
                    break;
                }
            }
        }
        if (existing_tab) {
            chrome.tabs.update(existing_tab.id, {"selected":true});
        } else {
            chrome.tabs.create({"url":url, "selected":true});
        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    var manager_url = chrome.extension.getURL("/Html/index.html");
    focusOrCreateTab(manager_url);
});
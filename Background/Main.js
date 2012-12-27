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

function sleep(milliSeconds){
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}
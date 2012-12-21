/**
 * Main entry point for the drone background engine
 */


// First of all, ensuring that the servers are loaded
if ('undefined' === typeof(aServers)) {
    alert('unable to find servers to monitor');
}

oNewConfiguration = new Background.Configuration.Watchers();
oNewConfiguration.loadConfigurationFromArray(aServers);

function sleep(milliSeconds){
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}
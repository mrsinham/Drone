Background.Watcher.Engine = function()
{
    this.bRunning = false;
    this.REQUEST_OK = 1;
    this.REQUEST_FAILED = 2;
    this.REQUEST_NOTDONE = 3;
    this.REQUEST_INPROGRESS = 4;
    this.aCurrentRequests = {};
    this.iLoopInterval = 400;
    this.aConfiguration = [];
};

/**
 * Start url watching
 */
Background.Watcher.Engine.prototype.start = function()
{
    this.bRunning = true;

    var oThat = this;
    var fLoop = function()
    {
        oThat.watchAllUrl();
        if (oThat.bRunning === true) {
            setTimeout(function(){
                fLoop();
            }, oThat.iLoopInterval);
        }

    };
    fLoop();
};

/**
 * End url watching
 */
Background.Watcher.Engine.prototype.end = function()
{
    this.bRunning = false;
};

/**
 * Process the response of a server call
 * @param oRequest
 * @param aMyServerToWatch
 * @param oStartDate
 * @private
 */
Background.Watcher.Engine.prototype._processResponse = function(oRequest, aMyServerToWatch, oStartDate) {

    var oWatch = new Entity.Watch();
    oWatch.setUrl(aMyServerToWatch.url);
    oWatch.setHostname(aMyServerToWatch.hostname);
    oWatch.setRequestTime(oStartDate);


    switch(oRequest.readyState) {
        case 1:
            oWatch.setState(this.REQUEST_INPROGRESS);
            oWatch.setResponseText('Request in progress...');
            break;
        case 4:
            oWatch.setState(this.REQUEST_OK);
            // Ok, we need to process received request
            try {
                var oContentResponse = JSON.parse(oRequest.responseText);


            } catch (eException) {
                oWatch.setState(this.REQUEST_FAILED);
                oWatch.setResponseText('Unable to parse request to ' + aMyServerToWatch.url + ' not json response');
            }
            break;
    }

    this.aCurrentRequests[aMyServerToWatch.url] = oWatch;

    /**
     * Warning subscriber that the url has been updated
     */
    chrome.extension.sendMessage({
        urlUpdated:sWatchedUrl
    }, function(){})

};

Background.Watcher.prototype._buildResponse = function(oResponse, aMyServerToWatch) {
    oWatch.setUrl(aMyServerToWatch.url);
    oWatch.setHostname(aMyServerToWatch.hostname);
    if (typeof(oResponse.code) === 'undefined') {
        oResponse.code = 999;
        return oWatch;
    }
    oWatch.setHttpCode(oResponse.code);


};

Background.Watcher.prototype._parseMainSection = function(oResponse) {

};

Background.Watcher.prototype._parseServicesSection = function(oResponse) {

};

Background.Watcher.Engine.prototype.watchAllUrl = function() {
    for (var i = 0; i < this.aConfiguration.length; i++) {
        /**
         * Only if it must be watched
         */
        this.watchAnUrl(this.aConfiguration[i]);
    }
};

/**
 * Send a request to probe a server
 * @param aMyServerToWatch
 */
Background.Watcher.Engine.prototype.watchAnUrl = function(aMyServerToWatch) {
    /**
     * Build an XMLHttpRequest object
     */
    var oRequest = new XMLHttpRequest();
    var sUrl = aMyServerToWatch.url;
    var sHost = aMyServerToWatch.hostname;
    oRequest.open("GET", sUrl, true);
    oRequest.setRequestHeader('Host', sHost);
    var oStartDate = new Date();
    oRequest.onreadystatechange = function() {
        this._processResponse(oRequest, aMyServerToWatch, oStartDate);
    };
    oRequest.send();
};

Background.Watcher.Engine.prototype.setConfiguration = function(aConfiguration) {
    this.aConfiguration = aConfiguration;
};
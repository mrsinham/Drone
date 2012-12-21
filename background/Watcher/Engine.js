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

Background.Watcher.Engine.prototype._processResponse = function(oRequest, sWatchedUrl) {

    var oResponse = {
        requestState: this.REQUEST_NOTDONE,
        requestComment: null,
        servicesStates:[]
    };
    switch(oRequest.readyState) {
        case 1:
            oResponse.requestState = this.REQUEST_INPROGRESS;
            oRequest.requestComment = 'Request in progress...';
            break;
        case 4:
            // Ok, we need to process received request
            try {
                var oContentResponse = JSON.parse(oRequest.responseText);
            } catch (eException) {
                oResponse.requestState = this.REQUEST_FAILED;
                oResponse.requestComment = 'Unable to parse request to ' + sWatchedUrl + ' not json response';
            }
            break;
    }

    this.aCurrentRequests[sWatchedUrl] = oResponse;

    /**
     * Warning subscriber that the url has been updated
     */
    chrome.extension.sendMessage({
        urlUpdated:sWatchedUrl
    }, function(){})

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
    oRequest.onreadystatechange = function() {
        this._processResponse(oRequest, sUrl);
    };

};

Background.Watcher.Engine.prototype.setConfiguration = function(aConfiguration) {
    this.aConfiguration = aConfiguration;
};
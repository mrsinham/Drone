Background.Watcher.Engine = function()
{
    this.bRunning = false;
    this.REQUEST_OK = 1;
    this.REQUEST_FAILED = 2;
    this.REQUEST_NOTDONE = 3;
    this.REQUEST_INPROGRESS = 4;
    this.iLoopInterval = 2000;
    this.aConfiguration = [];
    this.oWatchList = null;
};

/************************************
 *      Process control section     *
 ************************************/

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
    var _oThat = this;
    oRequest.onreadystatechange = function() {
        _oThat._processResponse(oRequest, aMyServerToWatch, oStartDate);
    };
    oRequest.send();
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
            oWatch.setEndRequestTime(new Date());
            // Ok, we need to process received content
            try {
                var oContentResponse = JSON.parse(oRequest.responseText);
                this._buildResponse(oContentResponse, oWatch);
            } catch (eException) {
                oWatch.setState(this.REQUEST_FAILED);
                oWatch.setResponseText('Unable to parse request to ' + aMyServerToWatch.url + ' not json response');
            }
            break;
    }

    /**
     * Storing computed watch
     */
    this.getWatchList().setWatch(oWatch);

    /**
     * Warning subscribers that the url has been updated
     */
    /*chrome.extension.sendMessage({
        urlUpdated:oWatch
    }, function(){})*/

};


/**********************************************
 *         Parsing response section           *
 **********************************************/

Background.Watcher.Engine.prototype._buildResponse = function(oResponse, oWatch) {
    oWatch.setUrl(aMyServerToWatch.url);
    oWatch.setHostname(aMyServerToWatch.hostname);
    this._parseMainSection(oResponse, oWatch);
    this._parseServicesSection(oResponse, oWatch);

};

Background.Watcher.Engine.prototype._parseMainSection = function(oResponse, oWatch) {
    if (typeof(oResponse.code) === 'undefined') {
        oResponse.code = 999;
        return false;
    }
    oWatch.setHttpCode(oResponse.code);
    oWatch.setResponseText(oResponse.response);
    return true;
};

Background.Watcher.Engine.prototype._parseApplicationsSection = function(oResponse, oWatch) {
    if (typeof(oResponse.applications) !== 'undefined' && typeof(oResponse.applications.length) !== 'undefined') {
        for (var i = 0; i < oResponse.applications.length; i++) {
            var oJSONApplication = oResponse.applications[i];
            if (typeof (oJSONApplication.name) === 'undefined') {
                this.getLogger().warning('Unable to add application without name field - watch ('+oWatch.getUrl()+ ')');
                return false;
            }
            if (typeof (oJSONApplication.httpCode) === 'undefined') {
                this.getLogger().warning('Unable to add application without httpCode field - watch ('+oWatch.getUrl()+ ')');
                return false;
            }
            if (typeof (oJSONApplication.response) === 'undefined') {
                this.getLogger().warning('Unable to add application without response field - watch ('+oWatch.getUrl()+ ')');
                return false;
            }
            oWatch.setApplication(oJSONApplication.name, oJSONApplication.httpCode, oJSONApplication.response);
        }
    }
};

Background.Watcher.Engine.prototype._parseEnvironmentSection = function(oResponse, oWatch) {
    if (typeof(oResponse.environment) !== 'undefined') {
        for (sKey in oResponse.environment) {
            oWatch.setEnvironment(sKey, oResponse.environment[sKey]);
        }
    }
};



Background.Watcher.Engine.prototype.setConfiguration = function(aConfiguration) {
    this.aConfiguration = aConfiguration;
};

/**
 * @return Entity.WatchList
 */
Background.Watcher.Engine.prototype.getWatchList = function() {
    if (null === this.oWatchList) {
        this.oWatchList = new Entity.WatchList();
    }
    return this.oWatchList;
};

/**
 * @return Background.Log
 */
Background.Watcher.Engine.prototype.getLogger = function()
{
    if (null === this.oLogger) {
        this.oLogger = new Background.Log();
    }
    return this.oLogger;
}
Background.Watcher.Engine = function()
{
    this.bRunning = false;
    this.REQUEST_OK = 1;
    this.REQUEST_FAILED = 2;
    this.REQUEST_NOTDONE = 3;
    this.REQUEST_INPROGRESS = 4;
    this.iLoopInterval = 2000;
    this.iRequestTimeout = 2000;
    this.aConfiguration = [];
    this.oWatchList = null;
    this.oLogger = null;
    this.bSendNotifications = true;
    this.bInited = false;

    this.sCurrentHost = 'toto.com';

    this.oRequestUrl = null;
    this.oStorageEngine = null;
    this.oMainParametersEngine = null;
    this.oProbeStorage = null;
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
        oThat.loadAndRun();
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
    this._updateMainParameters();
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
    this.sCurrentHost = aMyServerToWatch.hostname;
    this.oRequestUrl = this.parseUrl(aMyServerToWatch.url);

    if (false === this.bInited) {
        this.modifyRequest();
        this.bInited = true;
    }

    //oRequest.setRequestHeader('Host', sHost);
    var oStartDate = new Date();
    var _oThat = this;
    oRequest.onreadystatechange = function() {
        _oThat._processResponse(oRequest, aMyServerToWatch, oStartDate);
    };
    /**
     * The request must be canceled if call excess ...
     */
    oRequest.timeOut = setTimeout(function(){
        oRequest.abort();
    }, this.iRequestTimeout);
    oRequest.send();
};

/**
 * Split and parse url
 * @param sUrl
 * @return {HTMLElement}
 */
Background.Watcher.Engine.prototype.parseUrl = function(sUrl) {
        var l = document.createElement("a");
        l.href = sUrl;
        return l;

};

/**
 * Modifying outgoing request because chrome doesnt allow
 * setRequestHeader('Host', 'toto.com') in XHR Requests
 * @return void
 */
Background.Watcher.Engine.prototype.modifyRequest = function() {
    var oThat = this;
    var rule1 = {
        priority: 100,
        conditions: [
            new chrome.declarativeWebRequest.RequestMatcher({
                url: {
                    hostSuffix: oThat.oRequestUrl.hostname,
                    pathEquals: oThat.oRequestUrl.pathname,
                    schemes :['http', 'https']
                } })
        ],
        actions:[
            new chrome.declarativeWebRequest.SetRequestHeader({
                name :'Host',
                value: this.getHost()
            })
            //new chrome.declarativeWebRequest.CancelRequest()
        ]
    };

    chrome.declarativeWebRequest.onRequest.addRules([rule1]);
};

Background.Watcher.Engine.prototype.getHost = function()
{
    return this.sCurrentHost;
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
    oWatch.setName(aMyServerToWatch.name);

    switch(oRequest.readyState) {
        case 1:
            oWatch.setState(this.REQUEST_INPROGRESS);
            oWatch.setResponseText('Request in progress...');
            break;
        case 4:

            clearTimeout(oRequest.timeOut);

            oWatch.setState(this.REQUEST_OK);
            oWatch.setEndRequestTime(new Date());

            if (0 === oRequest.status) {
                // Request failed, not found at all
                oWatch.setHttpCode(0);
                oWatch.setResponseText('Url not found');
            } else {
                // Ok, we need to process received content

                try {
                    var oContentResponse = JSON.parse(oRequest.responseText);
                    this._buildResponse(oContentResponse, oWatch);
                } catch (eException) {
                    oWatch.setHttpCode(oRequest.status);
                    oWatch.setState(this.REQUEST_FAILED);
                    oWatch.setResponseText('Unable to parse request to ' + aMyServerToWatch.url + ' not json response');
                }

            }


            /**
             * Was good before ?
             */
            if (true === this.bSendNotifications) {
                this.getStorageEngine().getWatch(oWatch.getName(), function(oFetchedWatch){
                    if (false === oFetchedWatch) {
                        return false;
                    }
                    if (true === oFetchedWatch.isOk() && false === oWatch.isOk()) {
                        // Ok, something went bad, warn user
                        var notification = webkitNotifications.createNotification(
                            '/Html/Bootstrap/img/removesign.png',  // icon url - can be relative
                            'Drone alert',  // notification title
                            oWatch.getName()+' is going bad : '+oWatch.getResponseText()  // notification body text
                        );
                        notification.show();
                    } else if (false === oFetchedWatch.isOk() && true === oWatch.isOk()){
                        // Ok, something went bad, warn user
                        var notification = webkitNotifications.createNotification(
                            '/Html/Bootstrap/img/check.png',  // icon url - can be relative
                            'Drone alert',  // notification title
                            oWatch.getName()+' is ok now : '+oWatch.getResponseText()  // notification body text
                        );
                        notification.show();
                    }
                });
            }

            this.getStorageEngine().saveWatch(oWatch, function(eEvent) {});
            break;

    }


    /**
     * Storing computed watch
     */
    this.getWatchList().setWatch(oWatch);

};


/**********************************************
 *         Parsing response section           *
 **********************************************/

Background.Watcher.Engine.prototype._buildResponse = function(oResponse, oWatch) {
    this._parseMainSection(oResponse, oWatch);
    this._parseApplicationsSection(oResponse, oWatch);
    this._parseEnvironmentSection(oResponse, oWatch);

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
            if (typeof (oJSONApplication.code) === 'undefined') {
                this.getLogger().warning('Unable to add application without httpCode field - watch ('+oWatch.getUrl()+ ')');
                return false;
            }
            if (typeof (oJSONApplication.response) === 'undefined') {
                this.getLogger().warning('Unable to add application without response field - watch ('+oWatch.getUrl()+ ')');
                return false;
            }
            oWatch.setApplication(oJSONApplication.name, oJSONApplication.code, oJSONApplication.response);
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
Background.Watcher.Engine.prototype.getLogger = function() {
    if (null === this.oLogger) {
        this.oLogger = new Background.Log();
    }
    return this.oLogger;
};

/**
 * @return Storage.WatchList
 */
Background.Watcher.Engine.prototype.getStorageEngine = function() {
    if (null === this.oStorageEngine) {
        this.oStorageEngine = Storage.WatchList.getInstance();
    }
    return this.oStorageEngine;
};

Background.Watcher.Engine.prototype.loadAndRun = function() {
    var oProbeStorage = this._getProbeStorage();
    var oThat = this;

    var aProbeList = [];
    var aProbeNameList = [];

    oProbeStorage.getAllProbe(function(oProbe){
        if (oProbe !== false) {
            // Filling data
            aProbeList.push({
                name: oProbe.getName(),
                hostname: oProbe.getHostname(),
                url:oProbe.getUrl()
            });
            aProbeNameList.push(oProbe.getName());
        } else {
            // processing it
            oThat.getStorageEngine().cleanWatchIfNotInList(aProbeNameList, function(eEvent){
                // Cleaned, use the new configuration
                oThat.aConfiguration = aProbeList;
                oThat.watchAllUrl();
            });
        }
    })
};

Background.Watcher.Engine.prototype._getProbeStorage = function() {
    if (null === this.oProbeStorage) {
        this.oProbeStorage = new Storage.Probes();
    }
    return this.oProbeStorage;
};

Background.Watcher.Engine.prototype._updateMainParameters = function() {
    var sNotification = this._getMainParametersEngine().getNotifications();
    var sRequestEvery = this._getMainParametersEngine().getBackgroundCheckMillisec();
    this.iLoopInterval = parseInt(sRequestEvery, 10);
    this.iRequestTimeout = parseInt(this._getMainParametersEngine().getBackgroundRequestTimeout(), 10);
    switch (sNotification) {
        case 'true':
            this.bSendNotifications = true;
            break;
        case 'false':
            this.bSendNotifications = false;
            break
    }
}

/**
 * @return Background.Configuration.Main
 */
Background.Watcher.Engine.prototype._getMainParametersEngine = function() {
    if (null === this.oMainParametersEngine) {
        this.oMainParametersEngine = new Background.Configuration.Main();
    }
    return this.oMainParametersEngine;
}
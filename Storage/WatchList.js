Storage.WatchList = function()
{
    this.oStorageEngine = null;
    this.bOpened = false;
};

Storage.WatchList.prototype.saveWatch = function(oWatch, fCallback) {
    var oThat = this;

        this.open(function(){
            var oData = {
                name: oWatch.getName(),
                applications: oWatch.getAllApplications(),
                httpCode: oWatch.getHttpCode(),
                responseText: oWatch.getResponseText(),
                state: oWatch.getState(),
                hostname: oWatch.getHostname(),
                environment: oWatch.getAllEnvironments()
            };
            oThat._getStorageEngine().saveData(oData, function() {
                fCallback();
            });
        });


};

Storage.WatchList.prototype.getAllWatch = function(fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().getData(function(oRow){
            var oWatch = oThat._transformIndexedDbRowToWatchList(oRow);
            fCallback(oWatch);
        });
    });

};

Storage.WatchList.prototype.getWatch = function(sName, fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().getData(function(oRow){
            var oWatch = oThat._transformIndexedDbRowToWatchList(oRow);
            fCallback(oWatch);
        }, sName);
    });
};

Storage.WatchList.prototype._transformIndexedDbRowToWatchList = function(oRow) {
    var oWatch = new Entity.Watch();
    oWatch.setName(oRow.name);
    oWatch.setAllApplications(oRow.applications);
    oWatch.setEnvironment(oRow.environment);
    oWatch.setHttpCode(oRow.httpCode);
    oWatch.setResponseText(oRow.responseText);
    oWatch.setState(oRow.state);
    oWatch.setHostname(oRow.hostname);
    oWatch.setAllEnvironments(oRow.environment);
    return oWatch;
};

Storage.WatchList.prototype.open = function(fCallback) {
    var oThat = this;
    this._getStorageEngine().open(function() {
        fCallback();
        oThat.bOpened = true;
    });
};

Storage.WatchList.prototype._getStorageEngine = function()
{
    if (null === this.oStorageEngine) {
        this.oStorageEngine = new Storage.Engine('DroneDb', 'Watchlist', 'name', '456');
    }
    return this.oStorageEngine;
}

/***
 * Singleton
 */
Storage.WatchList.instance = null;
Storage.WatchList.getInstance = function() {
    if (this.instance == null) {
        this.instance = new Storage.WatchList();
    }
    return this.instance;
}
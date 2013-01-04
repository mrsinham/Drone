Storage.WatchList = function()
{
    this.oStorageEngine = null;
    this.sObjectStore = 'WatchList';
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
            oThat._getStorageEngine().saveData(oThat.sObjectStore, oData, function() {
                fCallback();
            });
        });


};

Storage.WatchList.prototype.getAllWatch = function(fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().getData(oThat.sObjectStore, function(oRow){
            if (false === oRow) {
                fCallback(false);
                return;
            }
            var oWatch = oThat._transformIndexedDbRowToWatchList(oRow);
            fCallback(oWatch);
        });
    });
};

Storage.WatchList.prototype.count = function(fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().count(oThat.sObjectStore, function(iCount){
            fCallback(iCount);
        });
    });

};

Storage.WatchList.prototype.delete = function(sName, fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().delete(oThat.sObjectStore, sName, function(eEvent){
            fCallback(eEvent);
        });
    });

};

Storage.WatchList.prototype.cleanWatchIfNotInList = function(aList, fCallback) {

    var oThat = this;
    this.open(function(){

        oThat.getAllWatch(function(oWatch){
            if (false === oWatch) {
                fCallback();
                return;
            }
            if (-1 === $.inArray(oWatch.getName(), aList)) {
                // Watch no present in probe list, removing it
                oThat.delete(oWatch.getName(), function(){

                });
            }
        });
    });

};

Storage.WatchList.prototype.getWatch = function(sName, fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().getData(oThat.sObjectStore, function(oRow){
            if (false === oRow) {
                fCallback(false);
                return;
            }
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
        this.oStorageEngine = new Storage.Engine();
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
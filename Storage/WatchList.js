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
                applications: oWatch.getApplication(),
                environment : oWatch.getEnvironment(),
                httpCode: oWatch.getHttpCode(),
                responseText: oWatch.getResponseText(),
                state: oWatch.getState()
            };

            oThat._getStorageEngine().saveData(oData, function() {
                fCallback();
            });
        });


};

Storage.WatchList.prototype.getAllWatch = function(fCallback) {
    this._getStorageEngine().getData(function(oRow){
        var oWatch = new Entity.Watch();
        oWatch.setName(oRow.name);
        oWatch.setApplication(oRow.applications);
        oWatch.setEnvironment(oRow.environment);
        oWatch.setHttpCode(oRow.httpCode);
        oWatch.setResponseText(oRow.responseText);
        oWatch.setState(oRow.state);
        fCallback(oWatch);
    });
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
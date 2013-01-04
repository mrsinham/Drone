Storage.Probes = function()
{
    this.oStorageEngine = null;
    this.sObjectStore = 'Probe';
    this.bOpened = false;
};

Storage.Probes.prototype.saveProbe = function(oProbe, fCallback) {
    var oThat = this;

    this.open(function(){
        var oData = {
            name: oProbe.getName(),
            url: oProbe.getUrl(),
            hostname: oProbe.getHostname(),
            cookies: oProbe.getCookies()
        };
        oThat._getStorageEngine().saveData(oThat.sObjectStore, oData, function() {
            fCallback();
        });
    });


};

Storage.Probes.prototype.getAllProbe = function(fCallback) {
    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().getData(oThat.sObjectStore, function(oRow){
            if (false === oRow) {
                fCallback(false);
                return;
            }
            var oWatch = oThat._transformIndexedDbRowToProbe(oRow);
            fCallback(oWatch);
        });
    });
};

Storage.Probes.prototype.count = function(fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().count(oThat.sObjectStore, function(iCount){
            fCallback(iCount);
        });
    });

};

Storage.Probes.prototype.delete = function(sName, fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().delete(oThat.sObjectStore, sName, function(eEvent){
            fCallback(eEvent);
        });
    });

};

Storage.Probes.prototype.getProbe = function(sName, fCallback) {

    var oThat = this;
    this.open(function(){
        oThat._getStorageEngine().getData(oThat.sObjectStore, function(oRow){
            if (false === oRow) {
                fCallback(false);
                return;
            }
            var oProbe = oThat._transformIndexedDbRowToProbe(oRow);
            fCallback(oProbe);
        }, sName);
    });
};

Storage.Probes.prototype._transformIndexedDbRowToProbe = function(oRow) {
    var oProbe = new Entity.Probe();
    oProbe.setName(oRow.name);
    oProbe.setUrl(oRow.url);
    oProbe.setHostname(oRow.hostname);
    return oProbe;
};

Storage.Probes.prototype.open = function(fCallback) {
    var oThat = this;
    this._getStorageEngine().open(function() {
        fCallback();
        oThat.bOpened = true;
    });

};

Storage.Probes.prototype._getStorageEngine = function()
{
    if (null === this.oStorageEngine) {
        this.oStorageEngine = new Storage.Engine();
    }
    return this.oStorageEngine;
}

/***
 * Singleton
 */
Storage.Probes.instance = null;
Storage.Probes.getInstance = function() {
    if (this.instance == null) {
        this.instance = new Storage.Probes();
    }
    return this.instance;
}
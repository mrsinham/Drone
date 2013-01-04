/**
 * Probes configuration page controller
 */
Controller.Configuration.Probes = function() {
    this.oView = null;
    this.oProbeStorage = null;
    var oThat = this;
    this.aNeededProbeField = ['name', 'url', 'hostname'];
    this._getView().setProbeSaver(function(oProbe){
        oThat._saveProbe(oProbe);
    });
    this._getView().setProbeDeleter(function(oProbe){
        oThat._deleteProbe(oProbe);
    });

    this._getView().watchAddProbeForm();
    this._getView().watchDeleteProbe();
};

Controller.Configuration.Probes.prototype._saveProbe = function(oProbe) {
    // We need to verify if all fields are present
    var oThat = this;
    var oProbeCreated = new Entity.Probe();
    oProbeCreated.setUrl(oProbe.url);
    oProbeCreated.setName(oProbe.name);
    oProbeCreated.setHostname(oProbe.hostname);
    this._getProbeStorage().saveProbe(oProbeCreated, function(e){
        oThat.updateProbeList();
    });
};

Controller.Configuration.Probes.prototype.updateProbeList = function() {
    var oThat = this;
    this._getView().removeAllProbe();
    this._getProbeStorage().getAllProbe(function(oEachProbe){
        if (false === oEachProbe) {
            return;
        }
        oThat._getView().addProbe(oEachProbe);
    });
};

Controller.Configuration.Probes.prototype._deleteProbe = function(sProbeName) {
    var oThat = this;
    this._getProbeStorage().delete(sProbeName, function(e){
        oThat._getView().removeProbe(sProbeName);
        //oThat.updateProbeList();
    });
};

/**
 * @return View.Configuration.Probes
 */
Controller.Configuration.Probes.prototype._getView = function() {
    if (null === this.oView) {
        this.oView = new View.Configuration.Probes();
    }
    return this.oView;
};

/**
 * @return Storage.Probes
 */
Controller.Configuration.Probes.prototype._getProbeStorage = function() {
    if (null === this.oProbeStorage) {
        this.oProbeStorage = new Storage.Probes();
    }
    return this.oProbeStorage;
};

$(document).ready(function () {
    var oController = new Controller.Configuration.Probes();
    oController.updateProbeList();
});
/**
 * Probes configuration page controller
 */
Controller.Configuration.Probes = function() {
    this.oView = null;
    this._getView().setProbeSaver(function(oProbe){
       console.log(oProbe, 'probeSaver');
    });
    this._getView().watchAddProbeForm();
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

$(document).ready(function () {
    new Controller.Configuration.Probes();
});
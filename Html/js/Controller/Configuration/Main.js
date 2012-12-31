Controller.Configuration.Main = function() {
    this.oView = null;
    this.oMainConfiguration = null;
    var oThat = this;
    var bNotifyOrNot = this._getMainConfiguration().getNotifications();
    if ('true'=== bNotifyOrNot) {
        this._getView().setNotificationOn();
    } else {
        this._getView().setNotificationOff();
    }
    this._getView().setNotificationCallback(function(sOnOrOff){
        oThat._watchNotification(sOnOrOff);
    }).watch();
}

Controller.Configuration.Main.prototype._watchNotification = function(sOnOrOff) {
    switch (sOnOrOff) {
        case 'on':
            this._getMainConfiguration().setNotifications('true');
            break;
        case 'off':
            this._getMainConfiguration().setNotifications('false');
            break;
    }
};

Controller.Configuration.Main.prototype._getView = function() {
    if (null === this.oView) {
        this.oView = new View.Configuration.Main();
    }
    return this.oView;
};

Controller.Configuration.Main.prototype._getMainConfiguration = function() {
    if (null === this.oMainConfiguration) {
        this.oMainConfiguration = new Background.Configuration.Main();
    }
    return this.oMainConfiguration;
};

$(document).ready(function() {
    // Handler for .ready() called.
    var oController = new Controller.Configuration.Main();
});


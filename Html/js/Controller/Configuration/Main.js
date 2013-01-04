Controller.Configuration.Main = function() {
    this.oView = null;
    this.oMainConfiguration = null;
    var oThat = this;

    this.manageNotifications();
    this.manageTimers();

    this._getView().watch();
}

Controller.Configuration.Main.prototype.manageNotifications = function() {
    var oThat = this;
    var bNotifyOrNot = this._getMainConfiguration().getNotifications();
    if ('true'=== bNotifyOrNot) {
        this._getView().setNotificationOn();
    } else {
        this._getView().setNotificationOff();
    }
    this._getView().setNotificationCallback(function(sOnOrOff){
        oThat._watchNotification(sOnOrOff);
    });
};

Controller.Configuration.Main.prototype.manageTimers = function() {
    var oThat = this;

    var sRequestTimeout = this._getMainConfiguration().getBackgroundRequestTimeout();
    var sCheckEvery = this._getMainConfiguration().getBackgroundCheckMillisec();
    var sRefreshEvery = this._getMainConfiguration().getFrontRefreshMillisec();

    this._getView().setTimer('requestTimeout', Math.round(sRequestTimeout/1000));
    this._getView().setTimer('checkEvery', Math.round(sCheckEvery/1000));
    this._getView().setTimer('refreshEvery', Math.round(sRefreshEvery/1000));

    this._getView().setTimerCallback(function(sTimerName, sValue){
        oThat._onSetNewTimer(sTimerName, sValue);
    });
};

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

Controller.Configuration.Main.prototype._onSetNewTimer = function(sTimer, sValue) {
    var sValue = (sValue * 1000);
    switch (sTimer) {
        case 'requestTimeout':
            this._getMainConfiguration().setBackgroundRequestTimeout(sValue);
            break;
        case 'checkEvery':
            this._getMainConfiguration().setBackgroundCheckMillisec(sValue);
            break;
        case 'refreshEvery':
            this._getMainConfiguration().setFrontRefreshMillisec(sValue);
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


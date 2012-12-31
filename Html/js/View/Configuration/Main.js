View.Configuration.Main = function() {
    this.sNotificationButtonSelector = '#sNotification';
    this.fNotificationCallback = null;
};

View.Configuration.Main.prototype.watch = function() {
    this._watchNotificationButton();
}

View.Configuration.Main.prototype._watchNotificationButton = function() {
    var oThat = this;
    $(this.sNotificationButtonSelector).live('click',function(eEvent) {
        var oTarget = $(eEvent.currentTarget);
        if (oTarget.hasClass('btn-info')) {
            oThat.fNotificationCallback('off');
            oThat.setNotificationOff();
        } else {
            oThat.fNotificationCallback('on');
            oThat.setNotificationOn();
        }
    });
};

View.Configuration.Main.prototype.setNotificationOn = function() {
    $(this.sNotificationButtonSelector).addClass('btn-info').html('Yes');
};

View.Configuration.Main.prototype.setNotificationOff = function() {
    $(this.sNotificationButtonSelector).removeClass('btn-info').html('No');
};

View.Configuration.Main.prototype.setNotificationCallback = function(fCallback) {
    this.fNotificationCallback = fCallback;
    return this;
};



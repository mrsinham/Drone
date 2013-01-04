View.Configuration.Main = function() {
    this.sMainOptionSelector = '#mainOptions';
    this.sNotificationButtonSelector = '#sNotification';
    this.sTimersSelector = '.timerSave';
    this.fNotificationCallback = null;
    this.fTimerCallback = null;
};

View.Configuration.Main.prototype.watch = function() {
    this._watchNotificationButton();
    this._watchTimers();
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

/**
 * Timers
 */

View.Configuration.Main.prototype._watchTimers = function() {
    var oThat = this;
    $(this.sMainOptionSelector).find(this.sTimersSelector).live('click', function(eEvent){
        var oCurrentTarget = $(eEvent.currentTarget);
        var oContainer = oCurrentTarget.closest('div');
        var sTimerName = oContainer.data('timer');
        var sTimerValue = oContainer.find('input').val();

        if (true === isNaN(sTimerValue)) {
            oThat.messageOnTimer(sTimerName, 'error', 'Please submit a number');
            return;
        }
        oThat.fTimerCallback(sTimerName, sTimerValue);

        oThat.messageOnTimer(sTimerName, 'success', 'Saved');
    });
};

View.Configuration.Main.prototype.setTimer = function(sTimerName, sValue) {
    var oTimerDiv = $(this.sMainOptionSelector).find('div[data-timer="'+sTimerName+'"]');
    oTimerDiv.find('input').val(sValue);
};

View.Configuration.Main.prototype.messageOnTimer = function(sTimerName, sTypeErrorOrSuccess, sMessage) {
    switch (sTypeErrorOrSuccess) {
        case 'success':
            var sClass = 'success';
            break;
        case 'error':
            var sClass = 'error';
            break;
    }
    var oTimerDiv = $(this.sMainOptionSelector).find('div[data-timer="'+sTimerName+'"]');
    var oControlGroup = oTimerDiv.closest('div.control-group');
    oControlGroup.removeClass('error').removeClass('success').addClass(sClass);
    // Not a timer valid, need to warn user and display error
    oControlGroup.find('.help-inline').removeClass('hide').html(sMessage);
};


View.Configuration.Main.prototype.setTimerCallback = function(fCallback) {
    this.fTimerCallback = fCallback;
    return this;
};


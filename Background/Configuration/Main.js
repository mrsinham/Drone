/**
 * A simple class for storing main configuration of the application
 * @constructor
 */
Background.Configuration.Main = function() {
    this.bDefaultNotificationStatus =  true;
};

Background.Configuration.Main.prototype.setNotifications = function(bNotification) {
    localStorage.bNotifications = bNotification;
};


Background.Configuration.Main.prototype.getNotifications = function() {
    if (typeof(localStorage.bNotifications) === 'undefined') {
        return this.bDefaultNotificationStatus;
    }
    return localStorage.bNotifications;
};
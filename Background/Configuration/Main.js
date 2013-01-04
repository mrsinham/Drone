/**
 * A simple class for storing main configuration of the application
 * @constructor
 */
Background.Configuration.Main = function() {
    this.bDefaultNotificationStatus =  true;
    this.iDefaultBackgroundMillisecCheck = 2000;
    this.iDefaultFrontendRefreshMillisec = 2000;
    this.iDefaultBackgroundRequestTimeout = 2000;
};

/***************************************
 * Front notifications
 ***************************************/

Background.Configuration.Main.prototype.setNotifications = function(bNotification) {
    localStorage.bNotifications = bNotification;
};


Background.Configuration.Main.prototype.getNotifications = function() {
    if (typeof(localStorage.bNotifications) === 'undefined') {
        return this.bDefaultNotificationStatus;
    }
    return localStorage.bNotifications;
};

/***************************************
 * Background check url every
 ***************************************/

Background.Configuration.Main.prototype.setBackgroundCheckMillisec = function(iMillisec) {
    localStorage.iBackgroundCheckMillisec = iMillisec;
};


Background.Configuration.Main.prototype.getBackgroundCheckMillisec = function() {
    if (typeof(localStorage.iBackgroundCheckMillisec) === 'undefined') {
        return this.iDefaultBackgroundMillisecCheck;
    }
    return localStorage.iBackgroundCheckMillisec;
};

/***************************************
 * Background request timeout
 ***************************************/

Background.Configuration.Main.prototype.setBackgroundRequestTimeout = function(iMillisec) {
    localStorage.iBackgroundRequestTimeout = iMillisec;
};


Background.Configuration.Main.prototype.getBackgroundRequestTimeout = function() {
    if (typeof(localStorage.iBackgroundRequestTimeout) === 'undefined') {
        return this.iDefaultBackgroundRequestTimeout;
    }
    return localStorage.iBackgroundRequestTimeout;
};

/***************************************
 * Background refresh display every
 ***************************************/

Background.Configuration.Main.prototype.setFrontRefreshMillisec = function(iMillisec) {
    localStorage.iFrontRefreshMillisec = iMillisec;
};


Background.Configuration.Main.prototype.getFrontRefreshMillisec = function() {
    if (typeof(localStorage.iFrontRefreshMillisec) === 'undefined') {
        return this.iDefaultFrontendRefreshMillisec;
    }
    return localStorage.iFrontRefreshMillisec;
};
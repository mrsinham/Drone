Background.Configuration.Watchers = function()
{
    this.oLogger = new Background.Log();
    this.aLoadedConfiguration = [];
};

/**
 * Load the configuration into the system
 * @param aWatchersConfigurations
 * @return {Boolean}
 */
Background.Configuration.Watchers.prototype.loadConfigurationFromArray = function (aWatchersConfigurations)
{
    if ('undefined' === typeof(aWatchersConfigurations)) {
        this.oLogger.warning('Unable to load configuration, not an array');
        return false;
    }

    for (var i = 0; i < aWatchersConfigurations.length; i++) {
        if (true === this._checkConfiguration(aWatchersConfigurations[i])) {
            this.aLoadedConfiguration.push(aWatchersConfigurations[i]);
        }
    }
    return true;
};

Background.Configuration.Watchers.prototype.getConfiguration = function()
{
    return this.aLoadedConfiguration;
}

/***
 * Check the validity of each configuration
 * @param aOneConfiguration
 * @return {Boolean}
 * @private
 */
Background.Configuration.Watchers.prototype._checkConfiguration = function(aOneConfiguration) {
    if (typeof(aOneConfiguration.name) === 'undefined') {
        this.oLogger.warning('Unable to load a server without name');
        return false;
    }
    if (typeof(aOneConfiguration.hostname) === 'undefined') {
        this.oLogger.warning('Unable to load a server without hostname');
        return false;
    }
    if (typeof(aOneConfiguration.url) === 'undefined') {
        this.oLogger.warning('Unable to load a server without url');
        return false;
    }
    return true;
};
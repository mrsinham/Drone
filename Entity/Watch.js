/**
 * Entity object representing a watch
 * @constructor
 */
Entity.Watch = function()
{
    this.url = null;
    this.hostname = null;
    this.httpCode = null;
    this.applications = [];
    this.environment = [];
    this.when = null;
    this.refreshWhen = null;
    this.requestTime = null;
    this.endRequestTime = null;
    this.state = null;
    this.response = null;
};

Entity.Watch.prototype.setUrl = function(sUrl)
{
    this.url = sUrl;
};

Entity.Watch.prototype.getUrl = function()
{
    return this.url;
};

Entity.Watch.prototype.setHostname = function(sHostname)
{
    this.hostname = sHostname;
}

Entity.Watch.prototype.setHttpCode = function(iCode)
{
    this.httpCode = iCode;
}

Entity.Watch.prototype.setApplication = function(sName, iHttpCode, sResponse)
{
    this.applications[sName] = {
        httpCode: iHttpCode,
        response: sResponse
    };
};

Entity.Watch.prototype.setEnvironment = function(sName, sValue)
{
    this.environment[sName] = sValue;
};

Entity.Watch.prototype.setState = function(sState)
{
    this.state = sState;
};

Entity.Watch.prototype.setResponseText = function (sResponseText) {
    this.response = sResponseText;
};

Entity.Watch.prototype.setRequestTime = function(oRequestTime) {
    this.requestTime = oRequestTime;
}

Entity.Watch.prototype.setEndRequestTime = function(oEndRequestTime) {
    this.endRequestTime = oEndRequestTime;
}
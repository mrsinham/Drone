/**
 * Entity object representing a watch
 * @constructor
 */
Entity.Watch = function()
{
    this.name = null;
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
    this.sNormalCode = 200;
};

Entity.Watch.prototype.setUrl = function(sUrl)
{
    this.url = sUrl;
};

Entity.Watch.prototype.getUrl = function()
{
    return this.url;
};


Entity.Watch.prototype.getHostname = function() {
    return this.hostname;
};

Entity.Watch.prototype.setHostname = function(sHostname)
{
    this.hostname = sHostname;
};

Entity.Watch.prototype.setHttpCode = function(iCode)
{
    this.httpCode = iCode;
};


Entity.Watch.prototype.getHttpCode = function() {
    return this.httpCode;
};

Entity.Watch.prototype.setApplication = function(sName, iHttpCode, sResponse)
{
    this.applications[sName] = {
        httpCode: iHttpCode,
        response: sResponse
    };
};

Entity.Watch.prototype.setAllApplications = function(oApplications)
{
    this.applications = oApplications;
};

Entity.Watch.prototype.getAllApplications = function() {
    return this.applications;
};

Entity.Watch.prototype.setAllApplications = function(oApplications)
{
    this.applications = oApplications;
};

Entity.Watch.prototype.setEnvironment = function(sName, sValue)
{
    this.environment[sName] = sValue;
};

Entity.Watch.prototype.getAllEnvironments = function() {
    return this.environment;
};

Entity.Watch.prototype.setAllEnvironments = function(oEnvironments)
{
    this.environment = oEnvironments;
};

Entity.Watch.prototype.setState = function(sState)
{
    this.state = sState;
};

Entity.Watch.prototype.getState = function() {
    return this.state;
};

Entity.Watch.prototype.setResponseText = function (sResponseText) {
    this.response = sResponseText;
};

Entity.Watch.prototype.getResponseText = function() {
    return this.response;
};

Entity.Watch.prototype.setRequestTime = function(oRequestTime) {
    this.requestTime = oRequestTime;
};

Entity.Watch.prototype.setEndRequestTime = function(oEndRequestTime) {
    this.endRequestTime = oEndRequestTime;
};

Entity.Watch.prototype.getName = function() {
    return this.name;
};

Entity.Watch.prototype.setName = function(sName) {
    this.name = sName;
};

Entity.Watch.prototype.isOk = function() {
    return (this.sNormalCode === this.httpCode);
};
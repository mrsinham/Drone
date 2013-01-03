/**
 * Entity object representing a watch
 * @constructor
 */
Entity.Probe = function()
{
    this.name = null;
    this.url = null;
    this.hostname = null;
    this.cookies = [];
};

Entity.Probe.prototype.setUrl = function(sUrl)
{
    this.url = sUrl;
};

Entity.Probe.prototype.getUrl = function()
{
    return this.url;
};


Entity.Probe.prototype.getHostname = function() {
    return this.hostname;
};

Entity.Probe.prototype.setHostname = function(sHostname)
{
    this.hostname = sHostname;
}


Entity.Probe.prototype.getName = function() {
    return this.name;
};

Entity.Probe.prototype.setName = function(sName) {
    this.name = sName;
};


Entity.Probe.prototype.setCookies = function(oCookies) {
    this.cookies = oCookies;
}


Entity.Probe.prototype.getCookies = function() {
    return this.cookies;
}
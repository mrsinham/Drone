Entity.WatchList = function()
{
    this.aWatches = [];
};

Entity.WatchList.prototype.setWatch = function(oWatch) {
    if (null === oWatch.getUrl()) {
        throw 'Unable to add watch in watchlist without url';
    }
    var sUrl = oWatch.getUrl();
    this.aWatches[sUrl] = oWatch;
};

Entity.WatchList.prototype.getList = function() {
    return this.aWatches;
};
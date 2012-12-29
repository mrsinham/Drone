Controller.Overview = function() {
    this.oWatchListStorage = null;
};

Controller.Overview.prototype.updateWatchList = function()
{
    // Fetching watchlist
    this._getWatchListStorage().getAllWatch(function(oWatch){
        console.log(oWatch);
    });
}


Controller.Overview.prototype._getWatchListStorage = function()
{
    if (null === this.oWatchListStorage) {
        this.oWatchListStorage = Storage.WatchList.getInstance();
    }
    return this.oWatchListStorage;
};


var oController = new Controller.Overview();
oController.updateWatchList();
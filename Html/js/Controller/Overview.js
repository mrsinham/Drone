Controller.Overview = function() {
    this.oWatchListStorage = null;
    this.oOverviewView = null;
};

Controller.Overview.prototype.updateWatchList = function()
{
    // Emptying overview table

    var oThat = this;
    // Fetching watchlist
    var aList = [];
    this._getWatchListStorage().getAllWatch(function(oWatch){
        if (false === oWatch) {
            oThat._getView().removeWatchThatAreNotInList(aList);
            return;
        }
        oThat._getView().addWatch(oWatch);
        aList.push(oWatch.getName());

    });
};

Controller.Overview.prototype.updateCounter = function()
{
    // Emptying overview table

    var oThat = this;
    // Fetching watchlist
    this._getWatchListStorage().count(function(iCount){
        oThat._getView().updateCounter(iCount);
    });
}


Controller.Overview.prototype._getWatchListStorage = function()
{
    if (null === this.oWatchListStorage) {
        this.oWatchListStorage = Storage.WatchList.getInstance();
    }
    return this.oWatchListStorage;
};

Controller.Overview.prototype._getView = function()
{
    if (null === this.oOverviewView) {
        this.oOverviewView = new View.Overview();
    }
    return this.oOverviewView;
};


var oController = new Controller.Overview();

$(document).ready(function() {
    // Handler for .ready() called.



    var fLoop = function()
    {
        oController.updateCounter();
        oController.updateWatchList();

        setTimeout(function(){
            fLoop();
        }, 10000);


    };

    fLoop();

});

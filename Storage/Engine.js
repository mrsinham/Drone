;Storage.Engine = function() {
    this.sDatabaseName = 'Drone';

    this.oBaseDefinition = [{
        objectStore: 'WatchList',
        keyPath: 'name'
    },
    {
        objectStore:'Probe',
        keyPath: 'name'
    }
    ];

    this.sVersion = 2;
    this.oDatabase = null;
    this.bOpened = false;
};

Storage.Engine.prototype.open = function(fCallback) {
        var oThat = this;
        var oRequestToTheBase = indexedDB.open(this.sDatabaseName, this.sVersion);
    console.log('ouii', this.sDatabaseName, this.sVersion);
    oRequestToTheBase.onsuccess = function(eEvent) {
        console.log('tototo');
            oThat.oDatabase = eEvent.target.result;
            fCallback();
        };

        oRequestToTheBase.onupgradeneeded = function(e) {

            console.log('upgradeNeed');
            var oDatabase = event.target.result;
            for (var i = 0; i < oThat.oBaseDefinition.length; i++) {
                console.log(oThat.oBaseDefinition[i].objectStore, {
                    keyPath: oThat.oBaseDefinition[i].keyPath
                });
                var oStore = oDatabase.createObjectStore(oThat.oBaseDefinition[i].objectStore, {
                    keyPath: oThat.oBaseDefinition[i].keyPath
                });
            };
        };

        oRequestToTheBase.onerror = function(e){

            console.log(e);
        };

};

/**
 * Add data to the store
 * @param sObjectStore
 * @param oData
 *              The json object to add
 * @param fCallback
 *              The method to execute after the insertion
 */
Storage.Engine.prototype.saveData = function (sObjectStore, oData, fCallback) {

    var oObjectStore = this._getObjectStore(sObjectStore);
    var oMyRequest = oObjectStore.put(oData);
    oMyRequest.onsuccess = function(eEvent) {
        fCallback(eEvent);
    };
};

Storage.Engine.prototype.delete = function (sObjectStore, sKey, fCallback) {

    var oObjectStore = this._getObjectStore(sObjectStore);
    console.log(sObjectStore, sKey, fCallback)
    var oMyRequest = oObjectStore.delete(sKey);
    oMyRequest.onsuccess = function(eEvent) {
        fCallback(eEvent);
    };
};

Storage.Engine.prototype.count = function (sObjectStore, fCallback) {

    var oObjectStore = this._getObjectStore(sObjectStore);
    var oMyRequest = oObjectStore.count();
    oMyRequest.onsuccess = function(eEvent) {
        fCallback(eEvent.target.result);
    };
};


/**
 * Fetch data from indexedDb
 * @param sObjectStore The wanted objectstore
 * @param fCallbackForEachRow
 *                          The callback called on each row fetched
 * @param iKey
 *          Opt. If provided, the result will be limited at this key, else
 *          all rows will be fetched
 */
Storage.Engine.prototype.getData = function (sObjectStore, fCallbackForEachRow, iKey) {

    var bUseKey = (typeof(iKey) === 'undefined') ? false : true;

    if (true === bUseKey) {
        var oKeyRange = IDBKeyRange.only(iKey);
    } else {
        var oKeyRange = IDBKeyRange.lowerBound(0);
    }

    var oObjectStore = this._getObjectStore(sObjectStore);
    var oCursor = oObjectStore.openCursor(oKeyRange);

    oCursor.onsuccess = function(eEvent) {
        var oResult = eEvent.target.result;
        if (false === oResult || null === oResult) {
            return;
        }
        fCallbackForEachRow(oResult.value);
        oResult.continue();

    };

    oCursor.onerror = this.onError;

};

Storage.Engine.prototype._getObjectStore = function (sObjectStore, sMode) {

    var oDatabase = this.oDatabase;
    var oTransaction = this.oDatabase.transaction(sObjectStore, 'readwrite');
    var oObjectStore = oTransaction.objectStore(sObjectStore);
    return oObjectStore;
};

Storage.Engine.prototype.onError = function (eEvent) {
    throw 'Unable to perform request';
};

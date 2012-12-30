;Storage.Engine = function(sDatabaseName, sObjectStoreName, sKeyPath, sVersion) {
    this.sDatabaseName = sDatabaseName;
    this.sObjectStoreName = sObjectStoreName;
    this.sKeyPath = sKeyPath;
    this.sVersion = sVersion;
    this.oDatabase = null;
    this.bOpened = false;
};

Storage.Engine.prototype.open = function(fCallback) {
        var oThat = this;
        var oRequestToTheBase = indexedDB.open(this.sDatabaseName, this.sVersion);
        oRequestToTheBase.onsuccess = function(eEvent) {
            oThat.oDatabase = eEvent.target.result;
            fCallback();
        };

        oRequestToTheBase.onupgradeneeded = function(e) {

            var oDatabase = event.target.result;
            var oStore = oDatabase.createObjectStore(oThat.sObjectStoreName, {
                keyPath: oThat.sKeyPath
            });;
        };

        oRequestToTheBase.onerror = function(e){
            console.log(e);
        };

};

/**
 * Add data to the store
 * @param oData
 *              The json object to add
 * @param fCallback
 *              The method to execute after the insertion
 */
Storage.Engine.prototype.saveData = function (oData, fCallback) {

    var oObjectStore = this._getObjectStore();
    var oMyRequest = oObjectStore.put(oData);
    oMyRequest.onsuccess = function(eEvent) {
        fCallback(eEvent);
    };
};

/**
 * Fetch data from indexedDb
 * @param fCallbackForEachRow
 *                          The callback called on each row fetched
 * @param iKey
 *          Opt. If provided, the result will be limited at this key, else
 *          all rows will be fetched
 */
Storage.Engine.prototype.getData = function (fCallbackForEachRow, iKey) {

    var bUseKey = (typeof(iKey) === 'undefined') ? false : true;

    if (true === bUseKey) {
        var oKeyRange = IDBKeyRange.only(iKey);
    } else {
        var oKeyRange = IDBKeyRange.lowerBound(0);
    }

    var oObjectStore = this._getObjectStore();
    var oCursor = oObjectStore.openCursor(oKeyRange);

    oCursor.onsuccess = function(eEvent) {
        var oResult = eEvent.target.result;
        if (false === oResult || null === oResult) {
            return;
        }
        fCallbackForEachRow(oResult.value);
        oResult.continue;
    };

    oCursor.onerror = this.onError;

};

Storage.Engine.prototype._getObjectStore = function (sMode) {

    var oDatabase = this.oDatabase;
    var oTransaction = this.oDatabase.transaction(this.sObjectStoreName, 'readwrite');
    var oObjectStore = oTransaction.objectStore(this.sObjectStoreName);
    return oObjectStore;
};

Storage.Engine.prototype.onError = function (eEvent) {
    console.log(eEvent);
    throw 'Unable to perform request';
};

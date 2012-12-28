Storage.Engine = function() {
    this.sDatabaseName = 'DroneDB';
    this.sObjectStoreName = 'WatchList';
    this.sKeyPath = null;
    this.sVersion = '1.0';
    this.oDatabase = null;
    this.bOpened = false;
};

Storage.Engine.prototype.open = function(sDatabaseName, sObjectStoreName, sKeyPath, fCallback)
{
    this.sDatabaseName = sDatabaseName;
    this.sObjectStoreName = sObjectStoreName;
    this.sKeyPath = sKeyPath;

    if (this.bOpened === false) {
        var oThat = this;
        var oRequestToTheBase = indexedDB.open(this.sDatabaseName);
        oRequestToTheBase.onsuccess = function(eEvent) {
            oThat.oDatabase = eEvent.target.result;
            oThat.bOpened = true;

            // Database creation is success, now we create the object stores
            if (oThat.oDatabase.version !== oThat.sVersion) {
                var oVersionRequest = oThat.oDatabase.setVersion(oThat.sVersion);

                oVersionRequest.onsuccess = function(eVersionEvent) {
                    var oStore = oThat.oDatabase.createObjectStore(oThat.sObjectStoreName, {
                        keyPath: this.sKeyPath
                    });
                    oStore = eVersionEvent.target.transaction.oncomplete = function() {
                        return fCallback();
                    };
                };
                oVersionRequest.onfailure = oThat.onError;

            } else {
                return fCallback();
            }
        };
        oRequestToTheBase.onError = oThat.onError;
    }
};

/**
 * Add data to the store
 * @param oData
 *              The json object to add
 * @param fCallback
 *              The method to execute after the insertion
 */
Storage.Engine.prototype.addData = function (oData, fCallback) {

    var oObjectStore = this._getObjectStore();
    var oMyRequest = oObjectStore.put(oData);
    oMyRequest.onsuccess = function(eEvent) {
        fCallback(e);
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
    if (true === bUseKey) {
        var oKeyRange = IDBKeyRange.only(iKey);
    } else {
        var oKeyRange = IDBKeyRange.lowerBound(0);
    }

    var oObjectStore = this._getObjectStore();
    var oCursor = oObjectStore.openCursor(oKeyRange);

    oCursor.onsuccess = function(eEvent) {
        var oResult = eEvent.target.result;
        if (false === oResult) {
            return;
        }
        fCallbackForEachRow(oResult.value);
        oResult.continue;
    };

    oCursor.onerror = this.onError;


};

Storage.Engine.prototype._getObjectStore = function (sMode) {
    if (typeof(sMode) === 'undefined') {
        var sMode = 'readwrite';
    }
    var oDatabase = this.oDatabase;
    var oTransaction = oDatabase.transaction([this.sDatabaseName], sMode);
    var oObjectStore = oTransaction.objectStore(this.sObjectStoreName);
    return oObjectStore;
};

Storage.Engine.prototype.onError = function(eEvent) {
    console.log(eEvent);
    throw 'Unable to perform request';
};

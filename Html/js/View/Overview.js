View.Overview = function() {
    this.sOverviewSelector = '#Overview';
};

View.Overview.prototype.addWatch = function(oWatch) {

    if ($('#watch-'+oWatch.getName()).length === 0) {
        var sHtmlToAdd = '';
        sHtmlToAdd += '<tr class="watch" id="watch-'+oWatch.getName()+'">';
        sHtmlToAdd += '<td class="name"></td>';
        sHtmlToAdd += '<td class="httpcode"></td>';
        sHtmlToAdd += '<td class="applications"></td>';
        sHtmlToAdd += '</tr>';
        $(this.sOverviewSelector).append(sHtmlToAdd);
    }

    var oRow = $('#watch-'+oWatch.getName());

    oRow.find('.name').html(this._createNameSection(oWatch))
    oRow.find('.httpcode').html(this._createHttpCodeSection(oWatch))
    oRow.find('.applications').html(this._createApplicationsSection(oWatch))

};

View.Overview.prototype._createNameSection = function(oWatch) {
    var sHtmlToAdd = oWatch.getName();
    if (true === oWatch.isOk()) {
        var sIconClass= 'icon-ok-circle';
    } else {
        var sIconClass = 'icon-exclamation-sign';
    }
    sHtmlToAdd += '<i class="'+sIconClass+'"></i>';
    return sHtmlToAdd;
};

View.Overview.prototype._createHttpCodeSection = function(oWatch) {
    if (oWatch.getHttpCode() === 200) {
        var sHttpCodeClass = 'btn-success';
    } else {
        var sHttpCodeClass = 'btn-danger';
    }
    return '<div class="btn '+sHttpCodeClass+'">'+oWatch.getHttpCode()+'</div>';
}

View.Overview.prototype._createApplicationsSection = function (oWatch) {
    var oApplications = oWatch.getAllApplications();
    var sApplication = '';
    for (sApplicationName in oApplications) {
        if ('length' !== sApplicationName) {
            var oApplication = oApplications[sApplicationName];
            if (oApplication.httpCode === 200) {
                var sApplicationButtonClass = 'btn-success';
            } else {
                var sApplicationButtonClass = 'btn-danger';
            }
            sApplication += '<span class="btn '+sApplicationButtonClass+'" style="margin-right:5px">'+sApplicationName+'</span>';
        }
    }

    return sApplication;
}

View.Overview.prototype.emptyOverview = function() {
    $(this.sOverviewSelector+ ' tr.watch').detach();
}
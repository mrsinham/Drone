View.Overview = function() {
    this.sOverviewSelector = '#Overview';
    this.sOverviewCounterSelector = '#OverviewCounter';
    this.sEnvironmentButtonSelector = '.environmentButton';
    this._watchEnvironmentSection();
};

View.Overview.prototype.addWatch = function(oWatch) {
    if ($('#watch-'+oWatch.getName()).length === 0) {
        var sHtmlToAdd = '';
        sHtmlToAdd += '<tr class="watch" data-watch="'+oWatch.getName()+'" id="watch-'+oWatch.getName()+'">';
        sHtmlToAdd += '<td class="name"></td>';
        sHtmlToAdd += '<td class="httpcode"></td>';
        sHtmlToAdd += '<td class="applications"></td>';
        sHtmlToAdd += '<td class="environment"><a class="btn environmentButton">Environment</a><div class="environmentContent"></div></td>';
        sHtmlToAdd += '</tr>';
        $(this.sOverviewSelector).append(sHtmlToAdd);
    }

    var oRow = $('#watch-'+oWatch.getName());

    oRow.find('.name').html(this._createNameSection(oWatch))
    oRow.find('.httpcode').html(this._createHttpCodeSection(oWatch))
    oRow.find('.applications').html(this._createApplicationsSection(oWatch))
    oRow.find('.environmentContent').html(this._createEnvironmentSection(oWatch))


    $('.jsTooltip').tooltip();

};

View.Overview.prototype.removeWatchThatAreNotInList = function(aList) {
    $(this.sOverviewSelector).find('tr.watch').each(function(iIndex, oElement){
        var oElement = $(oElement);
        if (-1 === $.inArray(oElement.data('watch'), aList)) {
            oElement.detach();
        }
    });
};

View.Overview.prototype.updateCounter = function(iCount) {
    $(this.sOverviewCounterSelector).html(iCount);
};

View.Overview.prototype._createNameSection = function(oWatch) {
    if (true === oWatch.isOk()) {
        var sIconClass= 'icon-ok-circle';
    } else {
        var sIconClass = 'icon-exclamation-sign';
    }
    var sHtmlToAdd = '<i class="'+sIconClass+'"></i>&nbsp;';
    sHtmlToAdd += '<span>'+oWatch.getName()+'</span>';
    return sHtmlToAdd;
};

View.Overview.prototype._createHttpCodeSection = function(oWatch) {
    if (oWatch.getHttpCode() === 200) {
        var sHttpCodeClass = 'btn-success';
    } else {
        var sHttpCodeClass = 'btn-danger';
    }
    return '<a rel="tooltip" data-placement="top" data-original-title="'+oWatch.getResponseText()+'" class="jsTooltip btn '+sHttpCodeClass+'">'+oWatch.getHttpCode()+'</a>';
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
            sApplication += '<a rel="tooltip" data-placement="top" data-original-title="'+oApplication.httpCode+' - '+oApplication.response+'" class="jsTooltip btn '+sApplicationButtonClass+'" style="margin-right:5px">'+sApplicationName+'</a>';
        }
    }

    return sApplication;
}

View.Overview.prototype._createEnvironmentSection = function (oWatch) {
    var oEnvironments = oWatch.getAllEnvironments();
    var sEnvironment = '';
    for (sEnvironmentName in oEnvironments) {
        if ('length' !== sEnvironmentName) {
            var mEnvironmentValue = oEnvironments[sEnvironmentName];
            sEnvironment += '<strong>'+sEnvironmentName+'</strong> : <span class="label label-info" style="margin-right:5px">'+mEnvironmentValue+'</span>';
        }
    }

    return sEnvironment;
}

View.Overview.prototype.emptyOverview = function() {
    $(this.sOverviewSelector+ ' tr.watch').detach();
}

View.Overview.prototype._watchEnvironmentSection = function() {
    var oThat = this;
    $(this.sEnvironmentButtonSelector).live('click', function(eEvent){
        console.log('ttttt');
        $(eEvent.currentTarget).popover({
            title:'toto',
            content:'tutu',
            placement:'bottom'
        }).popover('toggle');;
        //$(eEvent.currentTarget).popover('toggle');
    });
};
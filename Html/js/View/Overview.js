View.Overview = function() {
    this.sOverviewSelector = '#Overview';
    this.sOverviewCounterSelector = '#OverviewCounter';
    this.sEnvironmentButtonSelector = '.environmentButton';
    this._watchEnvironmentSection();
    this.fModalShown;
    this.fModalHidden;
};

View.Overview.prototype.addWatch = function(oWatch) {
    if ($('#watch-'+oWatch.getName()).length === 0) {
        var sHtmlToAdd = '';
        sHtmlToAdd += '<tr class="watch" data-watch="'+oWatch.getName()+'" id="watch-'+oWatch.getName()+'">';
        sHtmlToAdd += '<td class="name"></td>';
        sHtmlToAdd += '<td class="httpcode"></td>';
        sHtmlToAdd += '<td class="applications"></td>';
        sHtmlToAdd += '<td class="environment"><div class="environmentContent"></div></td>';
        sHtmlToAdd += '</tr>';
        $(this.sOverviewSelector).append(sHtmlToAdd);
    }

    var oRow = $('#watch-'+oWatch.getName());

    oRow.find('.name').html(this._createNameSection(oWatch))
    oRow.find('.httpcode').html(this._createHttpCodeSection(oWatch))
    oRow.find('.applications').html(this._createApplicationsSection(oWatch))
    oRow.find('.environmentContent').html(this._createEnvironmentSection(oWatch))


    var oNode = $("#modal-"+oWatch.getName());
    var oThat = this;
    oNode.on('show', function(){
        oThat.fModalShown();
    });
    oNode.on('hidden', function(){
        oThat.fModalHidden();
    });

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
    sEnvironment += '<a href="#modal-'+oWatch.getName()+'" role="button" class="btn" data-toggle="modal">Environment</a>';

    sEnvironment += '<div id="modal-'+oWatch.getName()+'" class="modal hide fade envModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel-'+oWatch.getName()+'" aria-hidden="true">';
    sEnvironment += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button><h3 id="modalLabel-'+oWatch.getName()+'">Environment</h3></div>';
    sEnvironment += '<div class="modal-body">';

    var iNumberOfEnv = 0;
    for (sEnvironmentName in oEnvironments) {
        if ('length' !== sEnvironmentName) {
            var mEnvironmentValue = oEnvironments[sEnvironmentName];
            sEnvironment += '<strong>'+sEnvironmentName+'</strong> : <span class="label label-info" style="margin-right:5px">'+mEnvironmentValue+'</span><br/>';
            iNumberOfEnv++;
        }
    }

    if (0 === iNumberOfEnv) {
        sEnvironment += '<strong>No infos</strong>';
    }

    sEnvironment += '</div>';
    sEnvironment += '<div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">Close</button></div>';
    sEnvironment += '</div>';




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

View.Overview.prototype.setOnModalHidden = function(fModalHidden) {
    this.fModalHidden = fModalHidden;
}

View.Overview.prototype.setOnModalShown = function(fModalShown) {
    this.fModalShown = fModalShown;
}
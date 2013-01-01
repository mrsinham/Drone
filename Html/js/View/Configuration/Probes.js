View.Configuration.Probes = function() {
    this.sAddProbeFormSelector = '#addProbe';
    this.sAddNewProbeButton = '#sAddNewProbe';
    // Form fields
    this.sAddProbeUrlSelector = '#sProbeUrl';
    this.sAddProbeNameSelector = '#sProbeName';
    this.sAddProbeHostnameSelector = '#sHostname';

    this.fProbeSaver = null;

    this.oUrlRegexp = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");

    this.oFields = {
        name: null,
        url: null,
        hostname: null
    };
};

View.Configuration.Probes.prototype.watchAddProbeForm = function() {
    var oThat = this;
    $(this.sAddNewProbeButton).live('click', function(eEvent){
        oThat._removeAllErrors();
        if (true === oThat._isFormValid()) {
            // Saving the probe
            oThat.fProbeSaver(oThat.oFields);
        }

        return false;
    });
};

View.Configuration.Probes.prototype._isFormValid = function() {
    var bNameValid = this._isValidProbeName();
    var bUrlValid = this._isValidUrl();
    var bHostnameValid = this._isValidHostname();
    if (false === bNameValid) {
        return false;
    }
    if (false === bUrlValid) {
        return false;
    }

    if (false === bHostnameValid) {
        return false;
    }


    return true;
};

View.Configuration.Probes.prototype._isValidProbeName = function() {
    var sName = $.trim($(this.sAddProbeNameSelector).val());
    if (sName === '') {
        // False, but just empty
        this._displayError(this.sAddProbeNameSelector, 'Cant add probe without a name');
        return false;
    }

    if (-1 !== sName.indexOf(' ')) {
        this._displayError(this.sAddProbeNameSelector, 'No spaces in probe name');
        return false;
    }
    this.oFields.name = sName;
    return true;
};

View.Configuration.Probes.prototype._isValidUrl = function() {
    var sUrl = $.trim($(this.sAddProbeUrlSelector).val());
    var bIsValidUrl = this.oUrlRegexp.test(sUrl);
    if (false === bIsValidUrl) {
        this._displayError(this.sAddProbeUrlSelector, 'Url not valid, please correct it');
        return false;
    }
    this.oFields.url = sUrl;
    return true;
};

View.Configuration.Probes.prototype._isValidHostname = function() {
    var sHostname = $.trim($(this.sAddProbeHostnameSelector).val());

    if (sHostname === '') {
        // False, but just empty
        this._displayError(this.sAddProbeHostnameSelector, 'Cant add probe without a hostname');
        return false;
    }

    if (-1 !== sHostname.indexOf(' ')) {
        this._displayError(this.sAddProbeHostnameSelector, 'No spaces in probe hostname');
        return false;
    }

    this.oFields.hostname = sHostname;
    return true;
};

View.Configuration.Probes.prototype._displayError = function(sInputIdSelector, sError) {
    var oInput = $(sInputIdSelector);
    if (0 === oInput.length) {
        alert(sError);
        throw 'Unable to locate input id for displaying error';
    }
    var oControlGroup = oInput.closest('.control-group');
    console.log(oControlGroup);
    oControlGroup.addClass('error').find('.help-inline').html(sError);
};

View.Configuration.Probes.prototype._removeAllErrors = function() {
    var oForm = $(this.sAddProbeFormSelector);
    oForm.find('.control-group').removeClass('error');
    oForm.find('.help-inline').html('');
};

View.Configuration.Probes.prototype.setProbeSaver = function(fProveSaver) {
    this.fProbeSaver = fProveSaver;
};
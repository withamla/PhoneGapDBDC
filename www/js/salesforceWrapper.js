
function SalesforceWrapper() {
    alert("inside wrapper");
    /* AUTHENTICATION PARAMETERS */
    this.loginUrl = 'https://login.salesforce.com/';
    this.clientId = '3MVG9QDx8IX8nP5SxUNC2EJur7OK.mHSJWbkjO4YF79YA_pl70sIoeDgQp_tSIs5v10hLaZTxwZWQpo4WU6xu';
   // this.redirectUri = 'https://login.salesforce.com/services/oauth2/success';
    this.redirectUri = 'sfdc://success';
    
    /* CLASS VARIABLES */
    this.cb = undefined;     //ChildBrowser in PhoneGap
    this.client = undefined; //forceTk client instance
    
    this.init();
}

SalesforceWrapper.prototype.init = function() {
    alert("in init");
    this.client = new forcetk.Client(this.clientId, this.loginUrl);
    this.cb = window.plugins.childBrowser;
}

SalesforceWrapper.prototype.login = function (successCallback) {
    alert("in sfw login");
    this.loginSuccess = successCallback;
    alert("in sfw login 2");
    var self = this;
    alert("in sfw login 3");
    
    self.cb.onLocationChange = function (loc) {
        alert("inside self.onlocationChange");
        if (loc.search(self.redirectUri) >= 0) {
            alert("before cb close");
            self.cb.close();
            self.sessionCallback(unescape(loc));
        }
    };
  
    alert("in sfw login 4");
  
    self.cb.showWebPage(self.getAuthorizeUrl(self.loginUrl, self.clientId, self.redirectUri));
    alert("in sfw login 5");
}

SalesforceWrapper.prototype.getAuthorizeUrl = function (loginUrl, clientId, redirectUri) {
    alert("inside getAutorhizeUrl");
    return loginUrl + 'services/oauth2/authorize?display=touch' + '&response_type=token&client_id=' + escape(clientId) + '&redirect_uri=' + escape(redirectUri);
}

SalesforceWrapper.prototype.sessionCallback = function(loc) {    var oauthResponse = {};
    alert("inside sessionCallback");
    var fragment = loc.split("#")[1];
    
    if (fragment) {
        var nvps = fragment.split('&');
        for (var nvp in nvps) {
            var parts = nvps[nvp].split('=');
            oauthResponse[parts[0]] = unescape(parts[1]);
        }
    }
    
    if (typeof oauthResponse === 'undefined' || typeof oauthResponse['access_token'] === 'undefined') {
        console.log("error");
    } else {
        this.client.setSessionToken(oauthResponse.access_token, null, oauthResponse.instance_url);
        if ( this.loginSuccess ) {
            this.loginSuccess();
        }
    }
    this.loginSuccess = undefined;
}

Chikyu.prototype.login = function(tokenName, loginToken, secretToken) {
  var d = $.Deferred();
  this.session = {};
  var that = this;
  this.invokeOpen('/session/login', {
    token_name: tokenName,
    login_token: loginToken,
    login_secret_token: secretToken
  }).done(function(data) {
    that.session.sessionId = data.session_id;
    that.session.identityId = data.cognito_identity_id;
    that.session.apiKey = data.api_key;
    var cognitoToken = data.cognito_token;
    that.getCredentials(data.cognito_token).done(function(data) {
      that.session.credentials = data.Credentials;
      d.resolve(that.session);
    }).fail(function(err) {
      d.reject(err);
    });
  }).fail(function(err) {
    d.reject(err);
  });
  return d.promise();
};

Chikyu.prototype.changeOrgan = function(targetOrganId) {

};

Chikyu.prototype.logout = function() {

};

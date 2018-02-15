Chikyu.Sdk.prototype.login = function(tokenName, loginToken, secretToken, duration) {
  var d = $.Deferred();
  this.session = {};
  var that = this;
  this.invokeOpen('/session/login', {
    token_name: tokenName,
    login_token: loginToken,
    login_secret_token: secretToken,

    duration: duration
  }).done(function(data) {
    that.session.sessionId = data.session_id;
    that.session.identityId = data.cognito_identity_id;
    that.session.apiKey = data.api_key;

    //API呼び出しのレイテンスはあるが、だいたい補正できればOK。
    var localTime = new Date().getTime();
    var serverTime = data.server_time * 1000;
    that.session.offset = serverTime - localTime;

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

Chikyu.Sdk.prototype.changeOrgan = function(targetOrganId) {
  return this.invokeSecure('/session/organ/change', {
    'target_organ_id': targetOrganId
  })
};

Chikyu.Sdk.prototype.logout = function() {
  return this.invokeSecure('/session/logout', {});
};

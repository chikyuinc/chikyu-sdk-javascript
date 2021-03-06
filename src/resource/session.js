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
    that.session.user = {};
    that.session.user.userId = data.user.user_id;

    // var localTime = new Date().getTime();
    // var serverTime = data.server_time * 1000;
    that.session.offset = 0; //serverTime - localTime;
    that.session.sessionSecretKey = data.session_secret_key;

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

Chikyu.Sdk.prototype.hasSession = function() {
  return this.session != null && this.session.sessionId &&
          this.session.identityId && this.session.credentials != null
};

Chikyu.Sdk.prototype.sessionToMap = function() {
  if (!this.hasSession()) {
    return null;
  }

  return {
    'sessionId': this.session.sessionId,
    'identityId': this.session.identityId,
    'sessionSecretKey': this.session.sessionSecretKey,
    'apiKey': this.session.apiKey,
    'offset': this.session.offset,
    'credentials': this.session.credentials,
    'user': {
      'userId': this.session.user.userId
    }
  }
};

Chikyu.Sdk.prototype.mapToSession = function(sessionMap) {
  this.session = {};
  this.session.sessionId = sessionMap['sessionId'];
  this.session.user = sessionMap['user'];
  this.session.sessionSecretKey = sessionMap['sessionSecretKey'];
  this.session.identityId = sessionMap['identityId'];
  this.session.apiKey = sessionMap['apiKey'];
  this.session.offset = sessionMap['offset'];
  this.session.credentials = sessionMap['credentials'];
};

Chikyu.Sdk.prototype.sessionToJson = function() {
  var item = this.sessionToMap();
  if (item) {
    return JSON.stringify(item);
  }
};

Chikyu.Sdk.prototype.sessionFromJson = function(json) {
  var item = JSON.parse(json);
  this.mapToSession(item);
};

Chikyu.Sdk.prototype.changeOrgan = function(targetOrganId) {
  var d = $.Deferred();
  var that = this;
  this.invokeSecure('/session/organ/change', {
    'target_organ_id': targetOrganId
  }).then(function(data) {
    that.session.apiKey = data['api_key'];
    that.session.user = data['user'];
    d.resolve();
  }).fail(function(err) {
    d.reject(err);
  });
  return d.promise();
};

Chikyu.Sdk.prototype.logout = function() {
  return this.invokeSecure('/session/logout', {});
};

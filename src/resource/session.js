Chikyu.Sdk.prototype.login = function(tokenName, loginToken, secretToken, duration) {
  var that = this;
  this.session = {};
  
  return this.invokeOpen('/session/login', {
    token_name: tokenName,
    login_token: loginToken,
    login_secret_token: secretToken,
    duration: duration
  }).then(function(data) {
    that.session.sessionId = data.session_id;
    that.session.identityId = data.cognito_identity_id;
    that.session.apiKey = data.api_key;
    that.session.user = {};
    that.session.user.userId = data.user.user_id;

    that.session.offset = 0;
    that.session.sessionSecretKey = data.session_secret_key;

    return that.getCredentials(data.cognito_token);
  }).then(function(data) {
    that.session.credentials = data.Credentials;
    return that.session;
  });
};

Chikyu.Sdk.prototype.hasSession = function() {
  return this.session != null && this.session.sessionId &&
          this.session.identityId && this.session.credentials != null;
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
  };
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
  var that = this;
  return this.invokeSecure('/session/organ/change', {
    'target_organ_id': targetOrganId
  }).then(function(data) {
    that.session.apiKey = data['api_key'];
    that.session.user = data['user'];
  });
};

Chikyu.Sdk.prototype.logout = function() {
  return this.invokeSecure('/session/logout', {});
};

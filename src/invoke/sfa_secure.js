Chikyu.Sdk.prototype.invokeSfaSecure = function(apiPath, data, http) {
  if (!this.hasSession()) {
    return Promise.reject({'has_error': true, 'message': 'セッション情報がありません'});
  }

  var path = this.buildUrl("sfa_secure", apiPath, false);
  var params = Object.assign({}, data, {
    'session_id': this.session.sessionId
  });

  if (this.config.mode() === 'local' || this.config.mode() === 'docker') {
    params['identity_id'] = this.session.identityId;
  }

  var signedHeaders = this.getSignedHeaders(path, JSON.stringify(params));
  return this.invoke("sfa_secure", apiPath, params, signedHeaders, http);
};

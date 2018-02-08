Chikyu.prototype.invokeSecure = function(apiPath, data) {
  var path = this.buildUrl("secure", apiPath, false);
  var params = {
    'session_id': this.session.sessionId,
    'data': data
  };

  if (this.config.mode() == 'local') {
    params['identity_id'] = this.session.identityId;
  }

  var signedHeaders = this.getSignedHeaders(path, JSON.stringify(params));
  return this.invoke("secure", apiPath, params, signedHeaders);
};

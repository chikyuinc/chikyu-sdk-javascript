Chikyu.Sdk.prototype.invokeSecure = function(apiPath, data) {
  if (!this.hasSession()) {
    var d = $.Deferred();
    d.reject({'has_error': true, 'message': 'セッション情報がありません'});
    return d.promise();
  }

  var path = this.buildUrl("secure", apiPath, false);
  var params = {
    'session_id': this.session.sessionId,
    'data': data
  };

  if (this.config.mode() == 'local' || this.config.mode() == 'docker') {
    params['identity_id'] = this.session.identityId;
  }

  var signedHeaders = this.getSignedHeaders(path, JSON.stringify(params));
  return this.invoke("secure", apiPath, params, signedHeaders);
};

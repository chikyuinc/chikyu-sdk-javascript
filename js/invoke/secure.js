Chikyu.prototype.invokeSecure = function(apiPath, data) {
  var path = this.buildUrl("secure", apiPath, false);
  var params = {
    'session_id': this.session.sessionId,
    'data': data
  };

  var signedHeaders = this.getSignedHeaders(path, JSON.stringify(params));
  return this.invoke("secure", apiPath, params, signedHeaders);
};

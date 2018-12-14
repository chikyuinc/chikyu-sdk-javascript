Chikyu.Sdk.prototype.invokeSignless = function(apiPath, data, http) {
  if (!this.hasSession()) {
    var d = $.Deferred();
    d.reject({'has_error': true, 'message': 'セッション情報がありません'});
    return d.promise();
  }

  var d = new Date();
  var s = function(i) { return (i < 10) ? '0' + i : '' + i; };
  var salt = s(d.getUTCFullYear()) + s((d.getUTCMonth() + 1)) + s(d.getUTCDate()) + 'T' +
              s(d.getUTCHours()) + s(d.getUTCMinutes()) + s(d.getUTCSeconds()) + 'Z';

  var path = this.buildUrl("signless", apiPath, false);
  var params = {
    'session_id': this.session.sessionId,
    'identity_id': this.session.identityId,
    'salt': salt,
    'data': data
  };

  var authText = salt + '&' + JSON.stringify(params) + '&' + this.session.sessionSecretKey;
  //console.log(authText);
  var authKey = sha256.update(authText).hex();
  var headers = [
    ['X-API-KEY', this.session.apiKey],
    ['X-AUTH-KEY', authKey],
    ['Content-Type', 'application/json']
  ];

  return this.invoke("signless", apiPath, params, headers, http);
};

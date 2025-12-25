/**
 * sfa_public API 呼び出し (POST)
 */
Chikyu.Sdk.prototype.invokeSfaPublic = function(apiPath, data, http) {
  return this._invokeSfaPublicWithMethod('POST', apiPath, data, http);
};

/**
 * sfa_public API 呼び出し (GET)
 */
Chikyu.Sdk.prototype.invokeSfaPublicGet = function(apiPath, http) {
  return this._invokeSfaPublicWithMethod('GET', apiPath, null, http);
};

/**
 * sfa_public API 呼び出し (DELETE)
 */
Chikyu.Sdk.prototype.invokeSfaPublicDelete = function(apiPath, data, http) {
  return this._invokeSfaPublicWithMethod('DELETE', apiPath, data, http);
};

/**
 * sfa_public API 呼び出し (PUT)
 */
Chikyu.Sdk.prototype.invokeSfaPublicPut = function(apiPath, data, http) {
  return this._invokeSfaPublicWithMethod('PUT', apiPath, data, http);
};

/**
 * sfa_public API 内部実装
 */
Chikyu.Sdk.prototype._invokeSfaPublicWithMethod = function(method, apiPath, data, http) {
  var headers = [
    ['Content-Type', 'application/json'],
    ['X-Api-Key', this.params.apiKey],
    ['X-Auth-Key', this.params.authKey]
  ];

  return this.invoke("sfa_public", apiPath, data, headers, http, method);
};


/**
 * sfa_secure API 呼び出し (POST)
 */
Chikyu.Sdk.prototype.invokeSfaSecure = function(apiPath, data, http) {
  return this._invokeSfaSecureWithMethod('POST', apiPath, data, http);
};

/**
 * sfa_secure API 呼び出し (GET)
 */
Chikyu.Sdk.prototype.invokeSfaSecureGet = function(apiPath, http) {
  return this._invokeSfaSecureWithMethod('GET', apiPath, null, http);
};

/**
 * sfa_secure API 呼び出し (DELETE)
 */
Chikyu.Sdk.prototype.invokeSfaSecureDelete = function(apiPath, data, http) {
  return this._invokeSfaSecureWithMethod('DELETE', apiPath, data, http);
};

/**
 * sfa_secure API 呼び出し (PUT)
 */
Chikyu.Sdk.prototype.invokeSfaSecurePut = function(apiPath, data, http) {
  return this._invokeSfaSecureWithMethod('PUT', apiPath, data, http);
};

/**
 * sfa_secure API 内部実装
 */
Chikyu.Sdk.prototype._invokeSfaSecureWithMethod = function(method, apiPath, data, http) {
  if (!this.hasSession()) {
    return Promise.reject({'has_error': true, 'message': 'セッション情報がありません'});
  }

  // sfa_secure API は x-session-id, x-identity-id をヘッダーで送信
  var headers = [
    ['Content-Type', 'application/json'],
    ['x-session-id', this.session.sessionId],
    ['x-identity-id', this.session.identityId]
  ];

  // identity_pool_id があれば追加
  if (this.session.identityPoolId) {
    headers.push(['x-identity-pool-id', this.session.identityPoolId]);
  }

  return this.invoke("sfa_secure", apiPath, data, headers, http, method);
};

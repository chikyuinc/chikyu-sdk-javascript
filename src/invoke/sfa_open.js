/**
 * sfa_open API 呼び出し (POST)
 */
Chikyu.Sdk.prototype.invokeSfaOpen = function(apiPath, data, http) {
  return this.invoke('sfa_open', apiPath, data, [
    ['Content-Type', 'application/json']
  ], http);
};


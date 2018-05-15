Chikyu.Sdk.prototype.setApiKeys = function(apiKey, authKey) {
  if (!this.params) {
    this.params = {};
  }
  this.params.apiKey = apiKey;
  this.params.authKey = authKey;
};

Chikyu.Sdk.prototype.invokePublic = function(apiPath, data) {
  return this.invoke('public', apiPath, {'data': data},[
                        ['Content-Type', 'application/json'],
                        ['X-Api-Key', this.params.apiKey],
                        ['X-Auth-Key', this.params.authKey]
                     ]);
};

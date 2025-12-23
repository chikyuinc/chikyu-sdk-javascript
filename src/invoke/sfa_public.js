Chikyu.Sdk.prototype.invokeSfaPublic = function(apiPath, data, http) {
  return this.invoke('sfa_public', apiPath, data, [
                        ['Content-Type', 'application/json'],
                        ['X-Api-Key', this.params.apiKey],
                        ['X-Auth-Key', this.params.authKey]
                     ], null, http);
};


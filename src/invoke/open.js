Chikyu.Sdk.prototype.invokeOpen = function(apiPath, data, http) {
  return this.invoke('open', apiPath, {'data': data}, null, http);
};

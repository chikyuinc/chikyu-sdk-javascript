Chikyu.Sdk.prototype.invokeOpen = function(apiPath, data) {
  return this.invoke('open', apiPath, {'data': data}, null);
};

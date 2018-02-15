Chikyu.Sdk.prototype.getCredentials = function(cognitoToken) {
  var sts = new AWS.STS({region: this.config.awsRegion()});
  var d = $.Deferred();
  sts.assumeRoleWithWebIdentity({
    RoleArn: this.config.awsRoleArn(),
    RoleSessionName: this.config.awsApiGwServiceName(),
    WebIdentityToken: cognitoToken
  }, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      d.reject(err);
    } else {
      d.resolve(data);
    }
  });
  return d.promise();
};

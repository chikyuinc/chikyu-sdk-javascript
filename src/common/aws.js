Chikyu.Sdk.prototype.getCredentials = function(cognitoToken) {
  var sts = new AWS.STS({region: this.config.awsRegion()});
  var config = this.config;
  
  return new Promise(function(resolve, reject) {
    sts.assumeRoleWithWebIdentity({
      RoleArn: config.awsRoleArn(),
      RoleSessionName: config.awsApiGwServiceName(),
      WebIdentityToken: cognitoToken,
      DurationSeconds: 43200
    }, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

Chikyu.prototype.getCredentials = function(cognitoToken) {
  var sts = new AWS.STS({region: 'ap-northeast-1'});
  var d = $.Deferred();
  sts.assumeRoleWithWebIdentity({
    RoleArn: this.config.AWS_ROLE_ARN,
    RoleSessionName: this.config.AWS_API_GW_SERVICE_NAME,
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

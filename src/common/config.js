Chikyu.prototype.config = {
  awsRegion: function() {
    return 'ap-northeast-1';
  },
  awsRoleArn: function() {
    return 'arn:aws:iam::171608821407:role/Cognito_Chikyu_Normal_Id_PoolAuth_Role';
  },
  awsApiGwServiceName: function() {
    return 'execute-api';
  },
  host: function() {
    if (this.mode() == 'local') {
      return 'localhost:9090';
    } else if (this.mode() == 'dev') {
      return 'gateway.chikyu.mobi';
    }
  },
  protocol: function() {
    if (this.mode() == 'local') {
      return 'http';
    } else if (this.mode() == 'dev') {
      return 'https';
    }
  },
  envName: function() {
    return 'dev';
  },
  mode: function() {
    return 'dev';
  }
}

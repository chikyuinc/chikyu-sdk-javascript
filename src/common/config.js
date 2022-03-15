Chikyu.Sdk.prototype.config = {
  awsRegion: function() {
    return 'ap-northeast-1';
  },
  awsRoleArn: function() {
    if (this.mode() === 'prod'){
      return 'arn:aws:iam::171608821407:role/Cognito_chikyu_PROD_idpoolAuth_Role';
    }
    if (this.mode() === 'local' || this.mode() === 'docker') {
      return 'arn:aws:iam::527083274078:role/Cognito_ChikyuDevLocalAuth_Role';
    } else {
      return 'arn:aws:iam::171608821407:role/Cognito_Chikyu_Normal_Id_PoolAuth_Role';
    }
  },
  awsApiGwServiceName: function() {
    return 'execute-api';
  },
  host: function() {
    var hosts = {
      'local': 'localhost:9090',
      'docker': 'dev-python:9090',
      'prod': 'endpoint.chikyu.net'
    }
    return hosts[this.mode()] || 'gateway.chikyu.mobi';
  },
  protocol: function() {
    var protocols = {
      'local': 'http',
      'docker': 'http'
    }
    return protocols[this.mode()] || 'https';
  },
  envName: function() {
    var envNames = {
      'local': '',
      'docker': '',
      'devdc': 'dev',
      'prod': ''
    }
    return envNames[this.mode()] || this.mode();
  },
  mode: function() {
    if (!this._mode) {
      this._mode = 'prod';
    }
    return this._mode;
  },
  setMode: function(mode) {
    this._mode = mode;
  }
}

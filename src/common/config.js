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
  cognitoIdentityPoolId: function() {
    if (this.mode() === 'local' || this.mode() === 'docker') {
      return 'ap-northeast-1:247b529c-c1ec-423d-b037-7a2802137528';
    }
    if (this.mode() === 'prod') {
      return 'ap-northeast-1:0ebdb5b9-bc5c-4ac4-81cf-f7b993d09f51';
    }
    return 'ap-northeast-1:c28dcd87-68b9-4e7e-9cb1-b6e53e08ac3b';
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
    return this.mode() in hosts ? hosts[this.mode()] : 'gateway.chikyu.mobi';
  },
  protocol: function() {
    var protocols = {
      'local': 'http',
      'docker': 'http'
    }
    return this.mode() in protocols ? protocols[this.mode()] : 'https';
  },
  envName: function() {
    var envNames = {
      'local': '',
      'docker': '',
      'devdc': 'dev',
      'prod': ''
    }
    return this.mode() in envNames ? envNames[this.mode()] : this.mode();
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

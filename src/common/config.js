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
    }else if (this.mode() === 'dev03') {
      return 'arn:aws:iam::527083274078:role/Cognito_Chikyu_Normal_Id_Pool_devAuth_Role';
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
      'devdc': 'gateway.chikyu.mobi',
      'dev01': 'gateway.chikyu.mobi',
      'dev02': 'gateway.chikyu.mobi',
      'dev03': 'gateway-dev.chikyu.mobi',
      'hotfix01': 'gateway.chikyu.mobi',
      'prod': 'endpoint.chikyu.net'
    }
    return hosts[this.mode()];
  },
  protocol: function() {
    var protocols = {
      'local': 'http',
      'docker': 'http',
      'devdc': 'https',
      'dev01': 'https',
      'dev02': 'https',
      'dev03': 'https',
      'hotfix01': 'https',
      'prod': 'https'
    }
    return protocols[this.mode()];
  },
  envName: function() {
    var envNames = {
      'local': '',
      'docker': '',
      'devdc': 'dev',
      'dev01': 'dev01',
      'dev02': 'dev02',
      'dev03': 'dev03',
      'hotfix01': 'hotfix01',
      'prod': ''
    }
    return envNames[this.mode()];
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

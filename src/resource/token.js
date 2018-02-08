Chikyu.prototype.createToken = function(tokenName, email, password) {
  return this.invokeOpen('/session/token/create', {
    'token_name': tokenName,
    'email': email,
    'password': password
  });
};

Chikyu.prototype.renewToken = function(tokenName, loginToken, loginSecretToken) {
  return this.invokeOpen('/session/token/renew', {
    'token_name': tokenName,
    'login_token': loginToken,
    'login_secret_token': loginSecretToken
  });
};

Chikyu.prototype.revokeToken = function(tokenName, loginToken, loginSecretToken) {
  return this.invokeSecure('/session/token/revoke', {
    'token_name': tokenName,
    'login_token': loginToken,
    'login_secret_token': loginSecretToken
  });
};

Chikyu.Sdk.prototype.invoke = function(apiClass, apiPath, apiData, headers, http) {
  if (!headers) {
    headers = [['Content-Type', 'application/json']]
  }

  var url = this.buildUrl(apiClass, apiPath);
  var d = $.Deferred();

  var onSuccess = function(data) {
    if (data.has_error) {
      console.log('AJAX Error: ' + data.message);
      d.reject(data);
      return;
    }
    d.resolve(data.data);
  };

  var onError = function(err) {
    d.reject(err);
  };

  if (!http) {
    var payload = JSON.stringify(apiData);
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        processData: false,
        crossDomain: true,
        data: payload,
        cache: false,
        beforeSend: function(xhr) {
          headers.forEach(function(header) {
            if (header[0] == 'host') {
              return;
            }
            xhr.setRequestHeader(header[0], header[1]);
          });
        }
    }).done(function(data) {
      onSuccess(data);
    }).fail(function(err) {
      onError(err);
    });
  } else {
    //AngularJSのhttpオブジェクトを想定。
    http({
      url: url,
      method: 'POST',
      data: apiData,
      headers: headers
    }).success(function(data) {
      onSuccess(data);
    }).error(function(err) {
      onError(err);
    });
  }

  return d.promise();
};

Chikyu.Sdk.prototype.buildUrl = function(apiClass, apiPath, withHost) {
  if (withHost !== false) {
    withHost = true;
  }

  if (apiPath.indexOf('/') == 0) {
    apiPath = apiPath.substr(1);
  }

  var envName = this.config.envName();
  if (envName) {
    var path = '/' + this.config.envName() + '/api/v2/' + apiClass + '/' + apiPath;
  } else {
    var path = '/api/v2/' + apiClass + '/' + apiPath;
  }

  if (withHost) {
    return this.config.protocol() + '://' + this.config.host() + path;
  } else {
    return path;
  }
}

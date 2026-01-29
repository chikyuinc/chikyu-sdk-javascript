Chikyu.Sdk.prototype.invoke = function(apiClass, apiPath, apiData, headers, http) {
  if (!headers) {
    headers = [['Content-Type', 'application/json']]
  }
  headers = headers.slice();
  if (this.config.useHttpStatus()) {
    var hasErrorHeader = headers.some(function(h) {
      return h[0].toLowerCase() === 'error-response';
    });
    if (!hasErrorHeader) {
      headers.push(['Error-Response', 'http-status']);
    }
  }

  var url = this.buildUrl(apiClass, apiPath);
  var d = $.Deferred();

  var onSuccess = function(data, httpStatus) {
    if (data.has_error) {
      console.log('AJAX Error: ' + data.message);
      d.reject(data, httpStatus);
      return;
    }
    d.resolve(data.data, httpStatus);
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
            if (header[0] === 'host') {
              return;
            }
            xhr.setRequestHeader(header[0], header[1]);
          });
        }
    }).done(function(data, textStatus, jqXHR) {
      onSuccess(data, jqXHR.status);
    }).fail(function(req, status, error) {
      // responseJSONがある場合はそれを使用
      if (req.responseJSON) {
        d.reject(req.responseJSON, req.status);
        return;
      }
      // responseJSONがない場合もエラーオブジェクトを作成
      var errorData = { has_error: true, message: error || status };
      d.reject(errorData, req.status);
    });
  } else {
    //AngularJSのhttpオブジェクトを想定。
    var header_map = {};
    headers.forEach(function(header) {
      if (header[0] === 'host') {
        return;
      }
      header_map[header[0]] = header[1];
    });

    http({
      url: url,
      method: 'POST',
      data: apiData,
      headers: header_map
    }).success(function(data, status) {
      onSuccess(data, status);
    }).error(function(data, status, headers, config) {
      // HTTPエラーの場合
      if (data && typeof data === 'object') {
        d.reject(data, status);
        return;
      }
      // dataがない場合もエラーオブジェクトを作成
      var errorData = { has_error: true, message: data || 'Error' };
      d.reject(errorData, status);
    });
  }

  return d.promise();
};

Chikyu.Sdk.prototype.buildUrl = function(apiClass, apiPath, withHost) {
  if (withHost !== false) {
    withHost = true;
  }

  if (apiPath.indexOf('/') === 0) {
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

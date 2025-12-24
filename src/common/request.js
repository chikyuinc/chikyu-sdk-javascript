Chikyu.Sdk.prototype.invoke = function(apiClass, apiPath, apiData, headers, http) {
  if (!headers) {
    headers = [['Content-Type', 'application/json']];
  }

  var url = this.buildUrl(apiClass, apiPath);

  var processResponse = function(data) {
    // 既存API形式: { has_error: true/false, data: ... }
    if (data.has_error) {
      console.log('AJAX Error: ' + data.message);
      return Promise.reject(data);
    }
    // 新SFA API形式: { success: true/false, payload: ..., error_list: ... }
    if (data.success === false) {
      console.log('AJAX Error: ', data.error_list);
      return Promise.reject(data);
    }
    // 新API形式ならpayload、既存形式ならdata
    return data.payload !== undefined ? data.payload : data.data;
  };

  if (!http) {
    var headerObj = {};
    headers.forEach(function(header) {
      if (header[0] !== 'host') {
        headerObj[header[0]] = header[1];
      }
    });

    return fetch(url, {
      method: 'POST',
      headers: headerObj,
      body: JSON.stringify(apiData),
      cache: 'no-cache'
    })
    .then(function(response) {
      return response.json();
    })
    .then(processResponse);
  } else {
    // AngularJSのhttpオブジェクトを想定。
    return new Promise(function(resolve, reject) {
      var header_map = {};
      headers.forEach(function(header) {
        if (header[0] !== 'host') {
          header_map[header[0]] = header[1];
        }
      });

      http({
        url: url,
        method: 'POST',
        data: apiData,
        headers: header_map
      }).success(function(data) {
        try {
          var result = processResponse(data);
          if (result instanceof Promise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      }).error(function(data, status, headers, config) {
        reject(data);
      });
    });
  }
};

Chikyu.Sdk.prototype.buildUrl = function(apiClass, apiPath, withHost) {
  if (withHost !== false) {
    withHost = true;
  }

  if (apiPath.indexOf('/') === 0) {
    apiPath = apiPath.substr(1);
  }

  var envName = this.config.envName();
  var path;
  if (envName) {
    path = '/' + this.config.envName() + '/api/v2/' + apiClass + '/' + apiPath;
  } else {
    path = '/api/v2/' + apiClass + '/' + apiPath;
  }

  if (withHost) {
    return this.config.protocol() + '://' + this.config.host() + path;
  } else {
    return path;
  }
};

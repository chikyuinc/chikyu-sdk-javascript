Chikyu.Sdk.prototype.invoke = function(apiClass, apiPath, apiData, headers, http, method) {
  if (!headers) {
    headers = [['Content-Type', 'application/json']];
  }
  if (!method) {
    method = 'POST';
  }

  var url = this.buildUrl(apiClass, apiPath);

  var processResponse = function(data) {
    // dataがnull/undefinedの場合のエラーハンドリング
    if (!data) {
      console.log('AJAX Error: Empty response');
      return Promise.reject({ message: 'Empty response', data: null });
    }
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

    var fetchOptions = {
      method: method,
      headers: headerObj,
      cache: 'no-cache'
    };

    // GET/DELETEの場合はbodyを含めない（DELETEはbodyを含める場合もある）
    if (method !== 'GET' && apiData !== null && apiData !== undefined) {
      fetchOptions.body = JSON.stringify(apiData);
    }

    return fetch(url, fetchOptions)
    .then(function(response) {
      if (!response.ok) {
        // 400番台・500番台のHTTPエラー
        return response.json().catch(function() {
          // JSONパースに失敗した場合
          return { message: response.statusText };
        }).then(function(data) {
          data.http_status = response.status;
          return Promise.reject(data);
        });
      }
      return response.json();
    })
    .then(processResponse);
  } else {
    // AngularJSのhttpオブジェクトを想定。
    return new Promise(function(resolve, reject) {
      var headerObjForAngularJs = {};
      headers.forEach(function(header) {
        if (header[0] !== 'host') {
          headerObjForAngularJs[header[0]] = header[1];
        }
      });

      var httpOptions = {
        url: url,
        method: method,
        headers: headerObjForAngularJs
      };

      if (method !== 'GET' && apiData !== null && apiData !== undefined) {
        httpOptions.data = apiData;
      }

      http(httpOptions).success(function(data) {
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

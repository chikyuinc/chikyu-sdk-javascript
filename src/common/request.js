Chikyu.Sdk.prototype.invoke = function(apiClass, apiPath, apiData, headers) {
  if (!headers) {
    headers = [['Content-Type', 'application/json']]
  }

  var url = this.buildUrl(apiClass, apiPath);
  var d = $.Deferred();

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
    if (data.has_error) {
      console.log('AJAX Error: ' + data.message);
      d.reject(data);
      return;
    }
    d.resolve(data.data);
  }).fail(function() {
    d.reject();
  })

  return d.promise();
};

Chikyu.Sdk.prototype.buildUrl = function(apiClass, apiPath, withHost) {
  if (withHost !== false) {
    withHost = true;
  }

  if (apiPath.indexOf('/') == 0) {
    apiPath = apiPath.substr(1);
  }

  var path = '/' + this.config.envName() + '/api/v2/' + apiClass + '/' + apiPath;

  if (withHost) {
    return this.config.protocol() + '://' + this.config.host() + path;
  } else {
    return path;
  }
}

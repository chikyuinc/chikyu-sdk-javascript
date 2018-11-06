var POST = "POST";
var AWS4 = "AWS4";
var AWS4_HMAC_SHA256 = "AWS4-HMAC-SHA256";
var AWS4_REQUEST = "aws4_request";

Chikyu.Sdk.prototype.getSignedHeaders = function(path, payload) {

  var now = getNow(this);
  var currentTime = getCurrentTime(now, true);
  var currentDate = getCurrentTime(now, false);

  var headers = [];
  headers.push(['content-type', 'application/json']);
  headers.push(['host', this.config.host()]);
  headers.push(['x-amz-date', currentTime]);
  headers.push(['x-amz-security-token', this.session.credentials.SessionToken]);
  headers.push(['x-api-key', this.session.apiKey]);

  var authorization =
        getAuthorizationHeader(path, payload, headers, currentDate, currentTime, this);

  headers.push(['Authorization', authorization]);

  return headers;
};

var getAuthorizationHeader = function(path, payload, headers, currentDate, currentTime, chikyu) {
  var headerNames = getHeaderNamesToSign(headers);
  var canonicalUrl = getCanonicalUrl(path, payload, headerNames, headers);

  var serviceDescription = getServiceDescription(currentDate, chikyu);
  var textToSign =
      getTextToSign(canonicalUrl, serviceDescription, currentTime, currentDate);

  var signature = getSignature(textToSign, currentDate, chikyu);

  return createAuthorizationHeader(
    headerNames, serviceDescription, signature, currentTime, chikyu
  );
}

var getHeaderNamesToSign = function(headers)  {
  var res = ""; var idx = 0;
  headers.forEach(function(item) {
    if (idx++ > 0) {
      res += ';';
    }
    res += item[0];
  });
  return res;
};

var getCanonicalUrl = function(path, payload, headerNames, headers) {
  var res = POST + "\n";
  res += path + "\n\n";

  headers.forEach(function(item) {
    res += item[0] + ":" + item[1] + "\n";
  });
  res += "\n";

  res += headerNames + "\n";
  res += getSha256(payload);

  return res;
};

var getServiceDescription = function(currentDate, c) {
  return currentDate + "/" +
          c.config.awsRegion() + "/" +
          c.config.awsApiGwServiceName() + "/" +
          AWS4_REQUEST;
};

var getTextToSign = function(canonicalUrl, serviceDescription, currentTime, currentDate) {
  return AWS4_HMAC_SHA256 + "\n" +
          currentTime + "\n" +
          serviceDescription + "\n" +
          getSha256(canonicalUrl);
};

var getSignature = function(textToSign, currentDate, c) {
  var key = getSignatureKey(c.session.credentials.SecretAccessKey, currentDate, c);
  return getHmacSha256(key, textToSign);
};

var getSignatureKey = function(key, currentDate, c) {
  var secret1 = AWS4 + key;
  var secret2 = getHmacSha256(secret1, currentDate, true);
  var secret3 = getHmacSha256(secret2, c.config.awsRegion(), true);
  var secret4 = getHmacSha256(secret3, c.config.awsApiGwServiceName(), true);
  return getHmacSha256(secret4, AWS4_REQUEST, true);
}

var createAuthorizationHeader = function(headerNames, serviceDescription, signature, currentTime, c) {
  return AWS4_HMAC_SHA256 + " " +
          "Credential=" + c.session.credentials.AccessKeyId + "/" + serviceDescription + "," +
          "SignedHeaders=" + headerNames + "," +
          "Signature=" + signature;
}

var getNow = function(c) {
  var o = 0;
  try {
    o = parseInt(c.session.offset);
  } catch (e) {

  }

  if (c.session.offset) {
    return new Date().getTime() + c.session.offset;
  } else {
    return new Date().getTime();
  }
};

var getCurrentTime = function(now, withTime) {
  if (withTime !== false) {
    withTime = true;
  }

  var d = new Date();
  d.setTime(now);

  var s = function(i) {
    if (i < 10) {
      return '0' + i;
    } else {
      return '' + i;
    }
  }

  if (withTime) {
    return s(d.getUTCFullYear()) + s((d.getUTCMonth() + 1)) + s(d.getUTCDate()) + 'T' +
           s(d.getUTCHours()) + s(d.getUTCMinutes()) + s(d.getUTCSeconds()) + 'Z';
  } else {
    return s(d.getUTCFullYear()) + s((d.getUTCMonth() + 1)) + s(d.getUTCDate());
  }
};

var getSha256 = function(text) {
  return sha256.update(text).hex();
};

var getHmacSha256 = function(key, text, isRaw) {
  var hmac = sha256.hmac.update(key, text);
  if (isRaw) {
    return hmac.array();
  } else {
    return hmac.hex();
  }
};

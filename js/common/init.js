Chikyu.prototype.init = function() {
  this.params = {};
  var startTime = new Date().getTime();
  var that = this;
  return $.get("https://ntp-a1.nict.go.jp/cgi-bin/json").done(function(data) {
    var st = data.st * 1000;
    that.params.offset = st - startTime;
  }).fail(function() {
    console.log("Initialization Error.");
  });
};

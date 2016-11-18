var cryptoJS = require('../lib/aes');

var decryptData = function (req, res, next) {
  var decrypted  = cryptoJS.AES.decrypt(req.body.data, req.body.timeStamp);
  var dataString = decrypted.toString(cryptoJS.enc.Utf8);
  req.body = JSON.parse(dataString);
  next();
};

module.exports = decryptData;
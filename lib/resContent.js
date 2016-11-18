var cryptoJS = require('../lib/aes');

var resContent = function (success, message, errors, data) {
  var timeStamp = new Date().toLocaleString();
  var dataEncrypted = data;

  if (data) {
    var dataString = JSON.stringify(data);
    var encrypted  = cryptoJS.AES.encrypt(dataString, timeStamp);
    dataEncrypted = encrypted.toString();
  }

  return {
    success: success,
    message: message,
    errors: errors,
    data: dataEncrypted,
    timeStamp: timeStamp
  }
};

module.exports = resContent;
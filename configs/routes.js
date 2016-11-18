var users = require('../apis/users');

var routes = function (app) {
  app.post('/authenticate', users.authenticate);
  app.post('/register', users.register);
  app.get('/hihi', users.hihi)
};

module.exports.draw = routes;
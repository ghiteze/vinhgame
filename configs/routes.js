var users = require('../apis/users');
var profiles = require('../apis/profiles');

var routes = function (app) {
  app.post('/authenticate', users.authenticate);
  app.post('/register', users.register);
  app.use(users.verify);
  app.get('/hihi', users.hihi);
  app.get('/profile/', profiles.show);
  app.get('/profile/:userId', profiles.show);
};

module.exports.draw = routes;
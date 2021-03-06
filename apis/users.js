var errorMsg = require('../config/errorMsg');
var resContent = require('../lib/resContent');
var User = require('../models/user');
var Profile = require('../models/profile');


var usersApi = {
  verify: function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      User.verifyToken(token, function (error, decoded) {
        if (error) {
          return res.status(500).json({
            success: false,
            messages: ['Failed  to authenticate token.']
          });
        }
        next();
      });
    }
    else {
      return res.status(500).json({
        success: false,
        messages: ['No token provided.']
      });
    }
  },

  authenticate: function (req, res) {
    var credentials = req.body.user;

    req.assert('user.userNameOrEmail', errorMsg.user.userNameOrEmail.required).notEmpty();
    req.assert('user.password', errorMsg.user.password.required).notEmpty();
    req.assert('user.password', errorMsg.user.password.length).len(6);

    var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      for (var i in errors) {
        messages.push(errors[i].msg);
      }
      return res.status(500).json({
        success: false,
        messages: messages
      });
    }

    User.authenticate(credentials, function (error, user, success) {
      if (error) {
        return res.status(500).json({
          success: false,
          messages: ['Authentication failed.']
        });
      }
      if (user) {
        if (success) {
          user.genToken(function (error, token) {
            if (error) {
              return res.status(500).json({
                success: false,
                messages: ['Failed.']
              });
            }
            return res.json({
              success: true,
              messages: ['Successful authentication.'],
              token: token });
          });
        }
        else {
          return res.status(500).json({
            success: false,
            messages: ['Password does not match.']
          });
        }
      }
      else {
        return res.status(500).json({
          success: false,
          messages: ['Username or email does not match.']
        });
      }
    });
  },


  register: function (req, res) {
    var credentials = req.body.user;

    req.assert('user.userName', errorMsg.user.userName.required).notEmpty();
    req.assert('user.email', errorMsg.user.email.required).notEmpty();
    req.assert('user.email', errorMsg.user.email.invalid).isEmail();
    req.assert('user.password', errorMsg.user.password.required).notEmpty();
    req.assert('user.password', errorMsg.user.password.length).len(6);
    req.assert('user.password', errorMsg.user.password.confirm).equals(credentials.passwordConfirm);

    var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      for (var i in errors) {
        messages.push(errors[i].msg);
      }
      return res.status(500).json({
        success: false,
        messages: messages
      });
    }

    User.isUserExists(credentials, function (error, isUser) {
      if (error) {
        return res.status(500).json({
          success: false,
          messages: ['Registration failed.']
        });
      }
      if (isUser) {
        return res.json({
          success: false,
          messages: ['Username or email is already taken.']
        });
      }
      else {
        var user, profile;
        user = new User(credentials);
        user.createUser(function (error) {
          if (error) {
            return res.status(500).json({
              success: false,
              messages: ['Registration failed.']
            });
          }
          profile = new Profile({ userId: user._id, userName: user.userName });
          profile.save(function (error) {
            if (error) {
              user.remove(function (error) {});
              return res.status(500).json({
                success: false,
                messages: ['Registration failed.']
              });
            }
            return res.json({
              success: true,
              messages: ['Successful registration.']
            });
          });
        });
      }
    });
  },

  hihi: function (req, res) {
    return res.json({
      success: true,
      messages: ['ahihi']
    });
  }
};

module.exports = usersApi;

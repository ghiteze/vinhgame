var jwt = require('jsonwebtoken');
var errorMsg = require('../configs/errorMsg');
var resContent = require('../lib/resContent');
var User = require('../models/user');

var usersApi = {
  authenticate: function (req, res) {
    var user = req.body;

    req.assert('usernameOrEmail', errorMsg.user.usernameOrEmail.required).notEmpty();
    req.assert('password', errorMsg.user.password.required).notEmpty();
    req.assert('password', errorMsg.user.password.length).isLength({ min: 6, max: 255 });

    var errors = req.validationErrors();
    if (errors) {
      return res.status(500).json(
        resContent(false, 'Validation failed', errors, null)
      );
    }

    User.authenticate(user.usernameOrEmail, user.password, function (error, data) {
      if (error) {
        return res.status(500).json(
          resContent(false, 'Authentication failed', [{ msg: 'Username or password is incorrect' }], null)
        );
      }
      else {
        var newData = {};
        newData.username = data.username;
        newData.email = data.email;
        newData.avatar = data.avatar;
        newData.token = jwt.sign(data, 'mYsEcReT', {
          expiresIn: '1m'
        });
        return res.json(
          resContent(true, 'Successful authentication', null, newData)
        );
      }
    });
  },


  register: function (req, res) {
    var user = req.body;

    req.assert('username', errorMsg.user.username.required).notEmpty();
    req.assert('email', errorMsg.user.email.required).notEmpty();
    req.assert('email', errorMsg.user.email.invalid).isEmail();
    req.assert('password', errorMsg.user.password.required).notEmpty();
    req.assert('password', errorMsg.user.password.length).isLength({ min: 6, max: 255 });
    req.assert('password', errorMsg.user.password.confirm).equals(user.passwordConfirm);

    var errors = req.validationErrors();
    if (errors) {
      return res.status(500).json(
        resContent(false, 'Validation failed', errors, null)
      );
    }

    var newUser = new User(user);
    newUser.encryptPassword(user.password);
    newUser.save(function (error) {
      if (error) {
        return res.status(500).json(
          resContent(false, 'Create user failed', error, null)
        );
      }
      return res.json(
        resContent(true, 'User created successfully', null, null)
      );
    });
  },

  hihi: function (req, res) {
    res.json({ success: true });
  }
};

module.exports = usersApi;
var jwt = require('jsonwebtoken');
var Profile = require('../models/profile');

var profilesApi = {
  show: function (req, res) {
    var onlyMe  = false;
    var userId  = req.params.userId;
    var token   = req.body.token || req.query.token || req.headers['x-access-token'];
    var payload = jwt.decode(token);

    onlyMe = (userId == payload.id) ? true : false;

    Profile.findBy(userId, onlyMe, function (error, profile) {
      if (error) {
        return res.status(500).json({
          success: false,
          messages: ['Failed get user profile.']
        });
      }
      return res.json({
        success: true,
        messages: ['Get user profile success.'],
        profile: profile
      });
    });
  }
}

module.exports = profilesApi;

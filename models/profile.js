var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
  userId: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    default: ''
  },
  userName: { // only me
    type: String
  },
  email: { // only me
    type: String,
    default: ''
  },
  phoneNumber: { // only me
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'images/noAvatar.jpg'
  },
  chip: {
    type: Number,
    default: 0
  },
  gold: {
    type: Number,
    default: 0
  },
  silver: {
    type: Number,
    default: 0
  }
});

profileSchema.statics.findBy = function (userId, onlyMe, done) {
  var select = 'fullName avatar chip gold silver';
  if (onlyMe) {
    select = 'userId fullName userName email phoneNumber avatar chip gold silver';
  }

  Profile.findOne({ userId: userId }, select, function (error, profile) {
    if (error) {
      return done('error');
    }
    done(null, profile);
  });
};

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

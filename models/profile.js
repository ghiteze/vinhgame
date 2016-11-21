var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
  parentId: {
    type: String,
    unique: true
  },
  fullName: {
    type: String
  },
  userName: { // only me
    type: String
  },
  email: { // only me
    type: String
  },
  phoneNumber: { // only me
    type: String
  },
  avatar: {
    type: String,
    default: 'images/noAvatar.jpg'
  },
  chip: {
    type: Number
  },
  gold: {
    type: Number
  },
  silver: {
    type: Number
  }
});

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

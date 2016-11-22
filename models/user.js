var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var redis = require('redis');
var client = redis.createClient();
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
});

userSchema.methods.encryptPassword = function (password, done) {
  var user = this;
  bcrypt.genSalt(8, function (error, salt) {
    if (error) {
      return done('error');
    }
    bcrypt.hash(password, salt, function (error, hash) {
      if (error) {
        return done('error');
      }
      user.password = hash;
      done();
    });
  });
  return;
};

userSchema.methods.checkPassword = function (password, done) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return done('error');
    }
    done(null, isMatch);
  })
  return;
};

userSchema.statics.authenticate = function (credentials, done) {
  var query = {
    $or: [
      { userName: credentials.userNameOrEmail },
      { email: credentials.userNameOrEmail }
    ]
  };
  User.findOne(query, '_id password', function (error, user) {
    if (error) {
      return done('error');
    }
    if (user) {
      user.checkPassword(credentials.password, function (error, success) {
        if (error) {
          return done('error');
        }
        done(null, user, success);
      });
    }
    else {
      done(null, null);
    }
    return;
  });
};

userSchema.statics.isUserExists = function (credentials, done) {
  var query = {
    $or: [
      { userName: credentials.userName },
      { email: credentials.email }
    ]
  };
  User.findOne(query, 'userName email', function (error, user) {
    if (error) {
      return done('error');
    }
    done(null, user);
  });
  return;
};

userSchema.methods.createUser = function (done) {
  var user = this;
  user.encryptPassword(user.password, function (error) {
    if (error) {
      return done('error');
    }
    user.save(function (error) {
      if (error) {
        return done('error');
      }
      done();
    });
  });
  return;
};


userSchema.methods.genToken = function (done) {
  var userId = this._id.toString();

  client.get(userId, function (error, reply) {
    var payload = { id: userId };
    var secret  = 'mYsEcReT';
    var expire  = { expiresIn: '30m' };
    var token   = jwt.sign(payload, secret, expire);

    if (error) {
      return done('error');
    }
    client.set(userId, token, function (error, reply) {
      if (error) {
        return done('error');
      }
      done(null, token);
    });
  });
  return;
};

userSchema.statics.verifyToken = function (token, done) {
  var payload = jwt.decode(token);

  if (payload && payload.id) {
    var userId = payload.id;

    client.get(userId, function (error, reply) {
      if (error) {
        return done('error');
      }
      if (reply == token) {
        jwt.verify(token, 'mYsEcReT', function (error, decoded) {
          if (error && error.name == 'TokenExpiredError' && error.message == 'jwt expired') {
            client.del(userId);
            return done('error');
          }
          done(null, decoded);
        })
      }
      else {
        return done('error');
      }
    });
  }
  else {
    return done('error');
  }
};


var User = mongoose.model('User', userSchema);

module.exports = User;

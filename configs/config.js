var config = {};

config.DB_URI = process.env.MONGODB_URI || 'mongodb://heroku_bxjd6pp5:uis2547a0l0uuvgukqsh3e5hvp@ds153677.mlab.com:53677/heroku_bxjd6pp5';

config.SESSION = {
  SECRET: 'MySessionSecret',
  MAX_AGE: 1000 * 60 * 60 * 24
};

config.TOKEN = {
  SECRET: 'MyTokenSecret'
};

config.PORT = process.env.PORT || 3000;

module.exports = config;

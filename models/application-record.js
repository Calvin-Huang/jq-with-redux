const Sequelize = require('sequelize');
const config = process.env.DATABASE_URL || require('../config/config')[process.env.NODE_ENV || 'development'];

config.define = {
  underscored: true,
};

module.exports = new Sequelize(config);

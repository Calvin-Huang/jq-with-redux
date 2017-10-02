const Sequelize = require('sequelize');
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  module.exports = new Sequelize(databaseUrl, { underscored: true }); 
} else {
  const config = require('../config/config')[process.env.NODE_ENV || 'development'];

  config.define = {
    underscored: true,
  };

  module.exports = new Sequelize(config);
}

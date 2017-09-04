const Sequelize = require('sequelize');
const ApplicationRecord = require('./application-record');

module.exports = ApplicationRecord.define('bookmark', {
  repo_id: Sequelize.INTEGER,
  full_name: Sequelize.STRING,
}, {});

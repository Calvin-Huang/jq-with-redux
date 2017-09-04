const Sequelize = require('sequelize');
const ApplicationRecord = require('./application-record');

module.exports = ApplicationRecord.define('bookmark', {
  repo_id: Sequelize.STRING,
  full_name: Sequelize.STRING,
}, {});

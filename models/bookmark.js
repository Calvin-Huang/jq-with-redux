const Sequelize = require('sequelize');
const ApplicationRecord = require('./application-record');

module.exports = ApplicationRecord.define('bookmark', {
  repo_id: DataTypes.STRING,
}, {});

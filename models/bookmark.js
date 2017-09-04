const Sequelize = require('sequelize');
const ApplicationRecord = require('./application-record');

module.exports = ApplicationRecord.define('bookmark', {
  repoId: Sequelize.INTEGER,
  fullName: Sequelize.STRING,
}, {});

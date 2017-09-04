const Sequelize = require('sequelize');
const ApplicationRecord = require('./application-record');

module.exports = ApplicationRecord.define('bookmark', {
  repo_id: {
    type: Sequelize.INTEGER,
    unique: true,
  },
  full_name: Sequelize.STRING,
}, {});

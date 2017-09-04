'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('bookmarks', 'full_name', { type: Sequelize.STRING, allowNull: true });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('bookmarks', 'full_name');
  }
};

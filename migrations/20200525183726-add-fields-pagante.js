"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Pagantes", "email", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Pagantes", "box", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Pagantes", "telefone", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("Pagantes", "email"),
      queryInterface.removeColumn("Pagantes", "box"),
      queryInterface.removeColumn("Pagantes", "telefone"),
    ]);
  },
};

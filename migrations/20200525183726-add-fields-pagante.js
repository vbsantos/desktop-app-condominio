"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("pagantes", "email", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("pagantes", "box", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("pagantes", "telefone", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("pagantes", "email"),
      queryInterface.removeColumn("pagantes", "box"),
      queryInterface.removeColumn("pagantes", "telefone"),
    ]);
  },
};

"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("beneficiarios", "email", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("beneficiarios", "telefone", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("beneficiarios", "email"),
      queryInterface.removeColumn("beneficiarios", "telefone"),
    ]);
  },
};

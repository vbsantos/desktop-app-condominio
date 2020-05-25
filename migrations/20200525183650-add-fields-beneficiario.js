"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Beneficiarios", "email", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Beneficiarios", "endereco", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Beneficiarios", "telefone", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("Beneficiarios", "email"),
      queryInterface.removeColumn("Beneficiarios", "endereco"),
      queryInterface.removeColumn("Beneficiarios", "telefone"),
    ]);
  },
};

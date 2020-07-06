"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("beneficiarios", "nome", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("beneficiarios", "nome", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};

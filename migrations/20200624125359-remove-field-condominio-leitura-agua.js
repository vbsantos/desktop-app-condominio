"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("condominios", "leituraAgua");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("condominios", "leituraAgua", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 0,
    });
  },
};

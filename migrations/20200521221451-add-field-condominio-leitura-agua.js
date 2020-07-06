"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("condominios", "leituraAgua", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "0",
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("condominios", "leituraAgua");
  },
};

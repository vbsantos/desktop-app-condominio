"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("despesas", "ativa", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("despesas", "ativa");
  },
};

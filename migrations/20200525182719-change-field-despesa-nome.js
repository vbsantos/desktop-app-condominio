"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("despesas", "nome", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("despesas", "nome", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};

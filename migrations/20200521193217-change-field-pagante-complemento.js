"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("pagantes", "complemento", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("pagantes", "complemento", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};

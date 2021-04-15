"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("pagantes", "carros", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("pagantes", "animais", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("pagantes", "carros"),
      queryInterface.removeColumn("pagantes", "animais"),
    ]);
  },
};

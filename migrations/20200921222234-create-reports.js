"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      condominioId: {
        type: Sequelize.INTEGER,
      },

      month: {
        type: Sequelize.STRING,
      },

      rgId: {
        type: Sequelize.INTEGER,
      },
      rgValue: {
        type: Sequelize.STRING,
      },

      rrId: {
        type: Sequelize.INTEGER,
      },
      rrValue: {
        type: Sequelize.STRING,
      },

      rfrId: {
        type: Sequelize.INTEGER,
      },
      rfrValue: {
        type: Sequelize.STRING,
      },
      rfrValues: {
        type: Sequelize.STRING,
      },

      raId: {
        type: Sequelize.INTEGER,
      },
      raValue: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Reports");
  },
};

"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Boletos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emissao: {
        type: Sequelize.STRING
      },
      vencimento: {
        type: Sequelize.STRING
      },
      documento: {
        type: Sequelize.STRING
      },
      numero: {
        type: Sequelize.STRING
      },
      titulo: {
        type: Sequelize.STRING
      },
      valor: {
        type: Sequelize.STRING
      },
      paganteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: "Pagantes",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Boletos");
  }
};

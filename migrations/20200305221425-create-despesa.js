"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Despesas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      categoria: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      valor: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      parcelaAtual: {
        type: Sequelize.STRING,
      },
      numParcelas: {
        type: Sequelize.STRING,
      },
      rateioAutomatico: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      permanente: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      aguaIndividual: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      fundoReserva: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      condominioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Condominios",
          key: "id",
        },
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
    return queryInterface.dropTable("Despesas");
  },
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const Conta = sequelize.define(
    "Conta",
    {
      nome: DataTypes.STRING,
      valor: DataTypes.STRING,
      rateioAutomatico: DataTypes.BOOLEAN,
      permanente: DataTypes.BOOLEAN,
      condominioId: DataTypes.INTEGER
    },
    {}
  );
  Conta.associate = function(models) {
    // associations can be defined here
    Conta.belongsTo(models.Condominio, {
      foreignKey: "condominioId"
    });
  };
  return Conta;
};

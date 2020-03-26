"use strict";
module.exports = (sequelize, DataTypes) => {
  const Valor = sequelize.define(
    "Valor",
    {
      precoAgua: DataTypes.STRING,
      agua: DataTypes.STRING,
      valor: DataTypes.STRING,
      despesaId: DataTypes.INTEGER,
      paganteId: DataTypes.INTEGER
    },
    {}
  );
  Valor.associate = function(models) {
    // associations can be defined here
    Valor.belongsTo(models.Despesa, {
      foreignKey: "despesaId"
    });
  };
  return Valor;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const Boleto = sequelize.define(
    "Boleto",
    {
      emissao: DataTypes.STRING,
      vencimento: DataTypes.STRING,
      documento: DataTypes.STRING,
      numero: DataTypes.STRING,
      titulo: DataTypes.STRING,
      valor: DataTypes.STRING,
      paganteId: DataTypes.INTEGER
    },
    {}
  );
  Boleto.associate = function(models) {
    // associations can be defined here
    Boleto.belongsTo(models.Pagante, {
      foreignKey: "paganteId"
    });
  };
  return Boleto;
};

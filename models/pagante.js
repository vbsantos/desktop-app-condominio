"use strict";
module.exports = (sequelize, DataTypes) => {
  const Pagante = sequelize.define(
    "Pagante",
    {
      nome: DataTypes.STRING,
      cprf: DataTypes.STRING,
      complemento: DataTypes.STRING,
      fracao: DataTypes.STRING,
      email: DataTypes.STRING,
      leituraAgua: DataTypes.STRING,
      condominioId: DataTypes.INTEGER
    },
    {}
  );
  Pagante.associate = function(models) {
    // associations can be defined here
    Pagante.belongsTo(models.Condominio, {
      foreignKey: "condominioId"
    });
    Pagante.hasMany(models.Boleto);
  };
  return Pagante;
};

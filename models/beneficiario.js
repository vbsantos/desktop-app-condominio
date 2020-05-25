"use strict";
module.exports = (sequelize, DataTypes) => {
  const Beneficiario = sequelize.define(
    "Beneficiario",
    {
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      endereco: DataTypes.STRING,
      telefone: DataTypes.STRING,
    },
    {}
  );
  Beneficiario.associate = function (models) {
    // associations can be defined here
    Beneficiario.hasMany(models.Condominio);
  };
  return Beneficiario;
};

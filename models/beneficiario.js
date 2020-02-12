"use strict";
module.exports = (sequelize, DataTypes) => {
  const Beneficiario = sequelize.define(
    "Beneficiario",
    {
      nome: DataTypes.STRING,
      cprf: DataTypes.STRING,
      token_acesso: DataTypes.STRING,
      token_conta: DataTypes.STRING,
      cep: DataTypes.STRING,
      uf: DataTypes.STRING,
      localidade: DataTypes.STRING,
      bairro: DataTypes.STRING,
      logradouro: DataTypes.STRING,
      numero: DataTypes.STRING,
      complemento: DataTypes.STRING
    },
    {}
  );
  Beneficiario.associate = function(models) {
    // associations can be defined here
    Beneficiario.hasMany(models.Condominio);
  };
  return Beneficiario;
};

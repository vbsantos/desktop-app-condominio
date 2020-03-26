"use strict";
module.exports = (sequelize, DataTypes) => {
  const Condominio = sequelize.define(
    "Condominio",
    {
      nome: DataTypes.STRING,
      cep: DataTypes.STRING,
      uf: DataTypes.STRING,
      localidade: DataTypes.STRING,
      bairro: DataTypes.STRING,
      logradouro: DataTypes.STRING,
      numero: DataTypes.STRING,
      beneficiarioId: DataTypes.INTEGER
    },
    {}
  );
  Condominio.associate = function(models) {
    // associations can be defined here
    Condominio.hasMany(models.Pagante);
    Condominio.hasMany(models.Despesa);
    // Condominio.hasMany(models.GeneralReport);

    Condominio.belongsTo(models.Beneficiario, {
      foreignKey: "beneficiarioId"
    });
  };
  return Condominio;
};

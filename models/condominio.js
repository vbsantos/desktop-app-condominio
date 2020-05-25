"use strict";
module.exports = (sequelize, DataTypes) => {
  const Condominio = sequelize.define(
    "Condominio",
    {
      nome: DataTypes.STRING,
      beneficiarioId: DataTypes.INTEGER,
      leituraAgua: DataTypes.STRING,
      endereco: DataTypes.STRING,
    },
    {}
  );
  Condominio.associate = function (models) {
    // associations can be defined here
    Condominio.hasMany(models.Pagante);
    Condominio.hasMany(models.Despesa);
    // Condominio.hasMany(models.GeneralReport);

    Condominio.belongsTo(models.Beneficiario, {
      foreignKey: "beneficiarioId",
    });
  };
  return Condominio;
};

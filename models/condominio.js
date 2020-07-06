"use strict";
module.exports = (sequelize, DataTypes) => {
  const Condominio = sequelize.define(
    "Condominio",
    {
      nome: DataTypes.STRING,
      beneficiarioId: DataTypes.INTEGER,
      endereco: DataTypes.STRING,
    },
    {}
  );
  Condominio.associate = function (models) {
    Condominio.hasMany(models.Pagante);
    Condominio.hasMany(models.Despesa);
    Condominio.belongsTo(models.Beneficiario, {
      foreignKey: "beneficiarioId",
    });
  };
  return Condominio;
};

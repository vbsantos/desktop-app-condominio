"use strict";
module.exports = (sequelize, DataTypes) => {
  const Pagante = sequelize.define(
    "Pagante",
    {
      nome: DataTypes.STRING,
      complemento: DataTypes.STRING,
      fracao: DataTypes.STRING,
      leituraAgua: DataTypes.STRING,
      email: DataTypes.STRING,
      box: DataTypes.STRING,
      telefone: DataTypes.STRING,
      condominioId: DataTypes.INTEGER,
    },
    {}
  );
  Pagante.associate = function (models) {
    // associations can be defined here
    // Pagante.hasMany(models.IndividualReport);

    Pagante.belongsTo(models.Condominio, {
      foreignKey: "condominioId",
    });
  };
  return Pagante;
};

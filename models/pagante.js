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
      unidadeComercial: DataTypes.BOOLEAN,
      condominioId: DataTypes.INTEGER,
      carros: DataTypes.STRING,
      animais: DataTypes.STRING,
    },
    {}
  );
  Pagante.associate = function (models) {
    Pagante.belongsTo(models.Condominio, {
      foreignKey: "condominioId",
    });
  };
  return Pagante;
};

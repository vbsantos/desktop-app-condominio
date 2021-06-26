"use strict";
module.exports = (sequelize, DataTypes) => {
  const Despesa = sequelize.define(
    "Despesa",
    {
      nome: DataTypes.STRING,
      categoria: DataTypes.STRING,
      valor: DataTypes.STRING,
      parcelaAtual: DataTypes.STRING,
      numParcelas: DataTypes.STRING,
      rateioAutomatico: DataTypes.BOOLEAN,
      permanente: DataTypes.BOOLEAN,
      aguaIndividual: DataTypes.BOOLEAN,
      fundoReserva: DataTypes.BOOLEAN,
      agua: DataTypes.STRING,
      informacao: DataTypes.BOOLEAN,
      ativa: DataTypes.BOOLEAN,
      condominioId: DataTypes.INTEGER,
      chamadaExtra: DataTypes.BOOLEAN,
    },
    {}
  );
  Despesa.associate = function (models) {
    // associations can be defined here
    Despesa.hasMany(models.Valor);
    Despesa.belongsTo(models.Condominio, {
      foreignKey: "condominioId",
    });
  };
  return Despesa;
};

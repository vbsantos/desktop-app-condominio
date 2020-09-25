"use strict";
module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    "Reports",
    {
      condominioId: DataTypes.INTEGER,

      month: DataTypes.STRING,

      rgId: DataTypes.INTEGER,
      rgValue: DataTypes.STRING,

      rrId: DataTypes.INTEGER,
      rrValue: DataTypes.STRING,

      rfrId: DataTypes.INTEGER,
      rfrValue: DataTypes.STRING,

      rfrValues: DataTypes.STRING,

      raId: DataTypes.INTEGER,
      raValue: DataTypes.STRING,
    },
    {}
  );
  Reports.associate = function (models) {};
  return Reports;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const WaterReport = sequelize.define(
    "WaterReport",
    {
      report: DataTypes.STRING,
      condominioId: DataTypes.INTEGER,
    },
    {}
  );
  WaterReport.associate = function (models) {
    // associations can be defined here
  };
  return WaterReport;
};

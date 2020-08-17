"use strict";
module.exports = (sequelize, DataTypes) => {
  const ReserveFundReport = sequelize.define(
    "ReserveFundReport",
    {
      report: DataTypes.STRING,
      condominioId: DataTypes.INTEGER,
    },
    {}
  );
  ReserveFundReport.associate = function (models) {
    // associations can be defined here
  };
  return ReserveFundReport;
};

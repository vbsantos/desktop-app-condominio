"use strict";
module.exports = (sequelize, DataTypes) => {
  const IndividualReport = sequelize.define(
    "IndividualReport",
    {
      report: DataTypes.STRING,
      paganteId: DataTypes.INTEGER,
      geracaoId: DataTypes.INTEGER,
    },
    {}
  );
  IndividualReport.associate = function (models) {};
  return IndividualReport;
};

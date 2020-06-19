"use strict";
module.exports = (sequelize, DataTypes) => {
  const ApportionmentReport = sequelize.define(
    "ApportionmentReport",
    {
      report: DataTypes.STRING,
      condominioId: DataTypes.INTEGER,
    },
    {}
  );
  ApportionmentReport.associate = function (models) {
    // associations can be defined here
  };
  return ApportionmentReport;
};

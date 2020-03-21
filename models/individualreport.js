"use strict";
module.exports = (sequelize, DataTypes) => {
  const IndividualReport = sequelize.define(
    "IndividualReport",
    {
      report: DataTypes.STRING,
      paganteId: DataTypes.INTEGER
    },
    {}
  );
  IndividualReport.associate = function(models) {
    // associations can be defined here
    IndividualReport.belongsTo(models.Pagante, {
      foreignKey: "paganteId"
    });
  };
  return IndividualReport;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const GeneralReport = sequelize.define(
    "GeneralReport",
    {
      report: DataTypes.STRING,
      condominioId: DataTypes.INTEGER
    },
    {}
  );
  GeneralReport.associate = function(models) {
    // associations can be defined here
    // GeneralReport.belongsTo(models.Condominio, {
    //   foreignKey: "condominioId"
    // });
  };
  return GeneralReport;
};

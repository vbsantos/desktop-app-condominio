"use strict";

const { WaterReport } = require("../models");

class WaterReportController {
  create = async (data) => {
    const waterreport = await WaterReport.create(data);
    return waterreport.get();
  };
  index = async () => {
    const waterreports = await WaterReport.findAll();
    const response = waterreports.map((waterreport) => waterreport.get());
    return response;
  };
  indexByOwnerId = async (id) => {
    const waterreports = await WaterReport.findAll({
      where: {
        condominioId: id,
      },
    });
    const response = waterreports
      .map((waterreport) => waterreport.get())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return response;
  };
  show = async (id) => {
    const waterreport = await WaterReport.findOne({
      where: {
        id,
      },
    });
    return waterreport.get();
  };
  update = async (data) => {
    const waterreport = await WaterReport.update(data, {
      where: {
        id: data.id,
      },
    });
    return waterreport;
  };
  delete = async (id) => {
    const waterreport = await WaterReport.destroy({
      where: {
        id,
      },
    });
    return waterreport;
  };
}

module.exports = WaterReportController;

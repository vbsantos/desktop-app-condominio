"use strict";

const { GeneralReport } = require("../models");

class GeneralReportController {
  create = async data => {
    const generalreport = await GeneralReport.create(data);
    return generalreport.get();
  };
  index = async () => {
    const generalreports = await GeneralReport.findAll();
    const response = generalreports.map(generalreport => generalreport.get());
    return response;
  };
  indexByOwnerId = async id => {
    const generalreports = await GeneralReport.findAll({
      where: {
        condominioId: id
      }
    });
    const response = generalreports
      .map(generalreport => generalreport.get())
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    return response;
  };
  show = async id => {
    const generalreport = await GeneralReport.findOne({
      where: {
        id
      }
    });
    return generalreport.get();
  };
  update = async data => {
    const generalreport = await GeneralReport.update(data, {
      where: {
        id: data.id
      }
    });
    return generalreport;
  };
  delete = async id => {
    const generalreport = await GeneralReport.destroy({
      where: {
        id
      }
    });
    return generalreport;
  };
}

module.exports = GeneralReportController;

"use strict";

const { ApportionmentReport } = require("../models");

class ApportionmentReportController {
  create = async (data) => {
    const apportionmentreport = await ApportionmentReport.create(data);
    return apportionmentreport.get();
  };
  index = async () => {
    const apportionmentreports = await ApportionmentReport.findAll();
    const response = apportionmentreports.map((apportionmentreport) =>
      apportionmentreport.get()
    );
    return response;
  };
  indexByOwnerId = async (id) => {
    const apportionmentreports = await ApportionmentReport.findAll({
      where: {
        condominioId: id,
      },
    });
    const response = apportionmentreports
      .map((apportionmentreport) => apportionmentreport.get())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return response;
  };
  show = async (id) => {
    const apportionmentreport = await ApportionmentReport.findOne({
      where: {
        id,
      },
    });
    return apportionmentreport.get();
  };
  update = async (data) => {
    const apportionmentreport = await ApportionmentReport.update(data, {
      where: {
        id: data.id,
      },
    });
    return apportionmentreport;
  };
  delete = async (id) => {
    const apportionmentreport = await ApportionmentReport.destroy({
      where: {
        id,
      },
    });
    return apportionmentreport;
  };
}

module.exports = ApportionmentReportController;

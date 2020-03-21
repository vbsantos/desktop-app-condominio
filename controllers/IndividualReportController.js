"use strict";

const { IndividualReport } = require("../models");

class IndividualReportController {
  create = async data => {
    const individualreport = await IndividualReport.create(data);
    return individualreport.get();
  };
  index = async () => {
    const individualreports = await IndividualReport.findAll();
    const response = individualreports.map(individualreport =>
      individualreport.get()
    );
    return response;
  };
  show = async id => {
    const individualreport = await IndividualReport.findOne({
      where: {
        id
      }
    });
    return individualreport.get();
  };
  update = async data => {
    const individualreport = await IndividualReport.update(data, {
      where: {
        id: data.id
      }
    });
    return individualreport;
  };
  delete = async id => {
    const individualreport = await IndividualReport.destroy({
      where: {
        id
      }
    });
    return individualreport;
  };
}

module.exports = IndividualReportController;

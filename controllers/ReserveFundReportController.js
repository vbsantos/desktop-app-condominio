"use strict";

const { ReserveFundReport } = require("../models");

class ReserveFundReportController {
  create = async (data) => {
    const reservefundreport = await ReserveFundReport.create(data);
    return reservefundreport.get();
  };
  index = async () => {
    const reservefundreports = await ReserveFundReport.findAll();
    const response = reservefundreports.map((reservefundreport) =>
      reservefundreport.get()
    );
    return response;
  };
  indexByOwnerId = async (id) => {
    const reservefundreports = await ReserveFundReport.findAll({
      where: {
        condominioId: id,
      },
    });
    const response = reservefundreports
      .map((reservefundreport) => reservefundreport.get())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return response;
  };
  show = async (id) => {
    const reservefundreport = await ReserveFundReport.findOne({
      where: {
        id,
      },
    });
    return reservefundreport.get();
  };
  update = async (data) => {
    const reservefundreport = await ReserveFundReport.update(data, {
      where: {
        id: data.id,
      },
    });
    return reservefundreport;
  };
  delete = async (id) => {
    const reservefundreport = await ReserveFundReport.destroy({
      where: {
        id,
      },
    });
    return reservefundreport;
  };
}

module.exports = ReserveFundReportController;

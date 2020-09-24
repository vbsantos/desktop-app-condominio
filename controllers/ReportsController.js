"use strict";

const { Reports } = require("../models");

// REVIEW ReportsController
class ReportsController {
  create = async (data) => {
    const geracao = await Reports.create(data);
    return geracao.get();
  };
  getYears = async (id) => {
    const geracoes = await Reports.findAll({
      where: {
        id,
      },
    });
    const response = [
      ...new Set(geracoes.map((geracao) => geracao.get().month.split("/")[1])),
    ];
    return response;
  };
  getByYear = async (id, year) => {
    const geracoes = await Reports.findAll({
      where: {
        id,
      },
    });
    const response = geracoes
      .map((geracao) => geracao.get())
      .filter((geracao) => geracao.month.includes(year));
    return response;
  };
}

module.exports = ReportsController;

"use strict";

const { Reports } = require("../models");

// REVIEW ReportsController
class ReportsController {
  create = async (data) => {
    const geracao = await Reports.create(data);
    return geracao.get();
  };
}

module.exports = ReportsController;

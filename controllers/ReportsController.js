"use strict";

const { Reports } = require("../models");
const { GeneralReport } = require("../models");
const { IndividualReport } = require("../models");
const { WaterReport } = require("../models");
const { ApportionmentReport } = require("../models");
const { ReserveFundReport } = require("../models");

// REVIEW ReportsController
class ReportsController {
  create = async (data) => {
    const geracao = await Reports.create(data);
    return geracao.get();
  };
  getYears = async (condominioId) => {
    const geracoes = await Reports.findAll({
      where: {
        condominioId,
      },
    });
    const response = [
      ...new Set(geracoes.map((geracao) => geracao.get().month.split("/")[1])),
    ];
    return response;
  };
  getByYear = async (condominioId, year) => {
    const geracoes = await Reports.findAll({
      where: {
        condominioId,
      },
    });
    const response = geracoes
      .map((geracao) => geracao.get())
      .filter((geracao) => geracao.month.includes(year));
    return response;
  };
  deleteGeneration = async (generationId) => {
    try {
      const geracao = await Reports.findOne({
        where: {
          id: generationId,
        },
      });
      // deleta relatório geral -> rgId
      const GeneralReportTeste = await GeneralReport.destroy({
        where: {
          id: geracao.rgId,
        },
      });
      // deleta relatório rateio -> rrId
      const ApportionmentReportTeste = await ApportionmentReport.destroy({
        where: {
          id: geracao.rrId,
        },
      });
      // deleta relatório fundo reserva rfrId
      const ReserveFundReportTeste = await ReserveFundReport.destroy({
        where: {
          id: geracao.rfrId,
        },
      });
      // deleta relatório agua -> raId
      const WaterReportTeste = await WaterReport.destroy({
        where: {
          id: geracao.raId,
        },
      });
      // deleta relatorios Individuais -> id
      const ris = await IndividualReport.destroy({
        where: {
          geracaoId: generationId,
        },
      });
      // deleta o registro da geração
      geracao.destroy();
      return true;
    } catch (error) {
      console.error("ERRO:", error);
      return false;
    }
  };
}

module.exports = ReportsController;

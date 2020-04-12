"use strict";

const { Boleto } = require("../models");

class BoletoController {
  create = async (data) => {
    const boleto = await Boleto.create(data);
    return boleto.get();
  };
  index = async () => {
    const boletos = await Boleto.findAll();
    const response = boletos.map((boleto) => boleto.get());
    return response;
  };
  show = async (id) => {
    const boleto = await Boleto.findOne({
      where: {
        id,
      },
    });
    return boleto.get();
  };
  update = async (data) => {
    const boleto = await Boleto.update(data, {
      where: {
        id: data.id,
      },
    });
    return boleto;
  };
  delete = async (id) => {
    const boleto = await Boleto.destroy({
      where: {
        id,
      },
    });
    return boleto;
  };
}

module.exports = BoletoController;

"use strict";

const { Despesa } = require("../models");

class DespesaController {
  create = async data => {
    const despesa = await Despesa.create(data);
    return despesa.get();
  };
  index = async () => {
    const despesas = await Despesa.findAll();
    const response = despesas.map(despesa => despesa.get());
    return response;
  };
  show = async id => {
    const despesa = await Despesa.findOne({
      where: {
        id
      }
    });
    return despesa.get();
  };
  update = async data => {
    const despesa = await Despesa.update(data, {
      where: {
        id: data.id
      }
    });
    return despesa;
  };
  delete = async id => {
    const despesa = await Despesa.destroy({
      where: {
        id
      }
    });
    return despesa;
  };
}

module.exports = DespesaController;

"use strict";

const { Conta } = require("../models");

class ContaController {
  create = async data => {
    const conta = await Conta.create(data);
    return conta.get();
  };
  index = async () => {
    const contas = await Conta.findAll();
    const response = contas.map(conta => conta.get());
    return response;
  };
  show = async id => {
    const conta = await Conta.findOne({
      where: {
        id
      }
    });
    return conta.get();
  };
  update = async data => {
    const conta = await Conta.update(data, {
      where: {
        id: data.id
      }
    });
    return conta;
  };
  delete = async id => {
    const conta = await Conta.destroy({
      where: {
        id
      }
    });
    return conta;
  };
}

module.exports = ContaController;

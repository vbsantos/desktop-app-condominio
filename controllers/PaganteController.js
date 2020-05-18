"use strict";

const { Pagante } = require("../models");

class PaganteController {
  create = async (data) => {
    const pagante = await Pagante.create(data);
    return pagante.get();
  };
  index = async () => {
    const pagantes = await Pagante.findAll();
    const response = pagantes.map((pagante) => pagante.get());
    return response;
  };
  show = async (id) => {
    const pagante = await Pagante.findOne({
      where: {
        id,
      },
    });
    return pagante.get();
  };
  update = async (data) => {
    const pagante = await Pagante.update(data, {
      where: {
        id: data.id,
      },
    });
    return pagante;
  };
  delete = async (id) => {
    const pagante = await Pagante.destroy({
      where: {
        id,
      },
    });
    return pagante;
  };
}

module.exports = PaganteController;

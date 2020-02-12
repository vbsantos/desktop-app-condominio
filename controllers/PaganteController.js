"use strict";

const { Pagante } = require("../models");

class PaganteController {
  create = async data => {
    const pagante = await Pagante.create(data);
    return pagante;
  };
  index = async () => {
    const pagantes = await Pagante.findAll();
    return pagantes;
  };
  show = async id => {
    const pagante = await Pagante.findOne({
      where: {
        id
      }
    });
    return pagante;
  };
  update = async data => {
    const pagante = await Pagante.update(data, {
      where: {
        id: data.id
      }
    });
    return pagante;
  };
  delete = async id => {
    const pagante = await Pagante.destroy({
      where: {
        id
      }
    });
    return pagante;
  };
}

module.exports = PaganteController;

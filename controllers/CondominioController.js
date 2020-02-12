"use strict";

const { Condominio } = require("../models");

class CondominioController {
  create = async data => {
    const condominio = await Condominio.create(data);
    return condominio;
  };
  index = async () => {
    const condominios = await Condominio.findAll();
    return condominios;
  };
  show = async id => {
    const condominio = await Condominio.findOne({
      where: {
        id
      }
    });
    return condominio;
  };
  update = async data => {
    const condominio = await Condominio.update(data, {
      where: {
        id: data.id
      }
    });
    return condominio;
  };
  delete = async id => {
    const condominio = await Condominio.destroy({
      where: {
        id
      }
    });
    return condominio;
  };
}

module.exports = CondominioController;

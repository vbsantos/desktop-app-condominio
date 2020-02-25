"use strict";

const { Condominio } = require("../models");

class CondominioController {
  create = async data => {
    const condominio = await Condominio.create(data);
    return condominio.get();
  };
  index = async () => {
    const condominios = await Condominio.findAll();
    const response = condominios.map(condominio => condominio.get());
    return response;
  };
  indexbyBeneficiarioPk = async id => {
    const condominios = await Condominio.findAll({
      where: {
        beneficiarioId: id
      }
    });
    const response = condominios.map(condominio => condominio.get());
    return response;
  };
  show = async id => {
    const condominio = await Condominio.findOne({
      where: {
        id
      }
    });
    return condominio.get();
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

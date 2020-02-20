"use strict";

const { Beneficiario } = require("../models");

class BeneficiarioController {
  create = async data => {
    const beneficiario = await Beneficiario.create(data);
    return beneficiario.get();
  };
  index = async () => {
    const beneficiarios = await Beneficiario.findAll();
    const response = beneficiarios.map(beneficiario => beneficiario.get());
    return response;
  };
  show = async id => {
    const beneficiario = await Beneficiario.findOne({
      where: {
        id
      }
    });
    return beneficiario.get();
  };
  update = async data => {
    const beneficiario = await Beneficiario.update(data, {
      where: {
        id: data.id
      }
    });
    return beneficiario;
  };
  delete = async id => {
    const beneficiario = await Beneficiario.destroy({
      where: {
        id
      }
    });
    return beneficiario;
  };
}

module.exports = BeneficiarioController;

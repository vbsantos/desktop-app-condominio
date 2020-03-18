"use strict";

const { Valor } = require("../models");

class ValorController {
  // updateOrCreate = async data => {
  //   data.forEach(dt => {
  //     try {
  //       const valor = await Valor.create(dt);
  //     } catch (error) {
  //       const valor = await Valor.update(dt);
  //     }
  //   });
  // };
  create = async data => {
    const valor = await Valor.create(data);
    return valor.get();
  };
  bulkCreate = async data => {
    const valores = await Valor.bulkCreate(data);
    const response = valores.map(valor => valor.get());
    return response;
  };
  index = async () => {
    const valores = await Valor.findAll();
    const response = valores.map(valor => valor.get());
    return response;
  };
  show = async id => {
    const valor = await Valor.findOne({
      where: {
        id
      }
    });
    return valor.get();
  };
  update = async data => {
    const valor = await Valor.update(data, {
      where: {
        id: data.id
      }
    });
    return valor;
  };
  bulkUpdate = async data => {
    let response = [];
    for (let dt of data) {
      response.push(
        await Valor.update(dt, {
          where: {
            id: dt.id
          }
        })
      );
    }
    return response;
  };
  delete = async id => {
    const valor = await Valor.destroy({
      where: {
        id
      }
    });
    return valor;
  };
  bulkDelete = async id => {
    const valor = await Valor.destroy({
      where: {
        DespesaId: id
      }
    });
    return valor;
  };
}

module.exports = ValorController;

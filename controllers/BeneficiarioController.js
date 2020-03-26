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
  showNested = async id => {
    const beneficiario = await Beneficiario.findOne({
      where: {
        id
      },
      include: {
        all: true,
        nested: true
      }
    });
    let Boletos = [];
    let Pagantes = [];
    let Despesas = [];
    let Valores = [];
    let Condominios = [];
    // let RelatorioGeral = [];
    // let RelatorioIndividual = [];
    beneficiario.Condominios.forEach(condominio => {
      // condominio.GeneralReports.forEach(generalReport => {
      //   RelatorioGeral.push(generalReport.get());
      // });
      condominio.Despesas.forEach(despesa => {
        despesa.Valors.forEach(valor => {
          Valores.push(valor.get());
        });
        const temp3 = despesa.get();
        delete temp3.Valors;
        temp3.Valores = Valores;
        Despesas.push(temp3);
        Valores = [];
      });
      condominio.Pagantes.forEach(pagante => {
        // pagante.IndividualReports.forEach(individualReport => {
        // RelatorioIndividual.push(individualReport.get());
        // });
        pagante.Boletos.forEach(boleto => {
          Boletos.push(boleto.get());
        });
        const temp1 = pagante.get();
        temp1.Boletos = Boletos;
        Boletos = [];
        // temp1.Relatorios = RelatorioIndividual;
        // RelatorioIndividual = [];
        // delete temp1.IndividualReports;
        Pagantes.push(temp1);
      });
      const temp2 = condominio.get();
      // delete temp2.GeneralReports;
      // Sort pra colocar "RelatoriosGeiras" por ordem inversa de criação (id)
      // temp2.Relatorios = RelatorioGeral.sort((a, b) => (a.id < b.id ? 1 : -1));
      // RelatorioGeral = [];
      // Sort pra colocar "contas" por ordem de criação (id)
      temp2.Despesas = Despesas.sort((a, b) => (a.id > b.id ? 1 : -1));
      Despesas = [];
      // Sort pra colocar "pagantes" por ordem de complemento (número do apartamento)
      temp2.Pagantes = Pagantes.sort((a, b) =>
        a.complemento > b.complemento ? 1 : -1
      );
      Condominios.push(temp2);
      Pagantes = [];
    });
    let Response = beneficiario.get();
    Response.Condominios = Condominios;
    return Response;
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

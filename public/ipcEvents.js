// React Event Handlers

const { ipcMain } = require("electron");

const databaseController = require("../controllers/DatabaseController.js");
const Database = new databaseController();

ipcMain.handle("database", async (event, arg) => {
  const { method } = arg;
  let status;
  try {
    switch (method) {
      case "migrations":
        console.log("entrada:", arg);
        status = await Database.runMigrations();
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    return { error };
  }
});

const beneficiarioController = require("../controllers/BeneficiarioController.js");
const Beneficiario = new beneficiarioController();

ipcMain.handle("beneficiarios", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await Beneficiario.create(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await Beneficiario.index();
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await Beneficiario.show(content.id);
        console.log("saida:", status);
        break;
      case "showNested":
        console.log("entrada:", arg);
        status = await Beneficiario.showNested(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await Beneficiario.update(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await Beneficiario.delete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const condominioController = require("../controllers/CondominioController.js");
const Condominio = new condominioController();

ipcMain.handle("condominios", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await Condominio.create(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await Condominio.index();
        console.log("saida:", status);
        break;
      case "indexByBeneficiarioPk":
        console.log("entrada:", arg);
        status = await Condominio.indexByBeneficiarioPk(content.id);
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await Condominio.show(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await Condominio.update(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await Condominio.delete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const paganteController = require("../controllers/PaganteController.js");
const Pagante = new paganteController();

ipcMain.handle("pagantes", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await Pagante.create(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await Pagante.index();
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await Pagante.show(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await Pagante.update(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await Pagante.delete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const boletoController = require("../controllers/BoletoController.js");
const Boleto = new boletoController();

ipcMain.handle("boletos", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await Boleto.create(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await Boleto.index();
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await Boleto.show(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await Boleto.update(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await Boleto.delete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const despesaController = require("../controllers/DespesaController.js");
const Despesa = new despesaController();

ipcMain.handle("despesas", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await Despesa.create(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await Despesa.index();
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await Despesa.show(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await Despesa.update(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await Despesa.delete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const valorController = require("../controllers/ValorController.js");
const Valor = new valorController();
ipcMain.handle("valores", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await Valor.create(content);
        console.log("saida:", status);
        break;
      case "bulkCreate":
        console.log("entrada:", arg);
        status = await Valor.bulkCreate(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await Valor.index();
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await Valor.show(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await Valor.update(content);
        console.log("saida:", status);
        break;
      case "bulkUpdate":
        console.log("entrada:", arg);
        status = await Valor.bulkUpdate(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await Valor.delete(content.id);
        console.log("saida:", status);
        break;
      case "bulkDelete":
        console.log("entrada:", arg);
        status = await Valor.bulkDelete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const individualReportController = require("../controllers/IndividualReportController.js");
const IndividualReport = new individualReportController();
ipcMain.handle("individualReports", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await IndividualReport.create(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await IndividualReport.index();
        console.log("saida:", status);
        break;
      case "indexByOwnerId":
        console.log("entrada:", arg);
        status = await IndividualReport.indexByOwnerId(content.id);
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await IndividualReport.show(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await IndividualReport.update(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await IndividualReport.delete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const generalReportController = require("../controllers/GeneralReportController.js");
const GeneralReport = new generalReportController();
ipcMain.handle("generalReports", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "create":
        console.log("entrada:", arg);
        status = await GeneralReport.create(content);
        console.log("saida:", status);
        break;
      case "index":
        console.log("entrada:", arg);
        status = await GeneralReport.index();
        console.log("saida:", status);
        break;
      case "indexByOwnerId":
        console.log("entrada:", arg);
        status = await GeneralReport.indexByOwnerId(content.id);
        console.log("saida:", status);
        break;
      case "show":
        console.log("entrada:", arg);
        status = await GeneralReport.show(content.id);
        console.log("saida:", status);
        break;
      case "update":
        console.log("entrada:", arg);
        status = await GeneralReport.update(content);
        console.log("saida:", status);
        break;
      case "delete":
        console.log("entrada:", arg);
        status = await GeneralReport.delete(content.id);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const fileController = require("../controllers/FileController.js");
const File = new fileController();
ipcMain.handle("files", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "generateGeneralReport":
        console.log("entrada:", arg);
        status = await File.generateGeneralReport(content);
        console.log("saida:", status);
        break;
      case "generateIndividualReport":
        console.log("entrada:", arg);
        status = await File.generateIndividualReport(content);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

const boletoCloudController = require("../controllers/BoletoCloudController.js");
const BoletoCloud = new boletoCloudController();
ipcMain.handle("boletoCloudAPI", async (event, arg) => {
  const { method, content } = arg;
  let status;
  try {
    switch (method) {
      case "getBillet":
        console.log("entrada:", arg);
        status = await BoletoCloud.getBillet(content);
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

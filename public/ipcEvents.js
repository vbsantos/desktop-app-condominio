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
      case "update":
        console.log("entrada:", arg);
        status = await Beneficiario.update(content);
        console.log("saida:", status);
        break;
      case "destroy":
        console.log("entrada:", arg);
        status = await Beneficiario.destroy(content.id);
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
      case "destroy":
        console.log("entrada:", arg);
        status = await Condominio.destroy(content.id);
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
      case "destroy":
        console.log("entrada:", arg);
        status = await Pagante.destroy(content.id);
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
      case "destroy":
        console.log("entrada:", arg);
        status = await Boleto.destroy(content.id);
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

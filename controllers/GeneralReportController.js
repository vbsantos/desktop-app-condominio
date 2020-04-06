"use strict";

const { GeneralReport } = require("../models");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const { dialog } = require("electron");

class GeneralReportController {
  create = async (data) => {
    const generalreport = await GeneralReport.create(data);
    return generalreport.get();
  };
  index = async () => {
    const generalreports = await GeneralReport.findAll();
    const response = generalreports.map((generalreport) => generalreport.get());
    return response;
  };
  indexByOwnerId = async (id) => {
    const generalreports = await GeneralReport.findAll({
      where: {
        condominioId: id,
      },
    });
    const response = generalreports
      .map((generalreport) => generalreport.get())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return response;
  };
  show = async (id) => {
    const generalreport = await GeneralReport.findOne({
      where: {
        id,
      },
    });
    return generalreport.get();
  };
  update = async (data) => {
    const generalreport = await GeneralReport.update(data, {
      where: {
        id: data.id,
      },
    });
    return generalreport;
  };
  delete = async (id) => {
    const generalreport = await GeneralReport.destroy({
      where: {
        id,
      },
    });
    return generalreport;
  };
  makeDocument = async (base64imageString) => {
    const dataURItoBlob = (dataURI) => {
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    };
    try {
      // Create a new PDFDocument
      const pdfDoc = await PDFDocument.create();

      // Embed the PNG image bytes
      const pngImage = await pdfDoc.embedPng(base64imageString);

      // Get the width/height of the PNG image scaled down to 50% of its original size
      const pngDims = pngImage.scale(0.6);

      // Add a blank page to the document
      const page = pdfDoc.addPage();

      // Get the width and height of the page
      const { width, height } = page.getSize();

      // Draw the PNG image near the lower right corner of the JPG image
      page.drawImage(pngImage, {
        x: 10,
        y: page.getHeight() - pngDims.height - 20,
        width: 576,
        height: pngDims.height,
      });

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();

      // Save pdf in downloads folder
      dialog
        .showSaveDialog({
          title: "RelatorioCondominio.pdf", //FIXME: não ta exibindo
          filters: [
            { name: "Documents", extensions: ["pdf"] },
            { name: "Custom File Type", extensions: ["as"] },
            { name: "All Files", extensions: ["*"] },
          ],
        })
        .then(({ filePath }) => fs.writeFileSync(filePath, pdfBytes));
      //https://github.com/electron/electron/blob/v7.0.0/docs/api/dialog.md

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

module.exports = GeneralReportController;

"use strict";

const { IndividualReport } = require("../models");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const { dialog } = require("electron");

class IndividualReportController {
  create = async (data) => {
    const individualreport = await IndividualReport.create(data);
    return individualreport.get();
  };
  index = async () => {
    const individualreports = await IndividualReport.findAll();
    const response = individualreports.map((individualreport) =>
      individualreport.get()
    );
    return response;
  };
  indexByOwnerId = async (id) => {
    const individualreports = await IndividualReport.findAll({
      where: {
        paganteId: id,
      },
    });
    const response = individualreports
      .map((individualreport) => individualreport.get())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return response;
  };
  show = async (id) => {
    const individualreport = await IndividualReport.findOne({
      where: {
        id,
      },
    });
    return individualreport.get();
  };
  update = async (data) => {
    const individualreport = await IndividualReport.update(data, {
      where: {
        id: data.id,
      },
    });
    return individualreport;
  };
  delete = async (id) => {
    const individualreport = await IndividualReport.destroy({
      where: {
        id,
      },
    });
    return individualreport;
  };
  makeDocument = async (base64imageString) => {
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
          title: "RelatorioMorador.pdf", //FIXME: não ta exibindo
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

module.exports = IndividualReportController;

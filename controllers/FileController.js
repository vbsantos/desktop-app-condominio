"use strict";

const { PDFDocument } = require("pdf-lib");
const { dialog } = require("electron");
const fs = require("fs");

class FileController {
  saveAsDialog = async (filename) => {
    // Dialog title, filename and button label
    const dialogConfig = {
      title: "Salvar Relatório",
      defaultPath: `${filename}.pdf`,
      buttonLabel: "Salvar",
      filters: [
        { name: "Documents", extensions: ["pdf"] },
        { name: "Custom File Type", extensions: ["as"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };

    // Dialog return object with document final path
    const { filePath } = await dialog.showSaveDialog(dialogConfig);

    return filePath;
  };
  createPdf = async (base64imageString) => {
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
      y: height - pngDims.height - 20,
      width: width - 20,
      height: pngDims.height,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save();
  };
  generateGeneralReport = async (base64imageString) => {
    try {
      // Create PDF and embed PNG
      const pdfBytes = await this.createPdf(base64imageString);

      // Choose path to save documento
      const filePath = await this.saveAsDialog("RelatorioCondominio");

      // Save document
      fs.writeFileSync(filePath, pdfBytes);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  generateIndividualReport = async (base64imageString) => {
    try {
      // Create PDF and embed PNG
      const pdfBytes = await this.createPdf(base64imageString);

      // Choose path to save documento
      const filePath = await this.saveAsDialog("RelatorioMorador");

      // Save document
      fs.writeFileSync(filePath, pdfBytes);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  // TODO: CRIAR METODO PRA UNIR/MODIFICAR BOLETO COM RELATÓRIOS
}

module.exports = FileController;

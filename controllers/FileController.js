"use strict";

const { PDFDocument } = require("pdf-lib");
const { dialog } = require("electron");
const fs = require("fs");

class FileController {
  saveReportAsDialog = async (filename) => {
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
  saveReportsDialog = async () => {
    // Dialog title, filename and button label
    const dialogConfig = {
      title: "Salvar Relatórios",
      buttonLabel: "Salvar",
      properties: ["createDirectory", "openDirectory"],
    };
    // Dialog return object with document final path
    const { filePaths } = await dialog.showOpenDialog(dialogConfig);
    return filePaths[0];
  };
  createSinglePagePdf = async (base64imageString) => {
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
      // FIXME aumentar margens
      x: 10,
      y: height - pngDims.height - 20,
      width: width - 20,
      height: pngDims.height,
    });
    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save();
  };
  createTwoPagePdf = async (base64imageString1, base64imageString2) => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    // Embed the PNG image bytes
    const pngImage1 = await pdfDoc.embedPng(base64imageString1);
    const pngImage2 = await pdfDoc.embedPng(base64imageString2);
    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims1 = pngImage1.scale(0.6);
    const pngDims2 = pngImage2.scale(0.6);
    // Add a blank page to the document
    const page1 = pdfDoc.addPage();
    const page2 = pdfDoc.addPage();
    // Get the width and height of the page
    const { width, height } = page1.getSize();
    // Draw the PNG image near the lower right corner of the JPG image
    page1.drawImage(pngImage1, {
      // FIXME aumentar margens
      x: 10,
      y: height - pngDims1.height - 20,
      width: width - 20,
      height: pngDims1.height,
    });
    page2.drawImage(pngImage2, {
      x: 10,
      y: height - pngDims2.height - 20,
      width: width - 20,
      height: pngDims2.height,
    });
    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save();
  };
  generateGeneralReport = async (base64imageString) => {
    try {
      // Choose path to save documento
      const filePath = await this.saveReportAsDialog("RelatorioCondominio");
      // Create PDF and embed PNG
      const pdfBytes = await this.createSinglePagePdf(base64imageString);
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
      // Choose path to save documento
      const filePath = await this.saveReportAsDialog("RelatorioMorador");
      // Create PDF and embed PNG
      const pdfBytes = await this.createSinglePagePdf(base64imageString);
      // Save document
      fs.writeFileSync(filePath, pdfBytes);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  generateAllReports = async (base64reports) => {
    try {
      const reports = [];
      // Choose path to save documento
      const filePath = await this.saveReportsDialog();
      if (typeof filePath === "undefined") return false;
      // Create PDF and embed PNGs
      const generalReportBase64 = base64reports.rg;
      for (const individualReportBase64 of base64reports.ris) {
        const report = await this.createTwoPagePdf(
          generalReportBase64,
          individualReportBase64
        );
        reports.push(report);
      }
      // Save reports
      for (const index in reports) {
        const path = filePath + "/report_" + index + ".pdf"; // FIXME: trocar o 'index' pelo 'complemento' e 'data do relatorio'z
        await fs.writeFileSync(path, reports[index]);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

module.exports = FileController;

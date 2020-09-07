"use strict";

const { PDFDocument, PageSizes } = require("pdf-lib");
const { dialog } = require("electron");
const Path = require("path");
const fs = require("fs");

class FileController {
  getTimestamp = () => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzoffset).toISOString();
    const formatedTime = localISOTime
      .slice(0, -1)
      .split(".")[0]
      .replace(":", "-")
      .replace(":", "-")
      .replace("T", "_");
    return formatedTime;
  };
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
    const page = pdfDoc.addPage(PageSizes.A4);
    // Get the width and height of the page
    const { width, height } = page.getSize();
    // Draw the PNG image near the lower right corner of the JPG image
    page.drawImage(pngImage, {
      x: 20,
      y: height - pngDims.height - 20,
      width: width - 40,
      height: pngDims.height,
    });
    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save();
  };
  createLandscapeSinglePagePdf = async (base64imageString) => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    // Embed the PNG image bytes
    const pngImage = await pdfDoc.embedPng(base64imageString);
    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.5);
    // Add a blank page to the document
    const page = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
    // Get the width and height of the page
    const { width, height } = page.getSize();
    // Draw the PNG image near the lower right corner of the JPG image
    page.drawImage(pngImage, {
      x: 20,
      y: height - pngDims.height - 20,
      width: width - 40,
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
    const page1 = pdfDoc.addPage(PageSizes.A4);
    const page2 = pdfDoc.addPage(PageSizes.A4);
    // Get the width and height of the page
    const { width, height } = page1.getSize();
    // Draw the PNG image near the lower right corner of the JPG image
    page1.drawImage(pngImage1, {
      x: 20,
      y: height - pngDims1.height - 20,
      width: width - 40,
      height: pngDims1.height,
    });
    page2.drawImage(pngImage2, {
      x: 20,
      y: height - pngDims2.height - 20,
      width: width - 40,
      height: pngDims2.height,
    });
    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save();
  };
  generateGeneralReport = async (base64imageString) => {
    try {
      // generate: tells with reports to generate
      const { generate } = base64imageString;
      if (
        generate &&
        !generate.rg &&
        !generate.rr &&
        !generate.rfr &&
        !generate.ra
      )
        return false;
      const filePath = await this.saveReportsDialog();
      if (typeof filePath === "undefined") return false;
      const generalReportBase64 = base64imageString.rg;
      const apportionmentReportBase64 = base64imageString.rr;
      const waterReportBase64 = base64imageString.ra;
      const reserveFundReportBase64 = base64imageString.rfr;

      if (generate.rg) {
        const generalReport = await this.createSinglePagePdf(
          generalReportBase64
        );
        fs.writeFileSync(
          Path.resolve(
            filePath,
            "demonstrativo_financeiro_" + this.getTimestamp() + ".pdf"
          ),
          generalReport
        );
      }

      if (generate.rr) {
        const apportionmentReport = await this.createLandscapeSinglePagePdf(
          apportionmentReportBase64
        );
        fs.writeFileSync(
          Path.resolve(
            filePath,
            "planilha_cobrancas_" + this.getTimestamp() + ".pdf"
          ),
          apportionmentReport
        );
      }

      if (reserveFundReportBase64) {
        if (generate.rfr) {
          const reserveFundReport = await this.createSinglePagePdf(
            reserveFundReportBase64
          );
          fs.writeFileSync(
            Path.resolve(
              filePath,
              "relatorio_fundo_reserva_" + this.getTimestamp() + ".pdf"
            ),
            reserveFundReport
          );
        }
      }

      if (waterReportBase64) {
        if (generate.ra) {
          const waterReport = await this.createSinglePagePdf(waterReportBase64);
          fs.writeFileSync(
            Path.resolve(
              filePath,
              "relatorio_agua_" + this.getTimestamp() + ".pdf"
            ),
            waterReport
          );
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  generateIndividualReport = async (base64imageString) => {
    try {
      // generate: tells with reports to generate
      const { generate } = base64imageString;
      if (!generate.ris) return false;
      // Choose path to save documento
      const filePath = await this.saveReportAsDialog(
        "relatorio_individual_" + this.getTimestamp()
      );
      // Create PDF and embed PNG
      const pdfBytes = await this.createSinglePagePdf(base64imageString.ris);
      // Save document
      fs.writeFileSync(filePath, pdfBytes);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  generateAllReports = async (reportDatas) => {
    try {
      // generate: tells with reports to generate
      const { generate } = reportDatas;
      if (
        generate &&
        !generate.rg &&
        !generate.rr &&
        !generate.rfr &&
        !generate.ra &&
        !generate.ris
      )
        return false;

      const { base64Reports } = reportDatas;
      const { infos } = reportDatas;
      const reports = [];
      // Choose path to save documento
      const filePath = await this.saveReportsDialog();
      if (typeof filePath === "undefined") return false;
      // Create PDF and embed PNGs

      if (generate.rg) {
        const generalReportBase64 = base64Reports.rg;
        const generalReport = await this.createSinglePagePdf(
          generalReportBase64
        );
        const path = Path.resolve(
          filePath,
          "demonstrativo_financeiro_" + this.getTimestamp() + ".pdf"
        );
        await fs.writeFile(path, generalReport, function (err) {
          if (err) {
            console.log("Error saving file '" + path + "'");
            throw new Error(err);
          }
          console.log("The file '" + path + "' was saved!");
        });
      }

      if (!generate || generate.ris) {
        const generalReportBase64 = base64Reports.rg;
        for (const individualReportBase64 of base64Reports.ris) {
          const report = await this.createTwoPagePdf(
            generalReportBase64,
            individualReportBase64
          );
          reports.push(report);
        }
      }

      if (!generate || generate.rr) {
        const apportionmentReportBase64 = base64Reports.rr;
        const apportionmentReport = await this.createLandscapeSinglePagePdf(
          apportionmentReportBase64
        );
        const path = Path.resolve(
          filePath,
          "planilha_cobrancas_" + this.getTimestamp() + ".pdf"
        );
        await fs.writeFile(path, apportionmentReport, function (err) {
          if (err) {
            console.log("Error saving file '" + path + "'");
            throw new Error(err);
          }
          console.log("The file '" + path + "' was saved!");
        });
      }

      if (!generate || generate.ra) {
        const waterReportBase64 = base64Reports.ra;
        if (waterReportBase64) {
          const waterReport = await this.createSinglePagePdf(waterReportBase64);
          const path = Path.resolve(
            filePath,
            "relatorio_agua_" + this.getTimestamp() + ".pdf"
          );
          await fs.writeFile(path, waterReport, function (err) {
            if (err) {
              console.log("Error saving file '" + path + "'");
              throw new Error(err);
            }
            console.log("The file '" + path + "' was saved!");
          });
        }
      }

      if (!generate || generate.rfr) {
        const reserveFundReportBase64 = base64Reports.rfr;
        if (reserveFundReportBase64) {
          const reserveFundReport = await this.createSinglePagePdf(
            reserveFundReportBase64
          );
          const path = Path.resolve(
            filePath,
            "relatorio_fundo_reserva_" + this.getTimestamp() + ".pdf"
          );
          await fs.writeFile(path, reserveFundReport, function (err) {
            if (err) {
              console.log("Error saving file '" + path + "'");
              throw new Error(err);
            }
            console.log("The file '" + path + "' was saved!");
          });
        }
      }

      if (!generate || generate.ris) {
        // Save reports
        for (const index in reports) {
          const path = Path.resolve(
            filePath,
            "relatorio_" + infos[index] + "_" + this.getTimestamp() + ".pdf"
          );
          await fs.writeFile(path, reports[index], function (err) {
            if (err) {
              console.log("Error saving file '" + path + "'");
              throw new Error(err);
            }
            console.log("The file '" + path + "' was saved!");
          });
        }
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

module.exports = FileController;

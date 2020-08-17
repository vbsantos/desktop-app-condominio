import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Tabs, Tab } from "@material-ui/core";

// CSS
import "./style.css";

// REPORTS
import RelatorioRateio from "../../reports/relatorioRateio";
import RelatorioAgua from "../../reports/relatorioAgua";
import RelatorioGeral from "../../reports/relatorioGeral";
import RelatorioIndividual from "../../reports/relatorioIndividual";
import RelatorioFundoReserva from "../../reports/relatorioFundoReserva";

// COMPONENTS
import TabPanel from "../../components/tabPanel";

// COMPONENT TO PNG
import html2canvas from "html2canvas";

export default function VisualizarRelatorios(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Used to control the tabs
  const [value, setValue] = useState(0);
  const [reportView, setReportView] = useState("screenStyle");

  // Stores the general report reference
  const reportRef = useRef(null);
  const waterReportRef = useRef(null);
  const apportionmentReportRef = useRef(null);
  const reserveFundReportRef = useRef(null);

  console.groupCollapsed("VisualizarRelatorios: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("VisualizarRelatorios: System data");

  // This function runs only when the component is monted
  useEffect(() => {
    //corrects development bug when reloading pages
    data.beneficiario.id || navigate("/");
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR",
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: "",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: true,
          value: "SALVAR PDF",
        },
      ],
      action: -1,
    });
    return () => console.log("VisualizarRelatorios - Encerrou");
  }, []);

  // This funcions turns a React Component into a PDF
  const getComponentPrint = async (
    refGeneralReport,
    refApportionmentReport,
    refWaterReport,
    reserveFundReportRef
  ) => {
    setReportView("pdfStyle");
    if (refGeneralReport.current) {
      if (data.reports.generalReport) {
        let imgData1;
        let imgData2;
        let imgData3;
        let imgData4;
        const canvas1 = await html2canvas(refGeneralReport.current);
        imgData1 = await canvas1.toDataURL("image/png");
        const canvas2 = await html2canvas(refApportionmentReport.current);
        imgData2 = await canvas2.toDataURL("image/png");
        if (refWaterReport.current) {
          const canvas3 = await html2canvas(refWaterReport.current);
          imgData3 = await canvas3.toDataURL("image/png");
        }
        if (reserveFundReportRef.current) {
          const canvas4 = await html2canvas(reserveFundReportRef.current);
          imgData4 = await canvas4.toDataURL("image/png");
        }
        window.ipcRenderer.invoke("files", {
          method: "generateGeneralReport",
          content: {
            rg: imgData1,
            rr: imgData2,
            ra: refWaterReport.current ? imgData3 : null,
            rfr: reserveFundReportRef.current ? imgData4 : null,
          },
        });
      } else {
        const canvas = await html2canvas(refGeneralReport.current);
        const imgData = await canvas.toDataURL("image/png");
        window.ipcRenderer.invoke("files", {
          method: "generateIndividualReport",
          content: imgData,
        });
      }
      setReportView("screenStyle");
      return true;
    }
    setReportView("screenStyle");
    return false;
  };

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("VisualizarRelatorios - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/EscolherCondominio");
        break;
      case 1:
        console.log("VisualizarRelatorios - Botão do Centro");
        setFootbar({ ...footbar, action: -1 });
        break;
      case 2:
        console.log("VisualizarRelatorios - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        getComponentPrint(
          reportRef,
          apportionmentReportRef,
          waterReportRef,
          reserveFundReportRef
        );
        break;
    }
  }, [footbar.action]);

  // This function that runs when change tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getDate2 = (report) => {
    try {
      const reportJSON = JSON.parse(report.report);
      const reportDate = reportJSON.find((table) => table.name === "info").data
        .reportDate;
      return `${reportDate.mes}/${reportDate.ano}`;
    } catch (error) {
      const digits = report.createdAt.split("T")[0].split("-");
      return `${digits[1]}/${digits[0]}`;
    }
  };

  const debug = data.reports;
  console.error({ debug });

  return (
    <div id="visualizarRelatorios">
      <Tabs
        id="sidebar"
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs"
      >
        {data.reports.data.map((report, index) => (
          <Tab
            key={"panelTab" + index}
            label={getDate2(report)}
            title={"Data em que o relatório foi gerado"}
            id={`vertical-tab-${index}`}
            aria-controls={`vertical-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {data.reports.data.map((dt, index) => (
        <TabPanel key={"panel" + index} id="panel" value={value} index={index}>
          {data.reports.generalReport ? (
            <>
              <RelatorioGeral
                reportRef={reportRef}
                report={JSON.parse(dt.report)}
                view={"pdfStyle"}
              />
              <hr />
              <RelatorioRateio
                reportRef={apportionmentReportRef}
                report={JSON.parse(data.reports.data2[index].report)}
                view={reportView} // só aqui muda a aparência
              />
              {data.reports.data3[index].report && (
                <>
                  <hr />
                  <RelatorioAgua
                    reportRef={waterReportRef}
                    report={JSON.parse(data.reports.data3[index].report)}
                    view={"pdfStyle"}
                  />
                </>
              )}
              {data.reports.data4[index].report && (
                <>
                  <hr />
                  <RelatorioFundoReserva
                    reportRef={reserveFundReportRef}
                    report={JSON.parse(data.reports.data4[index].report)}
                    view={"pdfStyle"}
                  />
                </>
              )}
            </>
          ) : (
            <RelatorioIndividual
              reportRef={reportRef}
              report={JSON.parse(dt.report)}
              view={"pdfStyle"}
            />
          )}
        </TabPanel>
      ))}
    </div>
  );
}

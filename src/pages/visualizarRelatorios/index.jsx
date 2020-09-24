import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Tabs, Tab } from "@material-ui/core";

// CSS
import "./style.css";

// DIALOGS
import Loading from "../../dialogs/carregando";
import DialogEscolherRelatorios from "../../dialogs/escolherRelatorios";
import DialogGerarRelatorioAnual from "../../dialogs/gerarRelatorioAnual";

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

// FUNCTIONS
// This function turns HTML Objects in PNG (base64)
const htmlObjectToPng = async (htmlObject) => {
  if (!htmlObject) return null;
  const canvas = await html2canvas(htmlObject);
  const png = await canvas.toDataURL("image/png");
  return png;
};
// This functions returns de report date
const getDate = (report) => {
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

export default function VisualizarRelatorios(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Used to control the tabs
  const [value, setValue] = useState(0);
  const [reportView, setReportView] = useState("screenStyle");

  // Loading Dialog
  const [loading, setLoading] = useState(false);

  // Boolean for Escolher Relatorios Dialog
  const [dialogEscolherRelatorios, setDialogEscolherRelatorios] = useState(
    false
  );

  // Boolean for Relatorio Anual Dialog
  const [dialogGerarRelatorioAnual, setDialogGerarRelatorioAnual] = useState(
    false
  );

  // Stores the general report reference
  const reportRef = useRef(null);
  const waterReportRef = useRef(null);
  const apportionmentReportRef = useRef(null);
  const reserveFundReportRef = useRef(null);
  const PngReportsObject = useRef({ reports: null });

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
          visible: true,
          enabled: true,
          value: "SALVAR PDF",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: true,
          value: "RELATÓRIO ANUAL",
        },
      ],
      action: -1,
    });
    return () => console.log("VisualizarRelatorios - Encerrou");
  }, []);

  // REVIEW Cria PDFs de relatórios antigos
  // This funcions turns a React Component into a PDF
  const getComponentPrint = async (
    refGeneralReport,
    refApportionmentReport,
    refWaterReport,
    refReserveFundReport
  ) => {
    setReportView("pdfStyle");
    if (refGeneralReport.current) {
      if (data.reports.generalReport) {
        PngReportsObject.current.reports = {
          rg: await htmlObjectToPng(refGeneralReport.current),
          rr: await htmlObjectToPng(refApportionmentReport.current),
          ra: await htmlObjectToPng(refWaterReport.current),
          rfr: await htmlObjectToPng(refReserveFundReport.current),
        };
      } else {
        PngReportsObject.current.reports = {
          ris: await htmlObjectToPng(refGeneralReport.current),
        };
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
        console.log("VisualizarRelatorios - Botão da direita");
        setFootbar({ ...footbar, action: -1 });

        (async () => {
          setLoading(true);
          const processedReports = await getComponentPrint(
            reportRef,
            apportionmentReportRef,
            waterReportRef,
            reserveFundReportRef
          );
          setLoading(false);
          if (processedReports) {
            // Abre o dialog de escolha de relatórios para gerar
            setDialogEscolherRelatorios(true);
          }
        })();

        break;
      case 2:
        console.log("VisualizarRelatorios - Botão do Centro");
        setDialogGerarRelatorioAnual(true);
        setFootbar({ ...footbar, action: -1 });
        break;
    }
  }, [footbar.action]);

  // This function that runs when change tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div id="visualizarRelatorios">
      {/* LOADING */}
      {loading && (
        <Loading
          title={"Por favor aguarde enquanto os Relatórios são processados"}
          open={[loading, setLoading]}
        />
      )}
      {/* ESCOLHER RELATORIOS PARA GERAR */}
      {dialogGerarRelatorioAnual && (
        <DialogGerarRelatorioAnual
          open={[dialogGerarRelatorioAnual, setDialogGerarRelatorioAnual]}
          data={data}
        />
      )}
      {/* ESCOLHER RELATORIOS PARA GERAR */}
      {dialogEscolherRelatorios && (
        <DialogEscolherRelatorios
          open={[dialogEscolherRelatorios, setDialogEscolherRelatorios]}
          reportsObjRef={PngReportsObject.current.reports}
        />
      )}
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
            label={getDate(report)}
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

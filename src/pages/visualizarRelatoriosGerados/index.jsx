import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// DIALOGS
import DialogSaveReports from "../../dialogs/salvarRelatorios";
import DialogCloseSystem from "../../dialogs/fecharSistema";
import Loading from "../../dialogs/carregando";
import DialogEscolherRelatorios from "../../dialogs/escolherRelatorios";

// REPORTS
import RelatorioRateio from "../../reports/relatorioRateio";
import RelatorioAgua from "../../reports/relatorioAgua";
import RelatorioGeral from "../../reports/relatorioGeral";
import RelatorioIndividual from "../../reports/relatorioIndividual";
import RelatorioFundoReserva from "../../reports/relatorioFundoReserva";

// COMPONENT TO PNG
import html2canvas from "html2canvas";

// CSS
import "./style.css";

// FUNCTIONS
// This function turns HTML Objects in PNG (base64)
const htmlObjectToPng = async (htmlObject) => {
  const canvas = await html2canvas(htmlObject);
  const png = await canvas.toDataURL("image/png");
  return png;
};

export default function VisualizarRelatoriosGerados(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  const [reportView, setReportView] = useState("screenStyle");

  // Loading Dialog
  const [loading, setLoading] = useState(false);

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  data.beneficiario.id || navigate("/");

  // Boolean for Save Reports Dialog
  const [dialogSaveReports, setDialogSaveReports] = useState(false);

  // Boolean for Close System Dialog
  const [dialogCloseSystem, setDialogCloseSystem] = useState(false);

  // Boolean for Escolher Relatorios Dialog
  const [dialogEscolherRelatorios, setDialogEscolherRelatorios] = useState(
    false
  );

  // Stores a Reports PNGs object ref
  const PngReportsObject = useRef({ reports: null, infos: null });

  console.groupCollapsed("VisualizarRelatoriosGerados: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("VisualizarRelatoriosGerados: System data");

  // This function runs only when the component is monted
  useEffect(() => {
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
          value: "VER PDFs SEM SALVAR",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: true,
          value: "SALVAR RELATÓRIOS",
        },
      ],
      action: -1,
    });
    return () => console.log("VisualizarRelatoriosGerados - Encerrou");
  }, []);

  // This function turns the html tables in PNGs
  const getReportsBase64 = async () => {
    setReportView("pdfStyle");

    const relatoriosIndividuaisHTML = Array.from(
      document.getElementsByClassName("reportbase64 RelatorioIndividual")
    );
    const ris = [];
    for (const ri of relatoriosIndividuaisHTML) {
      ris.push(await htmlObjectToPng(ri));
    }

    const base64Reports = {
      rg: await htmlObjectToPng(
        document.getElementsByClassName("reportbase64 RelatorioGeral")[0]
      ),
      rr: await htmlObjectToPng(
        document.getElementsByClassName("reportbase64 RelatorioRateio")[0]
      ),
      ra: data.lastReports.ra
        ? await htmlObjectToPng(
            document.getElementsByClassName("reportbase64 RelatorioAgua")[0]
          )
        : null,
      rfr: data.lastReports.rfr
        ? await htmlObjectToPng(
            document.getElementsByClassName(
              "reportbase64 RelatorioFundoReserva"
            )[0]
          )
        : null,
      ris,
    };

    setData({
      ...data,
      base64Reports,
    });
    setReportView("screenStyle");
    PngReportsObject.current.reports = base64Reports;
    PngReportsObject.current.infos = getPagantesInfo(data.lastReports);
    return base64Reports;
  };

  const getPagantesInfo = (lastReports) => {
    const complementos = [];
    for (let reportString of lastReports.ris) {
      const reportObj = JSON.parse(reportString.report);
      complementos.push(
        reportObj[reportObj.length - 1].data.complementoPagante
      );
    }
    return complementos;
  };

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("VisualizarRelatoriosGerados - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/RegistrarDespesas");

        break;

      case 1:
        console.log("VisualizarRelatoriosGerados - Botão do meio");
        setFootbar({ ...footbar, action: -1 });

        (async () => {
          setLoading(true);
          await getReportsBase64();
          setLoading(false);
          setDialogEscolherRelatorios(true);
        })();

        break;

      case 2:
        console.log("VisualizarRelatoriosGerados - Botão da direita");
        setFootbar({ ...footbar, action: -1 });

        (async () => {
          setLoading(true);
          await getReportsBase64();
          setLoading(false);
          setDialogSaveReports(true);
        })();

        break;
    }
  }, [footbar.action]);

  return (
    <div id="VisualizarRelatoriosGerados">
      {/* LOADING */}
      {loading && (
        <Loading
          title={"Por favor aguarde enquanto os Relatórios são processados"}
          open={[loading, setLoading]}
        />
      )}
      {/* ESCOLHER RELATORIOS PARA GERAR */}
      {dialogEscolherRelatorios && (
        <DialogEscolherRelatorios
          open={[dialogEscolherRelatorios, setDialogEscolherRelatorios]}
          reportsObjRef={PngReportsObject.current.reports}
          infosRef={PngReportsObject.current.infos}
        />
      )}
      {dialogSaveReports && (
        <DialogSaveReports
          open={[dialogSaveReports, setDialogSaveReports]}
          closeDialog={[dialogCloseSystem, setDialogCloseSystem]}
          lastReports={data.lastReports}
          base64Reports={data.base64Reports}
          condominioId={data.allNestedCondominio.id}
          despesas={data.allNestedCondominio["Despesas"]}
        />
      )}
      {dialogCloseSystem && (
        <DialogCloseSystem open={[dialogCloseSystem, setDialogCloseSystem]} />
      )}

      <div>
        <RelatorioGeral
          reportClass="reportbase64 RelatorioGeral"
          reportRef={null}
          report={JSON.parse(data.lastReports.rg)}
          view={"pdfStyle"}
        />
      </div>
      <hr />
      <div>
        <RelatorioRateio
          reportClass="reportbase64 RelatorioRateio"
          reportRef={null}
          report={JSON.parse(data.lastReports.rr)}
          view={reportView} // só aqui muda a aparência
        />
      </div>
      {data.lastReports.ra && (
        <>
          <hr />
          <div>
            <RelatorioAgua
              reportClass="reportbase64 RelatorioAgua"
              reportRef={null}
              report={JSON.parse(data.lastReports.ra)}
              view={"pdfStyle"}
            />
          </div>
        </>
      )}
      {data.lastReports.rfr && (
        <>
          <hr />
          <div>
            <RelatorioFundoReserva
              reportClass="reportbase64 RelatorioFundoReserva"
              reportRef={null}
              report={JSON.parse(data.lastReports.rfr)}
              view={"pdfStyle"}
            />
          </div>
        </>
      )}
      <hr />
      <div>
        {data.lastReports.ris.map((ri) => (
          <div key={"ri" + ri.paganteId}>
            <RelatorioIndividual
              reportClass="reportbase64 RelatorioIndividual"
              reportRef={null}
              report={JSON.parse(ri.report)}
              view={"pdfStyle"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

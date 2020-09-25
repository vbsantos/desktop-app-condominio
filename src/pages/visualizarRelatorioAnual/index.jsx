import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// REPORTS
import RelatorioAnual from "../../reports/relatorioAnual";

// DIALOGS
import Loading from "../../dialogs/carregando";

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

const generateAnualReport = async (report, year) => {
  return await window.ipcRenderer.invoke("files", {
    method: "generateAnualReport",
    content: {
      report,
      year,
    },
  });
};

export default function VisualizarRelatorioAnual(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Loading Dialog
  const [loading, setLoading] = useState(false);

  // Stores the general report reference
  const anualReportRef = useRef(null);

  data.beneficiario.id || navigate("/");

  console.groupCollapsed("VisualizarRelatorioAnual: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("VisualizarRelatorioAnual: System data");

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
    return () => console.log("VisualizarRelatorioAnual - Encerrou");
  }, []);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("VisualizarRelatorioAnual - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/VisualizarRelatorios");
        break;

      case 2:
        console.log("VisualizarRelatorioAnual - Botão da direita");
        setFootbar({ ...footbar, action: -1 });

        (async () => {
          setLoading(true);
          const reportBase64 = await htmlObjectToPng(anualReportRef.current);
          await generateAnualReport(
            reportBase64,
            data.anualReport[0].month.split("/")[1]
          );
          setLoading(false);
        })();

        break;
    }
  }, [footbar.action]);

  return (
    <div id="VisualizarRelatorioAnual">
      {/* LOADING */}
      {loading && (
        <Loading
          title={"Por favor aguarde enquanto o Relatório é processado"}
          open={[loading, setLoading]}
        />
      )}
      <RelatorioAnual
        reportClass=""
        reportRef={anualReportRef}
        report={{
          data: data.anualReport,
          headerInfo: {
            nomeCondominio: data.allNestedCondominio.nome,
            enderecoCondominio: data.allNestedCondominio.endereco,
          },
        }}
        view={"pdfStyle"}
      />
    </div>
  );
}

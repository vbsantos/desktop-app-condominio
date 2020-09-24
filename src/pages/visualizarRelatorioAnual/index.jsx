import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// REPORTS
import RelatorioAnual from "../../reports/relatorioAnual";

export default function VisualizarRelatorioAnual(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  data.anualReport.length > 0 || navigate("/");

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
        break;
    }
  }, [footbar.action]);

  return (
    <div id="VisualizarRelatorioAnual">
      <div>
        <RelatorioAnual
          reportClass="reportbase64 RelatorioAnual"
          reportRef={null}
          report={JSON.parse(data.anualReport)}
          view={"pdfStyle"}
        />
      </div>
    </div>
  );
}

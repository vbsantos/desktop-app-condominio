import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// CSS
import "./style.css";

// DIALOGS

// REPORTS
// import RelatorioGeral from "../../reports/relatorioGeral";

export default function VisualizarRelatorios(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  console.groupCollapsed("VisualizarRelatorios: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("VisualizarRelatorios: System data");

  // This function runs only when the component is monted
  useEffect(() => {
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR"
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: "Registrar Nova Despesa"
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: true,
          value: "Download"
        }
      ],
      action: -1
    });
    return () => console.log("VisualizarRelatorios - Encerrou");
  }, []);

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
        console.log("DOWNLOAD PDF REPORT");
        break;
    }
  }, [footbar.action]);

  return (
    <>
      <p>teste1</p>
      <p>teste2</p>
    </>
  );
}

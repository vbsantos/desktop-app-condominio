import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Tabs, Tab } from "@material-ui/core";

// CSS
import "./style.css";

// REPORTS
import RelatorioGeral from "../../reports/relatorioGeral";
import RelatorioIndividual from "../../reports/relatorioIndividual";

// COMPONENTS
import TabPanel from "../../components/tabPanel";

// component to png
import html2canvas from "html2canvas";

export default function VisualizarRelatorios(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Used to control the tabs
  const [value, setValue] = useState(0);

  // Stores the general report reference
  const reportRef = useRef(null);

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
  const getComponentPrint = (ref) => {
    if (ref.current) {
      html2canvas(ref.current).then((canvas) => {
        console.log("CANVAS:", canvas);
        const imgData = canvas.toDataURL("image/png");
        console.log("imgData:", imgData);
        //TODO: save png ou só salva o base64 em uma variável que vai pro backend (faz sentido)
      });
      return true;
    }
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
        getComponentPrint(reportRef);
        console.log("DOWNLOAD PDF REPORT");
        break;
    }
  }, [footbar.action]);

  // This function that runs when change tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        {/* TODO - Adicionar algo que diz o nome do condomínio ou do morador ao visualizar */}
        {/* {data.reports.generalReport
          ? "Condomínio " + data.allNestedCondominio.name
          : "Eduardo Batata"} */}
        {data.reports.data.map((report, index) => (
          <Tab
            label={report.createdAt
              .split("T")[0]
              .split("-")
              .reverse()
              .join(" / ")}
            title={"Data em que o relatório foi gerado"}
            id={`vertical-tab-${index}`}
            aria-controls={`vertical-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {data.reports.data.map((dt, index) => (
        <TabPanel id="panel" value={value} index={index}>
          {data.reports.generalReport ? (
            <RelatorioGeral
              reportRef={reportRef}
              report={JSON.parse(dt.report)}
            />
          ) : (
            <RelatorioIndividual
              reportRef={reportRef}
              report={JSON.parse(dt.report)}
            />
          )}
        </TabPanel>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Tabs, Tab, Typography, Box } from "@material-ui/core";

// CSS
import "./style.css";

// REPORTS
import RelatorioGeral from "../../reports/relatorioGeral";
import RelatorioIndividual from "../../reports/relatorioIndividual";

export default function VisualizarRelatorios(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Used to control the tabs
  const [value, setValue] = useState(0);

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
          value: "VOLTAR"
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: ""
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "SALVAR PDF"
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

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }

  const getMonth = monthDigit => {
    let month;
    switch (Number(monthDigit)) {
      case 1:
        month = "Janeiro";
        break;
      case 2:
        month = "Fevereiro";
        break;
      case 3:
        month = "Março";
        break;
      case 4:
        month = "Abril";
        break;
      case 5:
        month = "Maio";
        break;
      case 6:
        month = "Junho";
        break;
      case 7:
        month = "Julho";
        break;
      case 8:
        month = "Agosto";
        break;
      case 9:
        month = "Setembro";
        break;
      case 10:
        month = "Outubro";
        break;
      case 11:
        month = "Novembro";
        break;
      case 12:
        month = "Dezembro";
        break;
      default:
        month = "ERRO";
        break;
    }
    return month;
  };

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
        {/* FIXME - nome do pagante */}
        {/* {data.reports.generalReport
          ? "Condomínio " + data.allNestedCondominio.name
          : "Eduardo Batata"} */}
        {data.reports.data.map((report, index) => (
          <Tab
            label={
              //getMonth(report.createdAt.split("-")[1])
              report.createdAt
                .split("T")[0]
                .split("-")
                .join(" / ")
            }
            id={`vertical-tab-${index}`}
            aria-controls={`vertical-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {data.reports.data.map((dt, index) => (
        <TabPanel id="panel" value={value} index={index}>
          {console.log(JSON.parse(dt.report))}

          {data.reports.generalReport
            ? console.warn("calling RelatorioGeral:", dt)
            : console.warn("calling RelatorioIndividual:", dt)}

          {data.reports.generalReport ? (
            <RelatorioGeral report={JSON.parse(dt.report)} />
          ) : (
            <RelatorioIndividual report={JSON.parse(dt.report)} />
          )}
        </TabPanel>
      ))}
    </div>
  );
}

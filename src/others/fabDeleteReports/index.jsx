import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Fab } from "@material-ui/core";

// MATERIAL UI ICONS
import { DeleteTwoTone as Delete } from "@material-ui/icons";

// DIALOGS
import Loading from "../../dialogs/carregando";

// CSS
import "./style.css";

// FUNCTIONS
const updateCondominioReports = async (condominioId, generalReports) => {
  let reports = {};
  let noReports = false;
  if (generalReports) {
    const generalReports = await window.ipcRenderer.invoke("generalReports", {
      method: "indexByOwnerId",
      content: { id: condominioId },
    });
    const waterReports = await window.ipcRenderer.invoke("waterReports", {
      method: "indexByOwnerId",
      content: { id: condominioId },
    });
    const apportionmentReports = await window.ipcRenderer.invoke(
      "apportionmentReports",
      {
        method: "indexByOwnerId",
        content: { id: condominioId },
      }
    );
    const reserveFundReports = await window.ipcRenderer.invoke(
      "reserveFundReports",
      {
        method: "indexByOwnerId",
        content: { id: condominioId },
      }
    );
    if (generalReports.length > 0) {
      reports = {
        generalReport: true,
        data: generalReports,
        data2: apportionmentReports,
        data3: waterReports,
        data4: reserveFundReports,
      };
    } else {
      noReports = true;
    }
  } else {
    const individualReports = await window.ipcRenderer.invoke(
      "individualReports",
      {
        method: "indexByOwnerId",
        content: { id: condominioId },
      }
    );
    if (individualReports.length > 0) {
      reports = {
        generalReport: false,
        data: individualReports,
      };
    } else {
      noReports = true;
    }
  }
  if (noReports) {
    return null;
  } else {
    return reports;
  }
};

export default function FloatingActionDeleteButton(props) {
  const { geracaoId } = props;
  const [data, setData] = props.data;
  const [loading, setLoading] = useState(false);
  const [onHover, setOnHover] = useState(false);

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  const handleClick = async () => {
    setOnHover(false);
    setLoading(true);
    await window.ipcRenderer.invoke("reports", {
      method: "deleteGeneration",
      content: {
        id: geracaoId,
      },
    });
    const isGeneralReport = data.reports.generalReport;
    const condominioId = data.allNestedCondominio.id;
    const reports = await updateCondominioReports(
      condominioId,
      isGeneralReport
    );
    if (reports) {
      setData({ ...data, reports });
    } else {
      navigate("/EscolherCondominio");
    }
    setLoading(false);
  };

  return loading ? (
    <Loading
      title={"Por favor aguarde enquanto os Relatórios são deletados"}
      open={[loading, setLoading]}
    />
  ) : (
    <Fab
      id="FloatingActionDeleteButton"
      className={onHover ? "hover" : ""}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      onClick={handleClick}
      color="secondary"
      aria-label="delete"
      variant="extended"
    >
      <Delete
        className={onHover ? "Ajusted" : ""}
        fontSize={onHover ? "default" : "large"}
      />
      {onHover ? <p>Deletar Relatórios</p> : ""}
    </Fab>
  );
}

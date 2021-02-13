import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";

// MATERIAL UI COMPONENTS
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@material-ui/core";

// MATERIAL UI ICONS
import { DeleteOutlined } from "@material-ui/icons";

// DIALOGS
import Loading from "../../dialogs/carregando";

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

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  const { geracaoId } = props;
  const [dialog, setDialog] = props.open;
  const [data, setData] = props.data;
  const [value, setValue] = props.tabs;

  const [loading, setLoading] = useState(false);

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // function that runs when the dialog is suposed to close
  const handleClose = () => {
    setDialog(false);
  };

  // function that runs when you click the right button
  const handleRightButton = async () => {
    setLoading(true);
    setValue(0);
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
      setLoading(false);
      setDialog(false);
    } else {
      setLoading(false);
      setDialog(false);
      navigate("/EscolherCondominio");
    }
  };

  return loading ? (
    <Loading
      open={[loading, setLoading]}
      title={"Por favor aguarde enquanto os Relatórios são deletados"}
    />
  ) : (
    <div id="dialogDeletarRelatorios">
      <Dialog
        open={dialog}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          color="inherit"
        >
          Deseja excluir os relatórios?
        </DialogTitle>
        <DialogContent>
          Essa ação irá excluir todos os relatórios gerados em conjunto com os
          da tela atual
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            FECHAR
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="secondary"
          >
            <DeleteOutlined />
            <p className="btn-text-ajusted">EXCLUIR</p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

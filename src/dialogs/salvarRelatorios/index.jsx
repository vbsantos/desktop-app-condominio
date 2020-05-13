import React from "react";
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
import { CreateOutlined } from "@material-ui/icons";

// CSS
import "./style.css";

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
  const [dialog, setDialog] = props.open;
  const { lastReports } = props;
  const { base64Reports } = props;
  const { condominioId } = props;

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    const reportsSaved = await saveAllReportsDisk();
    if (reportsSaved) {
      await saveAllReportsDatabase();
      await updateAllDespesas();
    }

    // TODO passo 6 - fecha sistema
    // FIXME dialog pergunta se quer sair ou voltar pro selecionarCondominio
    // FIXME loading screen
    setDialog(false);
  }

  // this function saves the reports as PDFs
  const saveAllReportsDisk = async () => {
    const status = await window.ipcRenderer.invoke("files", {
      method: "generateAllReports",
      content: base64Reports,
    });
    return status;
  };

  // this function saves de reports (data.lastReports) on the database
  const saveAllReportsDatabase = async () => {
    await window.ipcRenderer.invoke("generalReports", {
      method: "create",
      content: {
        report: lastReports.rg,
        condominioId,
      },
    });
    for (const individualReport of lastReports.ris) {
      await window.ipcRenderer.invoke("individualReports", {
        method: "create",
        content: { ...individualReport },
      });
    }
  };

  const updateAllDespesas = async () => {
    // FIXME passo 5 - atualizar todos os parcelaAtual (+1) e deletar parcelaAtual === parcelaTotal
    console.error("update despenses");
  };

  return (
    <div id="dialogSalvarRelatorios">
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
          Tem certeza que deseja salvar relatórios?
        </DialogTitle>
        <DialogContent>Essa ação não poderá ser desfeita.</DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
          >
            <CreateOutlined />
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

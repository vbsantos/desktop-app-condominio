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
    // FIXME: deletar debugs
    console.warn("SALVA TUDO, CRIA OS PDF E TERMINA");
    console.log("condominioId:", condominioId); // id pra salvar lastReports.rg no database
    console.log("lastReports:", lastReports); // lastReports pra salvar no database
    console.log("base64Reports:", base64Reports); // relatórios pra criar os PDFs

    // TODO passo 2 - se confirmar salva relatórios de data.lastReports no database
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

    // TODO passo 3 - após salvar, atualizar todos os parcelaAtual (+1) e deletar parcelaAtual === parcelaTotal
    // TODO passo 4 - envia reports para o backend criar os PDFs (usando html2canvas e useRef pego a string base64 deles)
    // TODO passo 5 - abre dialog pra escolher lugar para salvar os PDFs
    setDialog(false);
  }

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

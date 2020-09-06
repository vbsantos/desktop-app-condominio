import React from "react";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
} from "@material-ui/core";

// MATERIAL UI ICONS
import { ExitToAppOutlined } from "@material-ui/icons";

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

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // function that runs when the dialog is suposed to close
  function handleClose() {
    navigate("/EscolherCondominio"); // vai pra tela de condominios
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    window.close(); // sai do sistema
  }

  return (
    <div id="dialogFecharSistema">
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
          Deseja sair?
        </DialogTitle>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="contained"
            color="primary"
          >
            VOLTAR
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="secondary"
          >
            <ExitToAppOutlined />
            <p className="btn-text-ajusted">SAIR</p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

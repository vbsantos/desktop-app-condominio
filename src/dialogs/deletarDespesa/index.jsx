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
import { DeleteOutlined } from "@material-ui/icons";

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
  const { despesas } = props;
  const { despesa } = props;

  const isPrimary = (despesa) => {
    return !despesa.rateioAutomatico;
  };

  // This function finds the Despesa "B" that complements de Despesa "A"
  const findDespesaB = (despesas, despesa_a) => {
    let despesa_b;
    if (despesa_a.aguaIndividual) {
      if (despesa_a.rateioAutomatico) {
        // console.warn("Essa é a despesa secundária, procurando primária");
        despesa_b = despesas.find(
          (despesa) => despesa.aguaIndividual && isPrimary(despesa)
        );
      } else {
        // console.warn("Essa é a despesa primária, procurando secundária");
        despesa_b = despesas.find(
          (despesa) => despesa.aguaIndividual && !isPrimary(despesa)
        );
      }
    }
    return despesa_b;
  };

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    const despesa2 = despesa.aguaIndividual
      ? findDespesaB(despesas, despesa)
      : null;

    const response = await window.ipcRenderer.invoke("despesas", {
      method: "delete",
      content: { id: despesa.id },
    });
    response === 1
      ? console.warn(`Despesa excluida: [id=${despesa.id}]`)
      : console.warn(`Falha ao excluir Despesa: [id=${despesa.id}]`);

    if (despesa2) {
      const response2 = await window.ipcRenderer.invoke("despesas", {
        method: "delete",
        content: { id: despesa2.id },
      });
      response2 === 1
        ? console.warn(`Despesa excluida: [id=${despesa2.id}]`)
        : console.warn(`Falha ao excluir Despesa: [id=${despesa2.id}]`);
    }

    setDialog(false);
  }

  return (
    <div id="dialogDeletarConta">
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
          Deseja excluir a despesa{" "}
          <strong>
            {despesa.aguaIndividual
              ? "Consumo de Água"
              : despesa.fundoReserva
              ? "Fundo Reserva"
              : despesa.nome}
          </strong>
          ?
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
            color="secondary"
          >
            <DeleteOutlined />
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

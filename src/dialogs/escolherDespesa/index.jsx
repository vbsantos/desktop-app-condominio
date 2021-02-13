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

// MATERIAL UI COMPONENTS
import ButtonGroup from "@material-ui/core/ButtonGroup";

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

  const [dialogDespesaFixa, setDialogDespesaFixa] = props.despesaFixa;

  const [
    dialogDespesaParcelada,
    setDialogDespesaParcelada,
  ] = props.despesaParcelada;

  const [dialogDespesaAgua, setDialogDespesaAgua] = props.despesaAgua;

  const [
    dialogDespesaFundoReserva,
    setDialogDespesaFundoReserva,
  ] = props.despesaFundoReserva;

  const [dialogInformacao, setDialogInformacao] = props.informacao;

  const { despesas } = props;

  // Function that stores the id of the selected Conta
  const { setSelected } = props;

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click a button
  async function handleButton1() {
    setDialogDespesaFixa(true);
    setDialog(false);
  }

  // function that runs when you click a button
  async function handleButton2() {
    setDialogDespesaParcelada(true);
    setDialog(false);
  }

  // function that runs when you click a button
  async function handleButton3() {
    const despesa = despesas.find(
      (despesa) => despesa.aguaIndividual && !despesa.rateioAutomatico
    );
    const id = typeof despesa === "undefined" ? -1 : despesa.id;
    setSelected({ id });
    setDialogDespesaAgua(true);
    setDialog(false);
  }

  // function that runs when you click a button
  async function handleButton4() {
    const despesa = despesas.find((despesa) => despesa.fundoReserva);
    const id = typeof despesa === "undefined" ? -1 : despesa.id;
    setSelected({ id });
    setDialogDespesaFundoReserva(true);
    setDialog(false);
  }

  // function that runs when you click a button
  async function handleButton5() {
    setDialogInformacao(true);
    setDialog(false);
  }

  return (
    <div id="dialogEscolherDespesa">
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
          Tipo da Despesa
        </DialogTitle>
        <DialogContent>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            aria-label="vertical contained primary button group"
            variant="contained"
          >
            <Button onClick={handleButton1}>Despesa Fixa</Button>
            <Button onClick={handleButton2}>Despesa Parcelada</Button>
            <Button onClick={handleButton3}>Água</Button>
            <Button onClick={handleButton4}>Fundo Reserva</Button>
            <Button onClick={handleButton5}>Informação</Button>
          </ButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

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
import { AssessmentOutlined } from "@material-ui/icons";

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
  const [dialogCloseSystem, setDialogCloseSystem] = props.closeDialog;
  const { lastReports } = props;
  const { base64Reports } = props;
  const { condominioId } = props;
  const { despesas } = props;

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

  const deleteDespesa = async (id) => {
    await window.ipcRenderer.invoke("despesas", {
      method: "delete",
      content: { id },
    });
  };

  const updateDespesaParcelada = async (despesa) => {
    if (despesa.parcelaAtual === despesa.numParcelas) {
      deleteDespesa(despesa.id);
    } else {
      const novaParcela = +despesa.parcelaAtual + 1;
      await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: { id: despesa.id, parcelaAtual: novaParcela },
      });
    }
  };

  const updateRegistroPagante = async (id, novoRegistro) => {
    await window.ipcRenderer.invoke("pagantes", {
      method: "update",
      content: { id, leituraAgua: novoRegistro },
    });
  };

  const updateValorDespesaToZero = async (id, valores) => {
    await window.ipcRenderer.invoke("despesas", {
      method: "update",
      content: { id, valor: "0" },
    });
    if (valores.length > 0) {
      for (const valor of valores) {
        //FIXME: usar bulkUpdate (?)
        await window.ipcRenderer.invoke("valores", {
          method: "update",
          content: { id: valor.id, valor: "0" },
        });
      }
    }
  };

  // this function update all Despesas
  const updateAllDespesas = async (despesas) => {
    console.warn("DESPESAS:", despesas);
    for (const despesa of despesas) {
      // NÃO FAZ ALTERAÇÕES NO FUNDO RESERVA
      if (despesa.fundoReserva) continue;
      // SALVAR NOVO REGISTRO DE ÁGUA
      if (despesa.aguaIndividual) {
        for (const despesaIndividual of despesa["Valores"]) {
          await updateRegistroPagante(
            despesaIndividual.paganteId,
            despesaIndividual.agua
          );
        }
      }
      // ATUALIZAR DESPESAS PARCELADAS
      if (!despesa.permanente) {
        await updateDespesaParcelada(despesa);
      }
      // ZERAR VALORES
      await updateValorDespesaToZero(despesa.id, despesa["Valores"]);
    }
  };

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    const reportsSaved = await saveAllReportsDisk();
    if (reportsSaved) {
      await saveAllReportsDatabase();
      await updateAllDespesas(despesas);
      // FIXME loading screen
      // dialog pergunta se quer sair ou voltar pro selecionarCondominio
      setDialogCloseSystem(true);
      setDialog(false);
    }
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
            <AssessmentOutlined />
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

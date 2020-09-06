import React, { useState } from "react";
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

// DIALOGS
import Loading from "../../dialogs/carregando";

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

  const [loading, setLoading] = useState(false);

  const getPagantesInfo = async (lastReports) => {
    const complementos = [];
    for (let reportString of lastReports.ris) {
      const reportObj = JSON.parse(reportString.report);
      complementos.push(
        reportObj[reportObj.length - 1].data.complementoPagante
      );
    }
    return complementos;
  };

  // this function saves the reports as PDFs
  const saveAllReportsDisk = async (base64Reports, infos) => {
    const status = await window.ipcRenderer.invoke("files", {
      method: "generateAllReports",
      content: {
        base64Reports,
        infos,
      },
    });
    return status;
  };

  // this function saves de reports (data.lastReports) on the database
  const saveAllReportsDatabase = async () => {
    await window.ipcRenderer.invoke("apportionmentReports", {
      method: "create",
      content: {
        report: lastReports.rr,
        condominioId,
      },
    });
    await window.ipcRenderer.invoke("generalReports", {
      method: "create",
      content: {
        report: lastReports.rg,
        condominioId,
      },
    });
    await window.ipcRenderer.invoke("waterReports", {
      method: "create",
      content: {
        report: lastReports.ra,
        condominioId,
      },
    });
    await window.ipcRenderer.invoke("reserveFundReports", {
      method: "create",
      content: {
        report: lastReports.rfr,
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

  const updateRegistroPagante = async (paganteId, novoRegistro) => {
    await window.ipcRenderer.invoke("pagantes", {
      method: "update",
      content: { id: paganteId, leituraAgua: novoRegistro },
    });
  };

  const updateRegistroCondominio = async (condominioId, novoRegistro) => {
    await window.ipcRenderer.invoke("condominios", {
      method: "update",
      content: { id: condominioId, leituraAgua: novoRegistro },
    });
  };

  const updateValorDespesaToZero = async (despesaId, valores) => {
    await window.ipcRenderer.invoke("despesas", {
      method: "update",
      content: { id: despesaId, valor: "0" },
    });
    if (valores.length > 0) {
      for (const valor of valores) {
        await window.ipcRenderer.invoke("valores", {
          method: "update",
          content: { id: valor.id, valor: "0" },
        });
      }
    }
  };

  // function that update all Despesas
  const updateAllDespesas = async (despesas) => {
    for (const despesa of despesas) {
      if (despesa.fundoReserva) continue; // NÃO FAZ ALTERAÇÕES NO FUNDO RESERVA
      if (despesa.aguaIndividual) {
        if (!despesa.rateioAutomatico) {
          for (const individual of despesa["Valores"]) {
            await updateRegistroPagante(individual.paganteId, individual.agua); // SALVAR NOVO REGISTRO DE ÁGUA
          }
        } else {
          await updateRegistroCondominio(despesa.condominioId, despesa.agua);
        }
      }
      //await updateValorDespesaToZero(despesa.id, despesa["Valores"]); // ZERAR VALORES
      if (!despesa.permanente) {
        await updateDespesaParcelada(despesa); // ATUALIZAR DESPESAS PARCELADAS
      }
    }
  };

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    setLoading(true);
    const infos = await getPagantesInfo(lastReports);
    const reportsSaved = await saveAllReportsDisk(base64Reports, infos);
    if (reportsSaved) {
      await saveAllReportsDatabase();
      await updateAllDespesas(despesas);
      setLoading(false);
      setDialogCloseSystem(true);
      setDialog(false);
    } else {
      setLoading(false);
    }
  }

  return loading ? (
    <Loading
      title={"Por favor aguarde enquanto os Relatórios são salvos"}
      open={[loading, setLoading]}
    />
  ) : (
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
          Deseja salvar Relatórios?
        </DialogTitle>
        <DialogContent>
          Essa ação irá:
          <br />
          <br />- Salvar os relatórios no sistema;
          <br />- Incrementar parcelas das despesas;
          <br />- Atualizar registros de água;
          {/* <br />- Zerar custos das despesas; */}
          <br />
          <br />
          Caso prossiga, não poderá ser desfeita.
        </DialogContent>
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
            <p className="btn-text-ajusted">SALVAR</p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

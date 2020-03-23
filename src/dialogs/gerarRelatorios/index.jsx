import React from "react";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper
} from "@material-ui/core";

// MATERIAL UI ICONS
import { AssignmentOutlined } from "@material-ui/icons";

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

  // The categories setted during Despesa registration
  const { categorias } = props;

  // All data from this condominio
  const { condominio } = props;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // This function turns the GeneralReport data into a string
  const makeGeneralReportJSON = (categorias, despesas) => {
    const generalReport = categorias.map(categoria => {
      const despesasByCategory = despesas.filter(
        despesa => despesa.categoria === categoria
      );
      return { table: categoria, data: [...despesasByCategory] };
    });
    console.log("GeneralReport:", generalReport);
    const generalReportJSON = JSON.stringify(generalReport);
    return generalReportJSON;
  };

  // This function turns the IndividualReport data into a string
  const makeIndividualReportJSON = (categorias, despesas, pagantes) => {
    const individualReportsJSON = pagantes.map(pagante => {
      const individualReport = categorias.map(categoria => {
        let despesasByCategory = despesas.filter(
          despesa => despesa.categoria === categoria
        );
        despesasByCategory = despesasByCategory.map(despesa => {
          return despesa.rateioAutomatico
            ? {
                ...despesa,
                valor: (despesa.valor * pagante.fracao).toFixed(2)
              }
            : {
                ...despesa,
                valor: despesa["Valores"]
                  .filter(valor => valor.paganteId === pagante.id)[0]
                  .toFixed(2)
              };
        });
        return { table: categoria, data: [...despesasByCategory] };
      });
      console.log("IndividualReport:", individualReport);
      return {
        paganteId: pagante.id,
        report: JSON.stringify(individualReport)
      };
    });
    return individualReportsJSON;
  };

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    await window.ipcRenderer.invoke("generalReports", {
      method: "create",
      content: {
        report: makeGeneralReportJSON(categorias, condominio["Despesas"]),
        condominioId: condominio.id
      }
    });
    await makeIndividualReportJSON(
      categorias,
      condominio["Despesas"],
      condominio["Pagantes"]
    ).forEach(individualReport => {
      window.ipcRenderer.invoke("individualReports", {
        method: "create",
        content: { ...individualReport }
      });
    });
    setDialog(false);
    navigate("/"); // boletos
  }

  return (
    <div id="dialogGerarRelatorio">
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
          Confirmar despesas e gerar relatórios?
        </DialogTitle>
        <DialogContent>
          Ao continuar serão gerados relatórios de despesas para condomínio e
          moradores que serão utilizados no geração dos boletos.
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
          >
            <AssignmentOutlined />
            Gerar Relatórios
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

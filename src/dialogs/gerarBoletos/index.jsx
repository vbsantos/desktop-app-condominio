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
  Paper,
} from "@material-ui/core";

// FORM COMPONENTS
import FormBoleto from "../../forms/boleto";

// CSS
import "./style.css";

// MATERIAL UI ICONS
import { AssignmentOutlined } from "@material-ui/icons";

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

  // Sum of all despesas
  const [total] = props.valorTotal;

  // Percentage and value of fundoReserva
  const [percentage] = props.valorFundoReserva;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // True when the form isso all filled
  const [formCompleted, setFormCompleted] = useState(false);

  // Holds boleto field values
  const [boleto, setBoleto] = useState({
    id: "",
    emissao: "",
    vencimento: "",
    documento: "",
    titulo: "",
    numero: "",
    valor: "",
    paganteId: "",
  });

  // This function turns the GeneralReport data into a string
  const makeGeneralReportJSON = (categorias, despesas) => {
    const generalReport = categorias.map((categoria) => {
      const despesasByCategory = despesas.filter(
        (despesa) => despesa.categoria === categoria
      );
      return {
        table: true,
        name: categoria,
        data: [...despesasByCategory],
      };
    });
    generalReport.push({
      table: false,
      name: "fundoReserva",
      data: percentage[1].toFixed(2),
    });
    generalReport.push({
      table: false,
      name: "total",
      data: (total + percentage[1]).toFixed(2),
    });
    console.warn("Relatório Geral:", generalReport);
    const generalReportJSON = JSON.stringify(generalReport);
    return generalReportJSON;
  };

  // This function turns the IndividualReport data into a string
  const makeIndividualReportJSON = (categorias, despesas, pagantes) => {
    const individualReportsJSON = pagantes.map((pagante) => {
      let totalIndividual = 0;
      const individualReport = categorias.map((categoria) => {
        const despesasByCategory = despesas
          .filter((despesa) => despesa.categoria === categoria)
          .map((despesa) => {
            const valor = despesa.rateioAutomatico
              ? Number(despesa.valor * pagante.fracao)
              : Number(
                  despesa["Valores"].filter(
                    (valor) => valor.paganteId === pagante.id
                  )[0].valor
                );
            totalIndividual += valor;
            return {
              ...despesa,
              valor: valor.toFixed(2),
            };
          });
        // const despesasByCategoryEssencial = despesasByCategory.map(
        //   despesa => delete despesa["Valores"]
        // );
        return {
          table: true,
          name: categoria,
          data: [...despesasByCategory],
        };
      });
      const fundoReservaIndividual = (percentage[0] / 100) * totalIndividual;
      individualReport.push({
        table: false,
        name: "fundoReserva",
        data: fundoReservaIndividual.toFixed(2),
      });
      individualReport.push({
        table: false,
        name: "total",
        data: (totalIndividual + fundoReservaIndividual).toFixed(2),
      });
      console.log("Relatório Individual:", individualReport);
      return {
        paganteId: pagante.id,
        report: JSON.stringify(individualReport),
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
        condominioId: condominio.id,
      },
    });
    await makeIndividualReportJSON(
      categorias,
      condominio["Despesas"],
      condominio["Pagantes"]
    ).forEach((individualReport) => {
      window.ipcRenderer.invoke("individualReports", {
        method: "create",
        content: { ...individualReport },
      });
    });
    // FIXME: ENVIAR AS INFORMAÇÕES CORRETAS
    await window.ipcRenderer.invoke("boletoCloudAPI", {
      method: "getBillet",
      content: { condominio },
    });
    setDialog(false);
    // TODO: Finalizar fluxo
    navigate("/");
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
          Confirmar despesas e gerar boletos?
        </DialogTitle>
        <DialogContent>
          Ao continuar serão gerados os boletos pra cada morador.
          {/* TODO: formulário */}
          <FormBoleto
            boleto={[boleto, setBoleto]}
            completed={[formCompleted, setFormCompleted]}
          />
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

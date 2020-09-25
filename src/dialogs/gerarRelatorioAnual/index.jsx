import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  NativeSelect,
} from "@material-ui/core";

// MATERIAL UI ICONS
import { CreateOutlined } from "@material-ui/icons";

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
  const [data, setData] = props.data;

  const condominioId = data.allNestedCondominio.id;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // true when the year is selected
  const [formCompleted, setFormCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [years, setYears] = useState([]);
  const [year, setYear] = useState(0);

  useEffect(() => {
    setLoading(true);
    const getYears = async () => {
      const generations = await window.ipcRenderer.invoke("reports", {
        method: "getYears",
        content: {
          id: condominioId,
        },
      });
      setYears(generations);
    };
    getYears();
    setLoading(false);
  }, []);

  const yearSelected = (ano) => {
    if (ano != 0) {
      setFormCompleted(true);
      setYear(Number(ano));
    } else {
      setFormCompleted(false);
    }
  };

  const getReportData = async (year) => {
    return await window.ipcRenderer.invoke("reports", {
      method: "getByYear",
      content: {
        id: condominioId,
        year,
      },
    });
  };

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleButton() {
    setLoading(true);

    const reportData = await getReportData(year);
    data.anualReport = reportData;

    setLoading(false);
    setDialog(false);
    navigate("/VisualizarRelatorioAnual");
  }

  return loading ? (
    <Loading
      title={"Por favor aguarde enquanto o Relatório Anual é gerado"}
      open={[loading, setLoading]}
    />
  ) : (
    <div id="dialogGerarRelatorioAnual">
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
          Gerar relatório anual referente à
        </DialogTitle>
        <DialogContent>
          <FormControl>
            <InputLabel htmlFor="ano">Ano</InputLabel>
            <NativeSelect
              id="ano"
              className="Selector"
              onChange={(e) => yearSelected(e.target.value)}
            >
              <option key={0} value={0}>
                {""}
              </option>
              {years.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleButton}
            variant="contained"
            color="primary"
            disabled={!formCompleted}
          >
            <CreateOutlined />
            <p className="btn-text-ajusted">Gerar Relatório</p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

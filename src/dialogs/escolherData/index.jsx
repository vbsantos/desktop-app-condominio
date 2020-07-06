import React, { useState } from "react";
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
import FormEscolherData from "../../forms/escolherData";

// MATERIAL UI ICONS
import { CreateOutlined } from "@material-ui/icons";

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

  // all system data
  const [data, setData] = props.data;

  const [datePicked, setDatePicked] = props.picked;

  // Report Date
  const [date, setDate] = useState({
    mes: "",
    ano: "",
    competencia: "",
    emissao: "",
    vencimento: "",
  });

  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = useState(false);

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDatePicked(false);
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    setData({
      ...data,
      reportDate: {
        mes: date.mes,
        ano: date.ano,
        competencia: date.competencia,
        emissao: date.emissao,
        vencimento: date.vencimento,
      },
    });
    setDatePicked(true);
    setDialog(false);
  }

  return (
    <div id="dialogRegistrarDespesaFixa">
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
          Gerar relatórios referentes à
        </DialogTitle>
        <DialogContent>
          <FormEscolherData
            date={[date, setDate]}
            completed={[formCompleted, setFormCompleted]}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
            disabled={!formCompleted}
          >
            <CreateOutlined />
            Gerar Relatórios
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

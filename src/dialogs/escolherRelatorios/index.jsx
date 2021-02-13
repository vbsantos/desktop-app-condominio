import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

// MATERIAL UI COMPONENTS
import {
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";

// FORM COMPONENTS
import FormReports from "../../forms/escolherRelatorios";

// MATERIAL UI ICONS
import { PrintOutlined } from "@material-ui/icons";

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
  const { reportsObjRef } = props;
  const { infosRef } = props;

  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = useState(false);

  const [reportOptions, setReportOptions] = useState({
    ra:
      Object.keys(reportsObjRef).includes("ra") && reportsObjRef.ra !== null
        ? false
        : null,
    rfr:
      Object.keys(reportsObjRef).includes("rfr") && reportsObjRef.rfr !== null
        ? false
        : null,
    rg:
      Object.keys(reportsObjRef).includes("rg") && reportsObjRef.rg !== null
        ? false
        : null,
    ris:
      Object.keys(reportsObjRef).includes("ris") && reportsObjRef.ris !== null
        ? false
        : null,
    rr:
      Object.keys(reportsObjRef).includes("rr") && reportsObjRef.rr !== null
        ? false
        : null,
  });

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // TODO alterar essa parte ao implementar 'gerações de relatórios'
  // function that runs when you click the right button
  async function handleRightButton() {
    if (reportsObjRef.rg && reportsObjRef.ris) {
      await window.ipcRenderer.invoke("files", {
        method: "generateAllReports",
        content: {
          base64Reports: reportsObjRef,
          infos: infosRef,
          generate: reportOptions,
        },
      });
    } else if (reportsObjRef.ris) {
      window.ipcRenderer.invoke("files", {
        method: "generateIndividualReport",
        content: { ris: reportsObjRef.ris, generate: reportOptions },
      });
    } else {
      // reportsObjRef.rg
      window.ipcRenderer.invoke("files", {
        method: "generateGeneralReport",
        content: {
          rg: reportsObjRef.rg,
          rr: reportsObjRef.rr,
          ra: reportsObjRef.ra,
          rfr: reportsObjRef.rfr,
          generate: reportOptions,
        },
      });
    }
    setDialog(false);
  }

  return (
    <div id="dialogEscolherRelatorios">
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
          Selecione os relatórios que deseja gerar cópias em PDF
        </DialogTitle>

        <DialogContent>
          <FormReports
            reports={[reportOptions, setReportOptions]}
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
            FECHAR
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
            disabled={!formCompleted}
          >
            <PrintOutlined />
            <p className="btn-text-ajusted">SALVAR</p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

// MATERIAL UI COMPONENTS
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  FormControl,
  InputLabel,
  Input
} from "@material-ui/core";

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
  const [condominio, setCondominio] = useState({});

  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = useState(false);

  // condominio must belong to a beneficiario
  const beneficiario = props.beneficiario || { id: -1 };

  // if this dialog is for edition not for creation
  const condominioAntigo = props.condominio || {
    id: "",
    nome: "",
    cep: "",
    uf: "",
    localidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    beneficiarioId: beneficiario.id
  };

  // form reference
  const formEl = useRef();

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    if (condominioAntigo.id === "") {
      const response = await window.ipcRenderer.invoke("condominios", {
        method: "create",
        content: condominio
      });
      console.log("Condomínio Cadastrado:", response);
    } else {
      const response = await window.ipcRenderer.invoke("condominios", {
        method: "update",
        content: condominio
      });
      console.log("Condomínio Editado:", response);
    }

    setDialog(false);
  }

  // function that runs each time there is a change in the form
  function changedForm() {
    const formList = [...formEl.current.elements];
    const completed = formList.filter(f => f.value === "")[0] === undefined;
    setCondominio({
      id: condominioAntigo.id,
      nome: formList[0].value,
      cep: formList[1].value,
      uf: formList[2].value,
      localidade: formList[3].value,
      bairro: formList[4].value,
      logradouro: formList[5].value,
      numero: formList[6].value,
      beneficiarioId: condominioAntigo.beneficiarioId || beneficiario.id
    });
    setFormCompleted(completed);
  }

  return (
    <div id="dialogRegistrarBeneficiario">
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
          Cadastrar Novo Condomínio
        </DialogTitle>
        <DialogContent>
          <form ref={formEl} onChange={() => changedForm()} id="formCondominio">
            <section>
              <DialogContentText color="inherit">
                Informações do Condomínio
              </DialogContentText>
              <FormControl>
                <InputLabel htmlFor="nome">Nome</InputLabel>
                <Input
                  defaultValue={condominioAntigo.nome}
                  id="nome"
                  type="text"
                ></Input>
              </FormControl>
            </section>
            <section>
              <DialogContentText color="inherit">Endereço</DialogContentText>
              <FormControl>
                <InputLabel htmlFor="cep">CEP</InputLabel>
                <Input
                  defaultValue={condominioAntigo.cep}
                  id="cep"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="uf">UF</InputLabel>
                <Input
                  defaultValue={condominioAntigo.uf}
                  id="uf"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="localidade">Localidade</InputLabel>
                <Input
                  defaultValue={condominioAntigo.localidade}
                  id="localidade"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="bairro">Bairro</InputLabel>
                <Input
                  defaultValue={condominioAntigo.bairro}
                  id="bairro"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="logradouro">Logradouro</InputLabel>
                <Input
                  defaultValue={condominioAntigo.logradouro}
                  id="logradouro"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="numero">Número</InputLabel>
                <Input
                  defaultValue={condominioAntigo.numero}
                  id="numero"
                  type="text"
                ></Input>
              </FormControl>
            </section>
          </form>
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
            variant="outlined"
            color="primary"
            disabled={!formCompleted}
          >
            {condominioAntigo.id === "" ? "Cadastrar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

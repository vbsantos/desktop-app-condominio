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
  const [beneficiario, setBeneficiario] = useState({});

  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = useState(false);

  // if this dialog is for edition not for creation
  const beneficiarioAntigo = props.beneficiario || {
    id: "",
    nome: "",
    cprf: "",
    token_acesso: "",
    token_conta: "",
    cep: "",
    uf: "",
    localidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: ""
  };

  // form reference
  const formEl = useRef();

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    if (beneficiarioAntigo.id === "") {
      const response = await window.ipcRenderer.invoke("beneficiarios", {
        method: "create",
        content: beneficiario
      });
      console.log("Beneficiário Cadastrado:", response);
    } else {
      const response = await window.ipcRenderer.invoke("beneficiarios", {
        method: "update",
        content: beneficiario
      });
      console.log("Beneficiário Editado:", response);
    }
    setDialog(false);
  }

  // function that runs each time there is a change in the form
  function changedForm() {
    const formList = [...formEl.current.elements];
    const completed = formList.filter(f => f.value === "")[0] === undefined;
    setBeneficiario({
      id: beneficiarioAntigo.id,
      nome: formList[0].value,
      cprf: formList[1].value,
      token_acesso: formList[2].value,
      token_conta: formList[3].value,
      cep: formList[4].value,
      uf: formList[5].value,
      localidade: formList[6].value,
      bairro: formList[7].value,
      logradouro: formList[8].value,
      numero: formList[9].value,
      complemento: formList[10].value
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
          Cadastrar Novo Beneficiário
        </DialogTitle>
        <DialogContent>
          <form ref={formEl} onChange={changedForm}>
            <section>
              <DialogContentText color="inherit">
                Informações Pessoais
              </DialogContentText>
              <FormControl>
                <InputLabel htmlFor="nome">Nome</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.nome}
                  id="nome"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="cprf">CPF/CNPJ</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.cprf}
                  id="cprf"
                  type="text"
                ></Input>
              </FormControl>
            </section>
            <section>
              <DialogContentText color="inherit">
                Boleto.Cloud
              </DialogContentText>
              <FormControl>
                <InputLabel htmlFor="tokenAcesso">Token Acesso</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.token_acesso}
                  id="tokenAcesso"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="tokenConta">Token Conta</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.token_conta}
                  id="tokenConta"
                  type="text"
                ></Input>
              </FormControl>
            </section>
            <section>
              <DialogContentText color="inherit">Endereço</DialogContentText>
              <FormControl>
                <InputLabel htmlFor="cep">CEP</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.cep}
                  id="cep"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="uf">UF</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.uf}
                  id="uf"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="localidade">Localidade</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.localidade}
                  id="localidade"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="bairro">Bairro</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.bairro}
                  id="bairro"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="logradouro">Logradouro</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.logradouro}
                  id="logradouro"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="numero">Número</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.numero}
                  id="numero"
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="complemento">Complemento</InputLabel>
                <Input
                  defaultValue={beneficiarioAntigo.complemento}
                  id="complemento"
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
            {beneficiarioAntigo.id === "" ? "Cadastrar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

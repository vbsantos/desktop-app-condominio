import React, { useState } from "react";
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
  const [formCompleted, setFormCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    setLoading(true);
    const response = await window.ipcRenderer.invoke("beneficiarios", {
      method: "create",
      content: beneficiario
    });
    console.log("Beneficiário Cadastrado:", response);
    setDialog(false);
  }

  // function that runs each time there is a change in the form
  function changedForm() {
    const form = document.getElementsByTagName("form")[0];
    const formList = Array.from(form);
    const completed = formList.filter(f => f.value === "")[0] === undefined;
    setBeneficiario({
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
          <form onChange={changedForm}>
            <section>
              <DialogContentText color="inherit">
                Informações Pessoais
              </DialogContentText>
              <FormControl>
                <InputLabel htmlFor="nome">Nome</InputLabel>
                <Input autoFocus id="nome" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="cprf">CPF/CNPJ</InputLabel>
                <Input id="cprf" type="text"></Input>
              </FormControl>
            </section>
            <section>
              <DialogContentText color="inherit">
                Boleto.Cloud
              </DialogContentText>
              <FormControl>
                <InputLabel htmlFor="tokenAcesso">Token Acesso</InputLabel>
                <Input id="tokenAcesso" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="tokenConta">Token Conta</InputLabel>
                <Input id="tokenConta" type="text"></Input>
              </FormControl>
            </section>
            <section>
              <DialogContentText color="inherit">Endereço</DialogContentText>
              <FormControl>
                <InputLabel htmlFor="cep">CEP</InputLabel>
                <Input id="cep" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="uf">UF</InputLabel>
                <Input id="uf" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="localidade">Localidade</InputLabel>
                <Input id="localidade" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="bairro">Bairro</InputLabel>
                <Input id="bairro" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="logradouro">Logradouro</InputLabel>
                <Input id="logradouro" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="numero">Número</InputLabel>
                <Input id="numero" type="text"></Input>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="complemento">Complemento</InputLabel>
                <Input id="complemento" type="text"></Input>
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
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

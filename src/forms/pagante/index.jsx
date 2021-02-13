import React, { useRef, useState } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Grid,
} from "@material-ui/core";

export default function FormPagante(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [pagante, setPagante] = props.pagante;

  // pagante must belong to a condominio
  const { condominio } = props;

  // form reference
  const formRef = useRef(null);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    const fracao = formList[4].value.replace(",", ".");
    const leituraAgua = formList[6].value.replace(",", ".");
    const unidadeComercial = formList[7].checked;
    setPagante({
      id: pagante.id,
      nome: formList[0].value,
      email: formList[1].value,
      telefone: formList[2].value,
      complemento: formList[3].value,
      fracao,
      box: formList[5].value,
      leituraAgua,
      unidadeComercial,
      condominioId: condominio.id,
    });
    setFormCompleted(
      formList[0].value !== "" &&
        formList[3].value !== "" &&
        fracao !== "" &&
        leituraAgua !== "" &&
        Number(fracao) > 0 &&
        Number(fracao) <= 1 &&
        Number(leituraAgua) >= 0
    );
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações do Condômino
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome *</InputLabel>
          <Input
            title="Nome do atual dono do Apartamento"
            autoFocus
            defaultValue={pagante.nome}
            id="nome"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="email">E-mail</InputLabel>
          <Input
            title="E-mail do atual dono do Apartamento"
            defaultValue={pagante.email}
            id="email"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="telefone">Telefone</InputLabel>
          <Input
            title="Telefone do atual dono do Apartamento"
            defaultValue={pagante.telefone}
            id="telefone"
          ></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">
          Informações do Apartamento
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="complemento">Número do apartamento *</InputLabel>
          <Input
            title="Número identificador do Apartamento"
            defaultValue={pagante.complemento}
            id="complemento"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="fracao">Fração *</InputLabel>
          <Input
            title="Entre 0 e 1"
            defaultValue={pagante.fracao}
            id="fracao"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="box">Box</InputLabel>
          <Input
            title="Box que pertencem ao apartamento"
            defaultValue={pagante.box}
            id="box"
          ></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">
          Última Leitura de água
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="leituraAgua">Leitura da Água *</InputLabel>
          <Input
            title="Valor no medidor de água (m³)"
            defaultValue={pagante.leituraAgua}
            id="leituraAgua"
          ></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">Tipo de Unidade</DialogContentText>
        <FormGroup>
          <Typography component="div">
            <Grid container justify="center" alignItems="center" spacing={1}>
              <Grid item xs>
                Residencial
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  style={{ marginRight: "-10px" }}
                  control={
                    <Switch
                      value="cb1"
                      checked={pagante.unidadeComercial}
                      color="primary"
                    />
                  }
                />
              </Grid>
              <Grid item xs>
                Comercial
              </Grid>
            </Grid>
          </Typography>
        </FormGroup>
      </section>

      {/* FEEDBACK */}
      {!formCompleted && (
        <DialogContent>
          {pagante.id === ""
            ? "É necessário preencher os campos obrigatórios (*) para incluir"
            : "É necessário modificar algum campo para salvar"}
        </DialogContent>
      )}
    </form>
  );
}

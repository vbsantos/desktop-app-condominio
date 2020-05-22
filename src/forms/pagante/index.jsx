import React, { useRef, useState } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
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
    const fracao = formList[2].value.replace(",", ".");
    const leituraAgua = formList[3].value.replace(",", ".");
    setPagante({
      id: pagante.id,
      nome: formList[0].value,
      complemento: formList[1].value,
      fracao,
      leituraAgua,
      condominioId: condominio.id,
    });
    // não permite fração que não seja entre 0 e 1
    // não permite registro de água menor que 0
    setFormCompleted(
      formList.find((f) => f.value === "") === undefined &&
        fracao > 0 &&
        fracao <= 1 &&
        leituraAgua >= 0
    );
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações do Condômino
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome</InputLabel>
          <Input
            title="Nome do atual dono do Apartamento"
            autoFocus
            defaultValue={pagante.nome}
            id="nome"
          ></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">
          Informações do Apartamento
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="complemento">Número do apartamento</InputLabel>
          <Input
            title="Número identificador do Apartamento"
            defaultValue={pagante.complemento}
            id="complemento"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="fracao">Fração</InputLabel>
          <Input
            title="Entre 0 e 1"
            defaultValue={pagante.fracao}
            id="fracao"
          ></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">
          Última Leitura de água Contabilizado
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="leituraAgua">Leitura da Água</InputLabel>
          <Input
            title="Valor no medidor de água (m³)"
            defaultValue={pagante.leituraAgua}
            id="leituraAgua"
          ></Input>
        </FormControl>
      </section>

      {/* FEEDBACK */}
      {!formCompleted && (
        <DialogContent>
          {pagante.id === ""
            ? "É necessário preencher todos os campos para cadastrar"
            : "É necessário modificar algum campo para salvar"}
        </DialogContent>
      )}
    </form>
  );
}

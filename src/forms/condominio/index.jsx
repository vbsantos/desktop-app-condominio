import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input
} from "@material-ui/core";

export default function FormCondominio(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [condominio, setCondominio] = props.condominio;

  // condominio must belong to a beneficiario
  const { beneficiario } = props;

  // form reference
  const formRef = useRef(null);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    setCondominio({
      id: condominio.id,
      nome: formList[0].value,
      cep: formList[1].value,
      uf: formList[2].value,
      localidade: formList[3].value,
      bairro: formList[4].value,
      logradouro: formList[5].value,
      numero: formList[6].value,
      beneficiarioId: beneficiario.id
    });
    setFormCompleted(formList.filter(f => f.value === "")[0] === undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações do Condomínio
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome</InputLabel>
          <Input autoFocus defaultValue={condominio.nome} id="nome"></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">Endereço</DialogContentText>
        <FormControl>
          <InputLabel htmlFor="cep">CEP</InputLabel>
          <Input defaultValue={condominio.cep} id="cep"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="uf">UF</InputLabel>
          <Input defaultValue={condominio.uf} id="uf"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="localidade">Localidade</InputLabel>
          <Input defaultValue={condominio.localidade} id="localidade"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="bairro">Bairro</InputLabel>
          <Input defaultValue={condominio.bairro} id="bairro"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="logradouro">Logradouro</InputLabel>
          <Input defaultValue={condominio.logradouro} id="logradouro"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="numero">Número</InputLabel>
          <Input defaultValue={condominio.numero} id="numero"></Input>
        </FormControl>
      </section>
    </form>
  );
}

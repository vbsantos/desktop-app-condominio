import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input
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
    setPagante({
      id: pagante.id,
      nome: formList[0].value,
      cprf: formList[1].value,
      email: formList[2].value,
      complemento: formList[3].value,
      fracao: formList[4].value.replace(",", "."),
      leituraAgua: formList[5].value.replace(",", "."),
      condominioId: condominio.id
    });
    setFormCompleted(formList.filter(f => f.value === "")[0] === undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações Pessoais
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome</InputLabel>
          <Input autoFocus defaultValue={pagante.nome} id="nome"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="cprf">CPF</InputLabel>
          <Input defaultValue={pagante.cprf} id="cprf"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input defaultValue={pagante.email} type="email" id="email"></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">
          Informações Relativas ao condomínio
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="complemento">Número do apartamento</InputLabel>
          <Input defaultValue={pagante.complemento} id="complemento"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="fracao">Fração</InputLabel>
          <Input defaultValue={pagante.fracao} id="fracao"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="leituraAgua">Leitura da Água</InputLabel>
          <Input defaultValue={pagante.leituraAgua} id="leituraAgua"></Input>
        </FormControl>
      </section>
    </form>
  );
}

import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input,
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
      leituraAgua: formList[1].value.replace(",", "."),
      beneficiarioId: beneficiario.id,
    });
    setFormCompleted(formList.filter((f) => f.value === "")[0] === undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <FormControl>
        <InputLabel htmlFor="nome">Nome</InputLabel>
        <Input autoFocus defaultValue={condominio.nome} id="nome"></Input>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="leituraAgua">
          Último registro de água contabilizado
        </InputLabel>
        <Input defaultValue={condominio.leituraAgua} id="leituraAgua"></Input>
      </FormControl>
    </form>
  );
}

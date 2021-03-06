import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  FormControl,
  DialogContent,
  DialogContentText,
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
      endereco: formList[1].value,
      beneficiarioId: beneficiario.id,
    });
    setFormCompleted(formList[0].value !== "");
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações do Condomínio
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome *</InputLabel>
          <Input autoFocus defaultValue={condominio.nome} id="nome"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="endereco">Endereço</InputLabel>
          <Input defaultValue={condominio.endereco} id="endereco"></Input>
        </FormControl>
      </section>

      {/* FEEDBACK */}
      {!formCompleted && (
        <DialogContent>
          {condominio.id === ""
            ? "É necessário preencher os campos obrigatórios (*) para cadastrar"
            : "É necessário modificar algum campo para salvar"}
        </DialogContent>
      )}
    </form>
  );
}

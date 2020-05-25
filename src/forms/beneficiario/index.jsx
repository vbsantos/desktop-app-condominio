import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";

export default function FormBeneficiario(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [beneficiario, setBeneficiario] = props.beneficiario;

  // form reference
  const formRef = useRef(null);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    setBeneficiario({
      id: beneficiario.id,
      nome: formList[0].value,
      email: formList[1].value,
      telefone: formList[2].value,
    });
    // setFormCompleted(formList.find((f) => f.value === "") === undefined);
    setFormCompleted(formList[0].value !== "");
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações do Administrador
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome *</InputLabel>
          <Input autoFocus defaultValue={beneficiario.nome} id="nome"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="email">E-mail</InputLabel>
          <Input defaultValue={beneficiario.email} id="email"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="telefone">Telefone</InputLabel>
          <Input defaultValue={beneficiario.telefone} id="telefone"></Input>
        </FormControl>
      </section>

      {/* FEEDBACK */}
      {!formCompleted && (
        <DialogContent>
          {beneficiario.id === ""
            ? "É necessário preencher os campos obrigatórios (*) para cadastrar"
            : "É necessário modificar algum campo para salvar"}
        </DialogContent>
      )}
    </form>
  );
}

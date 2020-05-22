import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import { FormControl, InputLabel, Input } from "@material-ui/core";

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
    });
    setFormCompleted(formList.find((f) => f.value === "") === undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <FormControl>
        <InputLabel htmlFor="nome">Nome</InputLabel>
        <Input autoFocus defaultValue={beneficiario.nome} id="nome"></Input>
      </FormControl>
    </form>
  );
}

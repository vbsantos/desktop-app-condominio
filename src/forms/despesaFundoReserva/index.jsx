import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import { FormControl, InputLabel, Input } from "@material-ui/core";

export default function FormDespesaFundoReserva(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [despesa, setDespesa] = props.despesa;

  // despesa must belong to a condominio
  const { condominio } = props;

  // form reference
  const formRef = useRef(null);

  // function that runs each time there is a change in the form
  function formOnChange() {
    const formList = [...formRef.current.elements];

    const porcentagemString = formList[0].value
      .replace(",", ".")
      .replace("%", "")
      .replace(" ", "");

    setDespesa({
      id: despesa.id,
      nome: "",
      categoria: "",
      agua: null,
      aguaIndividual: false,
      rateioAutomatico: true,
      permanente: false,
      fundoReserva: true,
      valor: porcentagemString,
      parcelaAtual: "",
      numParcelas: "",
      Valores: [],
      condominioId: condominio.id,
    });

    setFormCompleted(
      porcentagemString !== "" && Number(porcentagemString) >= 0
    );
  }

  return (
    <div>
      <form ref={formRef} onChange={formOnChange}>
        <FormControl>
          <InputLabel htmlFor="porcentagem">Porcentagem (%) *</InputLabel>
          <Input
            autoFocus
            defaultValue={despesa.valor}
            id="porcentagem"
          ></Input>
        </FormControl>
      </form>
    </div>
  );
}

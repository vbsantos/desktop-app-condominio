import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import { FormControl, TextField } from "@material-ui/core";

// CSS
import "./style.css";

export default function FormDespesa(props) {
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
    // console.log("INFORMACAO FORM LIST:", formList);

    const texto = formList[0].value;

    setDespesa({
      id: despesa.id,
      nome: texto,
      categoria: "",
      agua: null,
      aguaIndividual: false,
      rateioAutomatico: false,
      permanente: true,
      fundoReserva: false,
      valor: "",
      parcelaAtual: null,
      numParcelas: null,
      informacao: true,
      ativa: despesa.ativa,
      Valores: [],
      condominioId: condominio.id,
    });

    setFormCompleted(texto !== "" && texto.length <= 255);
  }

  return (
    <section>
      <form ref={formRef} onChange={formOnChange}>
        <FormControl>
          <TextField
            autoFocus
            id="nome"
            label="Informação *"
            multiline
            rows={5}
            defaultValue={despesa.nome}
          />
        </FormControl>
      </form>
    </section>
  );
}

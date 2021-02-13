import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";

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

    const test = (input) => input !== "" && Number(input) >= 0;

    const porcentagemString = formList[1].value
      .replace(",", ".")
      .replace("%", "")
      .replace(" ", "");

    const goodInput = test(porcentagemString);

    setDespesa({
      id: despesa.id,
      nome: goodInput
        ? `Fundo Reserva - ${porcentagemString}%`
        : "Fundo Reserva",
      categoria: "",
      agua: null,
      aguaIndividual: false,
      rateioAutomatico: true,
      permanente: true,
      fundoReserva: true,
      valor: porcentagemString,
      parcelaAtual: null,
      numParcelas: null,
      informacao: false,
      ativa: despesa.ativa,
      Valores: [],
      condominioId: condominio.id,
    });

    setFormCompleted(goodInput);
  }

  return (
    <div>
      <form ref={formRef} onChange={formOnChange}>
        {/* INFORMAÇÕES DA DESPESA */}
        <section>
          <DialogContentText key={"despesaTitle"} color="inherit">
            Informações da Despesa
          </DialogContentText>
          <FormControl>
            <InputLabel htmlFor="nome">Nome</InputLabel>
            <Input
              defaultValue={"Fundo Reserva"}
              disabled={true}
              id="nome"
            ></Input>
          </FormControl>
        </section>

        <section>
          <DialogContentText key={"despesaTitle"} color="inherit">
            Valor
          </DialogContentText>
          <FormControl>
            <InputLabel htmlFor="porcentagem">Porcentagem (%) *</InputLabel>
            <Input
              autoFocus
              defaultValue={despesa.valor}
              id="porcentagem"
            ></Input>
          </FormControl>
        </section>
      </form>
    </div>
  );
}

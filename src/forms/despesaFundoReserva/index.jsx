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

    const porcentagemString = formList[2].value
      .replace(",", ".")
      .replace("%", "")
      .replace(" ", "");

    setDespesa({
      id: despesa.id,
      nome: "Fundo Reserva",
      categoria: formList[1].value,
      agua: null,
      aguaIndividual: false,
      rateioAutomatico: true,
      permanente: true,
      fundoReserva: true,
      valor: porcentagemString,
      parcelaAtual: null,
      numParcelas: null,
      informacao: false,
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
          <FormControl>
            <InputLabel htmlFor="categoria">Categoria *</InputLabel>
            <Input
              autoFocus
              defaultValue={despesa.categoria}
              id="categoria"
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

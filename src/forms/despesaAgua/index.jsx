import React, { useRef, useState } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";

// CSS
import "./style.css";

export default function FormDespesa(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [despesa, setDespesa] = props.despesa;
  console.log("despesa:", despesa);

  // despesa secudaria de agua
  const [despesa2, setDespesa2] = props.despesa2;
  console.log("despesa2:", despesa2);

  // store despesa2 value
  const [valor2, setValor2] = useState(despesa2.valor);

  // stores all individual values in case of !rateioAuto
  const [valores, setValores] = props.valores;

  // despesa must belong to a condominio
  const { condominio } = props;

  // form reference
  const formRef = useRef(null);

  const wrongValues = (fields) => {
    const condition = (value) => {
      return Number(value) >= 0;
    };
    return fields.reduce((acc, field) => {
      return acc && condition(field.value.replace(",", ".").substring(3));
    }, true);
  };

  // function that runs each time there is a change in the form
  function formOnChange() {
    const formList = [...formRef.current.elements];
    const valoresList = formList.slice(2);
    const precoAguaField = valoresList[0];
    const precoAgua = Number(precoAguaField.value.replace(",", "."));

    // fields registros de água individuais
    const registrosIndividuaisFields = valoresList.filter((field) =>
      field.id.includes("aguaIndividual")
    );

    // fields valores de água individuais
    const valoresIndividuaisFields = valoresList.filter((field) =>
      field.id.includes("valorAguaIndividual")
    );

    // array com registros individuais anteriores
    const registrosIndividuaisAnteriores = registrosIndividuaisFields.map(
      (registroIndividualAtual) => {
        const pagante_id = Number(registroIndividualAtual.id.slice(14));
        const registroAnterior = condominio["Pagantes"].find(
          (pagante) => pagante.id === pagante_id
        ).leituraAgua;
        return registroAnterior;
      }
    );

    // registro de água geral que entra no condominio
    const registroGeralAtual = valoresList[1].value.replace(",", ".");

    // registro de água geral anterior
    const registroGeralAnterior = condominio.leituraAgua;

    // registro de água geral só desse mês
    const registroGeralConsumo = registroGeralAtual - registroGeralAnterior;

    const registroIndividualAtual = registrosIndividuaisFields.reduce(
      (acc, field) => {
        return +acc + +field.value.replace(",", ".");
      },
      0
    );

    const registroIndividualAnterior = registrosIndividuaisAnteriores.reduce(
      (acc, item) => {
        return +acc + +item;
      },
      0
    );

    const registroIndividualConsumo =
      registroIndividualAtual - registroIndividualAnterior;

    const consumoComum = registroGeralConsumo - registroIndividualConsumo;

    setValor2(function () {
      const precoComum = consumoComum * precoAgua;
      valoresList[2].value = "R$ " + precoComum.toFixed(2);
      return precoComum;
    });

    setValores(
      (function () {
        return registrosIndividuaisFields.map((valoraguafield, index) => {
          const leituraAguaAtual = valoraguafield.value.replace(",", ".");
          const paganteId = Number(valoraguafield.id.slice(14));
          const leituraAguaAntiga = condominio["Pagantes"].find(
            (pagante) => pagante.id === paganteId
          ).leituraAgua;
          const leituraAguaNova =
            Number(leituraAguaAtual) - Number(leituraAguaAntiga);
          const valor = Number(leituraAguaNova * precoAgua).toFixed(2);
          valoresIndividuaisFields[index].value = "R$ " + valor;
          return {
            id:
              valores.length > 0 && valores[0].id !== ""
                ? valores.find(
                    (valor) =>
                      valor.paganteId === paganteId &&
                      valor.despesaId === despesa.id
                  ).id
                : "",
            precoAgua: precoAgua,
            agua: leituraAguaAtual,
            valor,
            paganteId,
            despesaId: despesa.id,
          };
        });
      })()
    );

    setDespesa({
      id: despesa.id,
      nome: "Consumo de Água - Individual",
      categoria: formList[1].value,
      agua: registroIndividualAtual,
      aguaIndividual: true,
      rateioAutomatico: false,
      permanente: true,
      fundoReserva: false,
      valor: (+registroIndividualConsumo * +precoAgua).toFixed(2),
      parcelaAtual: null,
      numParcelas: null,
      Valores: valores,
      condominioId: condominio.id,
    });

    setDespesa2({
      id: despesa2.id,
      nome: "Consumo de Água - Área Comum",
      categoria: formList[1].value,
      agua: registroGeralAtual,
      aguaIndividual: true,
      rateioAutomatico: true,
      permanente: true,
      fundoReserva: false,
      valor: (+consumoComum * +precoAgua).toFixed(2),
      parcelaAtual: null,
      numParcelas: null,
      Valores: [],
      condominioId: condominio.id,
    });

    // console.warn(valor2 > 0 && wrongValues(valoresIndividuaisFields)); // FIXME avisar valores negativos

    setFormCompleted(
      formList.find((field) => !field.disabled && field.value === "") ===
        undefined
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
              autoFocus
              defaultValue={"Consumo de Água"}
              disabled={true}
              id="nome"
            ></Input>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="categoria">Categoria</InputLabel>
            <Input defaultValue={despesa.categoria} id="categoria"></Input>
          </FormControl>
        </section>

        {/* VALORES */}
        <section>
          <DialogContentText key={"valoresTitle"} color="inherit">
            Valor Unitário da Água
          </DialogContentText>
          <FormControl key={"valorAguaForm"}>
            <InputLabel htmlFor={"valorAguaLabel"}>
              Valor do m³ da água
            </InputLabel>
            <Input
              defaultValue={
                valores.length > 0 && valores[0].id !== ""
                  ? String(valores[0].precoAgua)
                  : ""
              }
              id={"valorAguaCondominio"}
            ></Input>
          </FormControl>
        </section>

        {/* REGISTRO AGUA GERAL */}
        <section>
          <DialogContentText key={"valoresTitle"} color="inherit">
            Leitura de água atual do Condomínio
          </DialogContentText>
          <div id="containerAgua">
            <div id="esquerdaAgua">
              <FormControl key={"aguaComumForm"}>
                <InputLabel>Leitura de água Geral</InputLabel>
                <Input
                  id={"aguaComum"}
                  defaultValue={despesa2.id ? despesa2.agua : ""}
                ></Input>
              </FormControl>
            </div>
            <div id="direitaAgua">
              <FormControl key={"valorAguaComumForm"}>
                <InputLabel>Custo para o Condomínio</InputLabel>
                <Input
                  id={"valorAguaComum"}
                  defaultValue={
                    despesa2.id ? "R$ " + Number(valor2).toFixed(2) : " "
                  }
                  disabled={true}
                ></Input>
              </FormControl>
            </div>
          </div>
        </section>

        {/* REGISTRO AGUA INDIVIDUAL */}
        <section>
          <DialogContentText key={"valoresTitle"} color="inherit">
            Leituras de Água Individuais atuais dos Condôminos
          </DialogContentText>
          <div id="containerAgua">
            <div id="esquerdaAgua">
              {condominio["Pagantes"].map((pagante) => (
                <FormControl key={"aguaIndividualForm" + pagante.id}>
                  <InputLabel htmlFor={"aguaIndividual" + pagante.id}>
                    Leitura de água do {pagante.complemento}
                  </InputLabel>
                  <Input
                    id={"aguaIndividual" + pagante.id}
                    defaultValue={
                      valores.length > 0 && valores[0].id !== ""
                        ? String(
                            valores.find(
                              (valorIndividual) =>
                                valorIndividual["paganteId"] === pagante.id
                            ).agua
                          )
                        : ""
                    }
                  ></Input>
                </FormControl>
              ))}
            </div>
            <div id="direitaAgua">
              {condominio["Pagantes"].map((pagante) => (
                <FormControl key={"aguaIndividualForm" + pagante.id}>
                  <InputLabel>Custo para {pagante.complemento}</InputLabel>
                  <Input
                    id={"valorAguaIndividual" + pagante.id}
                    defaultValue={
                      valores.length > 0 && valores[0].id !== ""
                        ? "R$ " +
                          Number(
                            valores.find(
                              (valor) => valor["paganteId"] === pagante.id
                            ).valor
                          ).toFixed(2)
                        : " "
                    }
                    disabled={true}
                  ></Input>
                </FormControl>
              ))}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

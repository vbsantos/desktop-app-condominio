import React, { useRef, useState } from "react";

// MATERIAL UI COMPONENTS
import { Autocomplete } from "@material-ui/lab";
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input,
  TextField,
} from "@material-ui/core";

// CSS
import "./style.css";

/**
 * registro condominio >= soma dos registros individuais
 * valor condominio > 0
 * valores individuais > 0
 */
const allValuesGood = (fields, consumoComum, precoAgua) => {
  const valoresIndividuaisPositivos = fields.reduce((acc, field) => {
    return acc && field.value.replace(",", ".").substring(3) >= 0;
  }, true);
  return valoresIndividuaisPositivos && consumoComum >= 0 && precoAgua > 0;
};

export default function FormDespesa(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [despesa, setDespesa] = props.despesa;

  // despesa secudaria de agua
  const [despesa2, setDespesa2] = props.despesa2;

  // store despesa2 value REVIEW
  const [valor2, setValor2] = useState(despesa2.valor);

  // stores all individual values in case of !rateioAuto
  const [valores, setValores] = props.valores;

  // despesa must belong to a condominio
  const { condominio } = props;

  // form reference
  const formRef = useRef(null);

  // todas as categorias
  const options = [
    ...new Set(
      condominio["Despesas"]
        .filter(({ categoria }) => categoria !== "")
        .map(({ categoria }) => categoria)
        .sort()
    ),
  ];

  let [validForm, setValidForm] = useState(false);

  // function that runs each time there is a change in the form
  function formOnChange(event, nome_categoria = null) {
    const formList = [...formRef.current.elements];
    formList.splice(2, 1);
    const valoresList = formList.slice(5);

    const precoAguaResidencial = Number(formList[2].value.replace(",", "."));

    const precoAguaComercial = Number(formList[3].value.replace(",", "."));

    const valorTotalDespesaResidencial = Number(
      formList[4].value.replace(",", ".")
    );
    const valorTotalDespesaComercial = Number(
      formList[5].value.replace(",", ".")
    );

    // fields registros de água individuais
    const registrosIndividuaisFields = valoresList.filter((field) =>
      field.id.includes("aguaIndividual")
    );

    // fields valores de água individuais
    const valoresIndividuaisFields = valoresList.filter((field) =>
      field.id.includes("valorAguaIndividual")
    );

    // array com registros individuais anteriores
    const dadosPagantesAgua = registrosIndividuaisFields.map(
      (registroIndividualAtual) => {
        const paganteId = Number(registroIndividualAtual.id.slice(14));
        const pagante = condominio["Pagantes"].find(
          (pagante) => pagante.id === paganteId
        );
        const unidadeComercial = pagante.unidadeComercial;
        const leituraAnterior = pagante.leituraAgua;
        const leituraAtual = registrosIndividuaisFields
          .find((field) => field.id === `aguaIndividual${pagante.id}`)
          .value.replace(",", ".");
        const consumo = leituraAtual - leituraAnterior;
        const precoUnitario = unidadeComercial
          ? precoAguaComercial
          : precoAguaResidencial;
        // REVIEW removi os 10m³ de consumo mínimo
        // const valor = unidadeComercial
        // ? consumo < 10
        //   ? 10 * precoAguaComercial
        //   : consumo * precoAguaComercial
        // : consumo * precoAguaResidencial;
        const valor = unidadeComercial
          ? consumo * precoAguaComercial
          : consumo * precoAguaResidencial;
        valoresIndividuaisFields.find(
          (field) => field.id === `valorAguaIndividual${paganteId}`
        ).value = `R$ ${valor.toFixed(2)}`;
        return {
          paganteId: pagante.id,
          unidadeComercial,
          leituraAnterior,
          leituraAtual,
          consumo,
          precoUnitario,
          valor,
        };
      }
    );

    const newValores = dadosPagantesAgua.map((aguaIndividual) => {
      return {
        id:
          valores.length > 0 && valores[0].id !== ""
            ? valores.find(
                (valor) =>
                  valor.paganteId === aguaIndividual.paganteId &&
                  valor.despesaId === despesa.id
              ).id
            : "",
        precoAgua: aguaIndividual.precoUnitario,
        agua: aguaIndividual.leituraAtual,
        valor: aguaIndividual.valor,
        paganteId: aguaIndividual.paganteId,
        despesaId: despesa.id,
      };
    });

    // FIXME
    // const registroIndividualAtual = dadosPagantesAgua.reduce(
    //   (acc, pagante) => Number(acc) + Number(pagante.leituraAtual),
    //   0
    // );

    const valorTotalIndividual = dadosPagantesAgua.reduce(
      (acc, pagante) => Number(acc) + Number(pagante.valor),
      0
    );

    const new_categoria =
      nome_categoria === null ? formList[1].value : nome_categoria;

    const new_despesa_agua = {
      id: despesa.id,
      nome: "Consumo de Água - Individual",
      categoria: new_categoria,
      // agua: registroIndividualAtual, // FIXME não lembro pra qq serve
      agua: valorTotalDespesaResidencial,
      aguaIndividual: true,
      rateioAutomatico: false,
      permanente: true,
      fundoReserva: false,
      valor: valorTotalIndividual,
      parcelaAtual: null,
      numParcelas: null,
      informacao: false,
      ativa: despesa.ativa,
      Valores: newValores,
      condominioId: condominio.id,
    };

    const valorTotalComum =
      valorTotalDespesaResidencial +
      valorTotalDespesaComercial -
      valorTotalIndividual;

    const new_despesa_agua2 = {
      id: despesa2.id,
      nome: "Consumo de Água - Área Comum",
      categoria: new_categoria,
      agua: valorTotalDespesaComercial, // REVIEW gambiarra
      aguaIndividual: true,
      rateioAutomatico: true,
      permanente: true,
      fundoReserva: false,
      valor: valorTotalComum,
      parcelaAtual: null,
      numParcelas: null,
      informacao: false,
      ativa: despesa2.ativa,
      Valores: [],
      condominioId: condominio.id,
    };

    setValores(newValores);

    setDespesa(new_despesa_agua);
    // console.log("Despesa Água Primária:", despesa);
    setDespesa2(new_despesa_agua2);
    // console.log("Despesa Água Secundária:", despesa2);
    setFormCompleted(validForm && new_categoria !== "" && true);
    setValidForm(true);
  }

  const getOldUnitaryValue = (tipoUnidade) => {
    let paganteId;
    let valorUnitario;
    let unidade;
    let nulo = false;

    if (tipoUnidade === "comercial") {
      // comercial
      unidade = condominio["Pagantes"].find(
        (pagante) => pagante.unidadeComercial
      );
    } else {
      // residencial
      unidade = condominio["Pagantes"].find(
        (pagante) => !pagante.unidadeComercial
      );
    }
    if (unidade) {
      paganteId = unidade.id;
    } else {
      nulo = true;
    }

    valorUnitario = nulo
      ? "0.00"
      : valores.find((valor) => valor.paganteId === paganteId).precoAgua;

    return String(valorUnitario);
  };

  return (
    <div>
      <form ref={formRef} onChange={formOnChange}>
        {/* INFORMAÇÕES DA DESPESA */}
        <section>
          <DialogContentText color="inherit">
            Informações da Despesa
          </DialogContentText>
          <div id="containerAgua">
            <div id="esquerdaAgua">
              <FormControl>
                <InputLabel htmlFor="nome">Nome</InputLabel>
                <Input
                  defaultValue={"Consumo de Água"}
                  disabled={true}
                  id="nome"
                ></Input>
              </FormControl>
            </div>
            <div id="direitaAgua">
              <FormControl>
                <Autocomplete
                  id="categoria"
                  defaultValue={
                    despesa.categoria === "" ? null : despesa.categoria
                  }
                  onInputChange={formOnChange}
                  freeSolo
                  options={options}
                  style={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categoria *"
                      variant="standard"
                    />
                  )}
                />
              </FormControl>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section>
          <DialogContentText color="inherit">
            Valor Unitário da Água
          </DialogContentText>
          <div id="containerAgua">
            <div id="esquerdaAgua">
              <FormControl>
                <InputLabel htmlFor={"valorAguaLabel"}>
                  Valor do m³ Residencial *
                </InputLabel>
                <Input
                  defaultValue={
                    valores.length > 0 && valores[0].id !== ""
                      ? Number(getOldUnitaryValue("residencial")).toFixed(2)
                      : ""
                  }
                  id={"valorAguaResidencial"}
                ></Input>
              </FormControl>
            </div>
            <div id="direitaAgua">
              <FormControl>
                <InputLabel htmlFor={"valorAguaLabel"}>
                  Valor do m³ Comercial *
                </InputLabel>
                <Input
                  defaultValue={
                    valores.length > 0 && valores[0].id !== ""
                      ? Number(getOldUnitaryValue("comercial")).toFixed(2)
                      : ""
                  }
                  id={"valorAguaComercial"}
                ></Input>
              </FormControl>
            </div>
          </div>
        </section>

        {/* VALOR TOTAL DESPESA */}
        <section>
          <DialogContentText color="inherit">
            Custo da Despesa
          </DialogContentText>
          <div id="containerAgua">
            <div id="esquerdaAgua">
              <FormControl>
                <InputLabel htmlFor={"valorAguaLabel"}>
                  Total Residencial (R$) *
                </InputLabel>
                <Input
                  defaultValue={
                    despesa.id === "" ? "" : Number(despesa.agua).toFixed(2)
                  }
                  id={"valorDespesaResidencial"}
                ></Input>
              </FormControl>
            </div>
            <div id="direitaAgua">
              <FormControl>
                <InputLabel htmlFor={"valorAguaLabel"}>
                  Total Comercial (R$) *
                </InputLabel>
                <Input
                  defaultValue={
                    despesa.id === "" ? "" : Number(despesa2.agua).toFixed(2)
                  }
                  id={"valorDespesaComercial"}
                ></Input>
              </FormControl>
            </div>
          </div>
        </section>

        {/* REGISTRO AGUA INDIVIDUAL */}
        <section>
          <DialogContentText color="inherit">
            Leituras de Água Individuais atuais dos Condôminos
          </DialogContentText>
          <div id="containerAgua">
            <div id="esquerdaAgua">
              {condominio["Pagantes"].map((pagante) => (
                <FormControl key={"aguaIndividualForm" + pagante.id}>
                  <InputLabel htmlFor={"aguaIndividual" + pagante.id}>
                    Leitura de água do {pagante.complemento} *
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

import React, { useRef, useState, useEffect } from "react";

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

  // stores all individual values in case of !rateioAuto
  const [valores, setValores] = props.valores;

  // despesa must belong to a condominio
  const { condominio } = props;

  // stores the sum of all individual values in case of !rateioAuto
  const [valorTotal, setValorTotal] = useState(0);

  // form reference
  const formRef = useRef(null);

  // checkboxes
  const [despesaPermanente, setDespesaPermanente] = useState(true);
  const [rateioAuto, setRateioAuto] = useState(false);
  const [despesaAgua, setDespesaAgua] = useState(true);
  const [despesaFundoReserva, setDespesaFundoReserva] = useState(false);

  // function that runs each time there is a change in the form
  function formOnChange() {
    const formList = [...formRef.current.elements];
    // console.log("FORM LIST:", formList);
    const valoresList = formList.slice(2);
    // console.log("VALORES LIST:", valoresList);

    if (!rateioAuto) {
      let somaValorTotal = 0;
      setValores(
        (function () {
          const valorM3Agua = valoresList
            .filter((field) => field.id === "valorAguaCondominio")[0]
            .value.replace(",", ".");
          const valoresAgua = valoresList.filter((field) =>
            field.id.includes("aguaIndividual")
          );
          const valoresFinais = valoresList.filter((field) =>
            field.id.includes("valorAguaIndividual")
          );
          return valoresAgua.map((valoraguafield, index) => {
            const leituraAguaFormated = Number(
              valoraguafield.value.replace(",", ".")
            );
            const pagante_id = Number(valoraguafield.id.slice(14));
            const pagante_leituraAguaAntiga = condominio["Pagantes"].filter(
              (pagante) => pagante.id === pagante_id
            )[0].leituraAgua;
            const leituraAguaNova =
              leituraAguaFormated - Number(pagante_leituraAguaAntiga);
            const valor = Number(leituraAguaNova) * Number(valorM3Agua);
            somaValorTotal += valor;
            valoresFinais[index].value = "R$ " + valor.toFixed(2);
            return {
              id:
                valores.length > 0 && valores[0].id !== ""
                  ? valores.filter(
                      (valor) =>
                        valor.paganteId === pagante_id &&
                        valor.despesaId === despesa.id
                    )[0].id
                  : "",
              precoAgua: valorM3Agua,
              agua: leituraAguaFormated.toString(),
              valor: valor.toFixed(2),
              paganteId: pagante_id,
              despesaId: despesa.id,
            };
          });
        })()
      );
      setValorTotal(somaValorTotal.toFixed(2));
    }

    setDespesa({
      id: despesa.id,
      nome: formList[0].value,
      categoria: formList[1].value,
      rateioAutomatico: false,
      permanente: true,
      aguaIndividual: true,
      fundoReserva: false,
      valor: valoresList
        .filter((field) => field.id.includes("valorAguaIndividual"))
        .reduce((acc, field) => {
          return Number(acc) + Number(field.value.substring(3));
        }, 0)
        .toFixed(2),
      parcelaAtual: null,
      numParcelas: null,
      Valores: valores,
      condominioId: condominio.id,
    });

    setFormCompleted(
      formList.filter((field) => !field.disabled && field.value === "")[0] ===
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
              disabled={despesaFundoReserva}
              defaultValue={despesa.nome}
              id="nome"
            ></Input>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="categoria">Categoria</InputLabel>
            <Input
              disabled={despesaFundoReserva}
              defaultValue={despesa.categoria}
              id="categoria"
            ></Input>
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
        <section>
          <DialogContentText key={"valoresTitle"} color="inherit">
            Registros Individuais dos Moradores
          </DialogContentText>
          <div id="containerAgua">
            <div id="esquerdaAgua">
              {condominio["Pagantes"].map((pagante) => (
                <FormControl key={"aguaIndividualForm" + pagante.id}>
                  <InputLabel htmlFor={"aguaIndividual" + pagante.id}>
                    Registro de água para {pagante.complemento}
                  </InputLabel>
                  <Input
                    defaultValue={
                      valores.length > 0 && valores[0].id !== ""
                        ? String(
                            valores.filter(
                              (valorIndividual) =>
                                valorIndividual["paganteId"] === pagante.id
                            )[0].agua
                          )
                        : ""
                    }
                    id={"aguaIndividual" + pagante.id}
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
                            valores.filter(
                              (valor) => valor["paganteId"] === pagante.id
                            )[0].valor
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
        {/* <section>
          <DialogContentText key={"valoresTitle"} color="inherit">
            Registros do Condomínio
          </DialogContentText>
          FIXME
        </section> */}
      </form>
    </div>
  );
}

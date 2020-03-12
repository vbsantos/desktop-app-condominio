import React, { useRef, useState, useEffect } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Input,
  TextField
} from "@material-ui/core";

export default function FormPagante(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [conta, setConta] = props.conta;

  // pagante must belong to a condominio
  const { condominio } = props;

  // form reference
  const formRef = useRef(null);

  const [contaPerma, setContaPerma] = useState(conta.permanente || false);

  const [rateioAuto, setRateioAuto] = useState(conta.rateioAutomatico || false);

  const [totalValorIndividual, setTotalValorIndividual] = useState(0); // VALORES INDIVIDUAIS SOMADOS

  useEffect(() => {
    const formList = [...formRef.current.elements];
    const allFieldsFilled =
      formList.filter(field => field.value === "")[0] === undefined;
    setFormCompleted(allFieldsFilled);
  }, [contaPerma, rateioAuto]);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    setRateioAuto(formList[3].checked);
    setContaPerma(formList[4].checked);
    const individualValuesList = contaPerma
      ? formList.slice(5)
      : formList.slice(7); // all individual values
    setTotalValorIndividual(
      individualValuesList
        .reduce((acc, field) => {
          return acc + Number(field.value.replace(",", "."));
        }, 0)
        .toFixed(2)
    );
    setConta({
      id: conta.id,
      nome: formList[0].value,
      categoria: formList[1].value,
      valor: formList[2].value.replace(",", "."),
      rateioAutomatico: formList[3].checked,
      permanente: formList[4].checked,
      parcelaAtual: contaPerma ? null : formList[5].value,
      numParcelas: contaPerma ? null : formList[6].value,
      condominioId: condominio.id
    });
    const allFieldsFilled =
      formList.filter(field => field.value === "")[0] === undefined;
    setFormCompleted(allFieldsFilled);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText key={"despesaTitle"} color="inherit">
          Informações da Despesa
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome</InputLabel>
          <Input autoFocus defaultValue={conta.nome} id="nome"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="categoria">Categoria</InputLabel>
          <Input defaultValue={conta.categoria} id="categoria"></Input>
        </FormControl>
        {rateioAuto ? (
          <FormControl>
            <InputLabel htmlFor="valor">Valor</InputLabel>
            <Input defaultValue={conta.valor} id="valor"></Input>
          </FormControl>
        ) : (
          <FormControl>
            <Input value={totalValorIndividual}></Input>
          </FormControl>
        )}
      </section>
      <section>
        <DialogContentText key={"controleTitle"} color="inherit">
          Informações para Controle
        </DialogContentText>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={conta.rateioAutomatico}
                value="rateioAutomatico"
                color="primary"
              />
            }
            label="Rateio Automático"
          />
        </FormControl>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={conta.permanente}
                value="permanente"
                color="primary"
              />
            }
            label="Despesa Fixa"
          />
        </FormControl>
      </section>
      {!contaPerma && (
        <>
          <section>
            <DialogContentText key={"parcelaTitle"} color="inherit">
              Informações das Parcelas
            </DialogContentText>
            <FormControl>
              <InputLabel htmlFor="parcelaAtual">Parcela Atual</InputLabel>
              <Input
                defaultValue={conta.parcelaAtual}
                id="parcelaAtual"
              ></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="numParcelas">Total de Parcelas</InputLabel>
              <Input defaultValue={conta.numParcelas} id="numParcelas"></Input>
            </FormControl>
          </section>
        </>
      )}
      {!rateioAuto && (
        <section>
          <DialogContentText key={"valoresTitle"} color="inherit">
            {contaPerma
              ? "Divisão Manual de Valores"
              : "Divisão Manual de Valores da Parcela Atual"}
          </DialogContentText>
          {condominio["Pagantes"].map(pagante => (
            <FormControl key={"valorIndividualForm" + pagante.id}>
              <InputLabel htmlFor={"valorIndividual" + pagante.id}>
                Valor para {pagante.complemento}
              </InputLabel>
              <Input id={"valorIndividual" + pagante.id}></Input>
            </FormControl>
          ))}
        </section>
      )}
    </form>
  );
}

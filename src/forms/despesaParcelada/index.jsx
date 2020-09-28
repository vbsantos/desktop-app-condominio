import React, { useRef, useState, useEffect } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  Typography,
  Grid,
  Switch,
  FormGroup,
  FormControlLabel,
  InputLabel,
  Input,
} from "@material-ui/core";

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

  // rateioAutomatico
  const [rateioAuto, setRateioAuto] = useState(
    despesa.rateioAutomatico || false
  );

  // function that runs each time there is a change in the form
  function formOnChange() {
    const formList = [...formRef.current.elements];
    // console.log("FORM LIST:", formList);
    const valoresList = formList.slice(5);
    // console.log("VALORES LIST:", valoresList);

    if (!rateioAuto) {
      let somaValorTotal = 0;
      setValores(
        valoresList.map((field) => {
          const valor = Number(field.value.replace(",", "."));
          const pagante_id = Number(field.id.slice(15));
          somaValorTotal += valor;
          return {
            id:
              valores.length > 0 && valores[0].id !== ""
                ? valores.find(
                    (valor) =>
                      valor.paganteId === pagante_id &&
                      valor.despesaId === despesa.id
                  ).id
                : "",
            precoAgua: null,
            agua: null,
            valor: valor.toFixed(2),
            paganteId: pagante_id,
            despesaId: despesa.id,
          };
        })
      );
      setValorTotal(somaValorTotal.toFixed(2));
    }

    const parcelaAtual = Number(formList[3].value.split(".")[0]);
    const numParcelas = Number(formList[4].value.split(".")[0]);
    const valor = formList[5].value.replace(",", ".");
    setDespesa({
      id: despesa.id,
      nome: formList[0].value,
      categoria: formList[1].value,
      agua: null,
      aguaIndividual: false,
      rateioAutomatico: formList[2].checked,
      permanente: false,
      fundoReserva: false,
      valor: rateioAuto
        ? valor
        : valoresList
            .reduce((acc, field) => {
              return Number(acc) + Number(field.value.replace(",", "."));
            }, 0)
            .toFixed(2),
      parcelaAtual,
      numParcelas,
      informacao: false,
      Valores: valores,
      condominioId: condominio.id,
    });

    setFormCompleted(
      parcelaAtual > 0 &&
        numParcelas > 0 &&
        parcelaAtual <= numParcelas &&
        formList.find((field) => !field.disabled && field.value === "") ===
          undefined &&
        valoresList.find(
          (field) =>
            isNaN(Number(field.value.replace(",", "."))) ||
            Number(field.value.replace(",", ".")) < 0
        ) === undefined
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
            <InputLabel htmlFor="nome">Nome *</InputLabel>
            <Input autoFocus defaultValue={despesa.nome} id="nome"></Input>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="categoria">Categoria *</InputLabel>
            <Input defaultValue={despesa.categoria} id="categoria"></Input>
          </FormControl>
        </section>

        {/* RATEIO AUTOMATICO OU MANUAL */}
        <section>
          <DialogContentText key={"controleTitle"} color="inherit">
            Divisão dos custos
          </DialogContentText>
          <FormGroup>
            <Typography component="div">
              <Grid
                container
                component="label"
                justify="center"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs>
                  Manual
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={(e) => setRateioAuto(e.target.checked)}
                        value="cb1"
                        checked={despesa.rateioAutomatico}
                        color="primary"
                      />
                    }
                  />
                </Grid>
                <Grid item xs>
                  Automática
                </Grid>
              </Grid>
            </Typography>
          </FormGroup>
        </section>

        {/* PARCELAS */}
        <section>
          <DialogContentText key={"parcelaTitle"} color="inherit">
            Informações das Parcelas
          </DialogContentText>
          <FormControl>
            <InputLabel htmlFor="parcelaAtual">Parcela Atual *</InputLabel>
            <Input
              defaultValue={despesa.parcelaAtual}
              id="parcelaAtual"
            ></Input>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="numParcelas">Total de Parcelas *</InputLabel>
            <Input defaultValue={despesa.numParcelas} id="numParcelas"></Input>
          </FormControl>
        </section>

        {/* VALORES */}
        {!rateioAuto ? (
          <section>
            <DialogContentText key={"valoresTitle"} color="inherit">
              Divisão Manual de Valores da Parcela Atual
            </DialogContentText>
            {condominio["Pagantes"].map((pagante) => (
              <FormControl key={"valorIndividualForm" + pagante.id}>
                <InputLabel htmlFor={"valorIndividual" + pagante.id}>
                  Custo para {pagante.complemento} *
                </InputLabel>
                <Input
                  id={"valorIndividual" + pagante.id}
                  defaultValue={
                    valores.length > 0 && valores[0].id !== ""
                      ? Number(
                          valores.find(
                            (valor) => valor["paganteId"] === pagante.id
                          ).valor
                        ).toFixed(2)
                      : ""
                  }
                ></Input>
              </FormControl>
            ))}
          </section>
        ) : (
          <section>
            <DialogContentText key={"controleTitle"} color="inherit">
              Custo da Parcela Atual
            </DialogContentText>
            <FormControl>
              <InputLabel htmlFor="valor">Valor (R$) *</InputLabel>
              <Input
                defaultValue={despesa.valor}
                id="valor"
                disabled={!rateioAuto}
              ></Input>
            </FormControl>
          </section>
        )}
      </form>
    </div>
  );
}

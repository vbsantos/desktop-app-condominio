import React, { useRef, useState, useEffect } from "react";

// MATERIAL UI COMPONENTS
import { Autocomplete } from "@material-ui/lab";
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
  TextField,
  Checkbox,
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
    // console.log("FORM LIST:", formList);
    const valoresList = formList.slice(6);
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
    } else {
      setValores([]);
      setValorTotal(0);
    }

    const parcelaAtual = Number(formList[4].value.split(".")[0]);
    const numParcelas = Number(formList[5].value.split(".")[0]);
    const valor = formList[6].value.replace(",", ".");

    const new_categoria =
      nome_categoria === null ? formList[1].value : nome_categoria;

    const new_despesa_parcelada = {
      id: despesa.id,
      nome: formList[0].value,
      categoria: new_categoria,
      agua: null,
      aguaIndividual: false,
      rateioAutomatico: formList[3].checked,
      chamadaExtra: formList[2].checked,
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
      ativa: despesa.ativa,
      Valores: valores,
      condominioId: condominio.id,
    };

    setDespesa(new_despesa_parcelada);

    const form_is_complete =
      validForm &&
      new_categoria !== "" &&
      parcelaAtual > 0 &&
      numParcelas > 0 &&
      parcelaAtual <= numParcelas &&
      formList
        .filter((field, index) => index !== 1)
        .find((field) => !field.disabled && field.value === "") === undefined &&
      valoresList.find(
        (field) =>
          isNaN(Number(field.value.replace(",", "."))) ||
          Number(field.value.replace(",", ".")) < 0
      ) === undefined;

    setFormCompleted(form_is_complete);
    setValidForm(true);
  }

  return (
    <div>
      <form ref={formRef} onChange={formOnChange}>
        {/* INFORMAÇÕES DA DESPESA */}
        <section>
          <DialogContentText key={"despesaTitle"} color="inherit">
            Informações da Despesa
          </DialogContentText>
          <div className="TwoColumnFormContainer">
            <div className="LeftColumForm">
              <FormControl>
                <InputLabel htmlFor="nome">Nome *</InputLabel>
                <Input autoFocus defaultValue={despesa.nome} id="nome"></Input>
              </FormControl>
            </div>
            <div className="RightColumnForm">
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
          <div style={{ paddingTop: "15px" }}>
            <FormControl
              title={
                despesa.chamadaExtra
                  ? "Incluir despesa no cálculo do fundo reserva"
                  : "Remover despesa do cálculo do fundo reserva"
              }
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="chamadaExtra"
                    color="primary"
                    value="cb1"
                    checked={despesa.chamadaExtra}
                  />
                }
                label="Chamada Extra"
              />
            </FormControl>
          </div>
        </section>

        {/* RATEIO AUTOMATICO OU MANUAL */}
        <section>
          <DialogContentText key={"controleTitle"} color="inherit">
            Divisão dos custos
          </DialogContentText>
          <FormGroup>
            <Typography component="div">
              <Grid container justify="center" alignItems="center" spacing={1}>
                <Grid item xs>
                  Manual
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    style={{ marginRight: "-10px" }}
                    control={
                      <Switch
                        onChange={(e) => setRateioAuto(e.target.checked)}
                        value="cb2"
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
          <div className="TwoColumnFormContainer">
            <div className="LeftColumForm">
              <FormControl>
                <InputLabel htmlFor="parcelaAtual">Parcela Atual *</InputLabel>
                <Input
                  defaultValue={despesa.parcelaAtual}
                  id="parcelaAtual"
                ></Input>
              </FormControl>
            </div>
            <div className="RightColumnForm">
              <FormControl>
                <InputLabel htmlFor="numParcelas">
                  Total de Parcelas *
                </InputLabel>
                <Input
                  defaultValue={despesa.numParcelas}
                  id="numParcelas"
                ></Input>
              </FormControl>
            </div>
          </div>
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

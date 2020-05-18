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

  // checkboxes
  const [despesaPermanente, setDespesaPermanente] = useState(
    despesa.permanente || false
  );
  const [rateioAuto, setRateioAuto] = useState(
    despesa.rateioAutomatico || false
  );
  const [despesaAgua, setDespesaAgua] = useState(
    despesa.aguaIndividual || false
  );
  const [despesaFundoReserva, setDespesaFundoReserva] = useState(
    despesa.fundoReserva || false
  );

  // function that runs each time there is a change in the form
  function formOnChange() {
    const formList = [...formRef.current.elements];
    // console.log("FORM LIST:", formList);
    const valoresList = formList.slice(3);
    // console.log("VALORES LIST:", valoresList);

    if (!rateioAuto) {
      let somaValorTotal = 0;
      setValores(
        despesaAgua
          ? (function () {
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
          : valoresList.map((field) => {
              const valor = Number(field.value.replace(",", "."));
              const pagante_id = Number(field.id.slice(15));
              somaValorTotal += valor;
              return {
                id:
                  valores.length > 0 && valores[0].id !== ""
                    ? valores.filter(
                        (valor) =>
                          valor.paganteId === pagante_id &&
                          valor.despesaId === despesa.id
                      )[0].id
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

    setDespesa({
      id: despesa.id,
      nome: formList[0].value,
      categoria: formList[1].value,
      rateioAutomatico: formList[2].checked,
      permanente: true,
      aguaIndividual: false,
      fundoReserva: false,
      valor: rateioAuto
        ? formList[3].value.replace(",", ".")
        : valoresList
            .reduce((acc, field) => {
              return Number(acc) + Number(field.value);
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

        {/* VALORES */}
        {!rateioAuto ? (
          <section>
            <DialogContentText key={"valoresTitle"} color="inherit">
              {despesaPermanente
                ? "Divisão Manual de Valores"
                : "Divisão Manual de Valores da Parcela Atual"}
            </DialogContentText>
            {condominio["Pagantes"].map((pagante) => (
              <FormControl key={"valorIndividualForm" + pagante.id}>
                <InputLabel htmlFor={"valorIndividual" + pagante.id}>
                  Custo para {pagante.complemento}
                </InputLabel>
                <Input
                  id={"valorIndividual" + pagante.id}
                  defaultValue={
                    valores.length > 0 && valores[0].id !== ""
                      ? Number(
                          valores.filter(
                            (valor) => valor["paganteId"] === pagante.id
                          )[0].valor
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
              Custo da Despesa
            </DialogContentText>
            <FormControl>
              <InputLabel htmlFor="valor">Valor (R$)</InputLabel>
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

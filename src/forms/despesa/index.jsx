import React, { useRef, useState, useEffect } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Input
} from "@material-ui/core";

export default function FormDespesa(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;
  setFormCompleted(true);

  // store all current values of the form fields
  const [despesa, setDespesa] = props.despesa;
  // console.log("DESPESA:", despesa);

  // stores all individual values in case of !rateioAuto
  const [valores, setValores] = props.valores;
  // console.log("VALORES:", valores);

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

  function formOnChange() {
    const formList = [...formRef.current.elements];
    // console.log("FORM LIST:", formList);

    const valoresList = formList.slice(8);
    // console.log("VALORES LIST:", valoresList);

    let somaValorTotal = 0;

    setValores(
      valoresList.map(field => {
        const valor = Number(field.value.replace(",", "."));
        const pagante_id = Number(field.id.slice(15));
        const despesa_id = despesa.id;
        somaValorTotal += valor;
        return {
          id:
            valores.length > 0
              ? valores.filter(
                  valor =>
                    valor.paganteId === pagante_id &&
                    valor.despesaId === despesa_id
                )[0].id
              : "",
          valor: valor.toString(),
          paganteId: pagante_id,
          despesaId: despesa_id
        };
      })
    );

    setValorTotal(somaValorTotal.toFixed(2));

    setDespesa({
      id: despesa.id,
      nome: formList[0].value,
      categoria: formList[1].value,
      rateioAutomatico: formList[2].checked,
      permanente: formList[3].checked,
      aguaIndividual: formList[4].checked,
      valor: rateioAuto
        ? formList[5].value.replace(",", ".")
        : valoresList
            .reduce((acc, field) => {
              return Number(acc) + Number(field.value);
            }, 0)
            .toFixed(2),
      parcelaAtual: despesaPermanente ? null : formList[6].value,
      numParcelas: despesaPermanente ? null : formList[7].value,
      Valores: valores,
      condominioId: condominio.id
    });

    setFormCompleted(
      formList.filter(field => field.value === "")[0] === undefined
    );
  }

  return (
    <div>
      <form ref={formRef} onChange={formOnChange}>
        <section>
          <DialogContentText key={"despesaTitle"} color="inherit">
            Informações da Despesa
          </DialogContentText>
          <FormControl>
            <InputLabel htmlFor="nome">Nome</InputLabel>
            <Input autoFocus defaultValue={despesa.nome} id="nome"></Input>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="categoria">Categoria</InputLabel>
            <Input defaultValue={despesa.categoria} id="categoria"></Input>
          </FormControl>
        </section>
        <section>
          <DialogContentText key={"controleTitle"} color="inherit">
            Informações para Controle
          </DialogContentText>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => setRateioAuto(e.target.checked)}
                  value="cb1"
                  checked={despesa.rateioAutomatico}
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
                  onChange={e => setDespesaPermanente(e.target.checked)}
                  value="cb2"
                  checked={despesa.permanente}
                  color="primary"
                />
              }
              label="Despesa Fixa"
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => setDespesaAgua(e.target.checked)}
                  value="cb3"
                  checked={despesa.aguaIndividual}
                  color="primary"
                  disabled={rateioAuto}
                />
              }
              label="Despesa de Água Individual"
            />
          </FormControl>
        </section>

        {
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
        }

        {
          <section>
            <DialogContentText key={"parcelaTitle"} color="inherit">
              Informações das Parcelas
            </DialogContentText>
            <FormControl>
              <InputLabel htmlFor="parcelaAtual">Parcela Atual</InputLabel>
              <Input
                defaultValue={despesa.parcelaAtual}
                id="parcelaAtual"
                disabled={despesaPermanente}
              ></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="numParcelas">Total de Parcelas</InputLabel>
              <Input
                defaultValue={despesa.numParcelas}
                id="numParcelas"
                disabled={despesaPermanente}
              ></Input>
            </FormControl>
          </section>
        }

        {!rateioAuto && (
          <section>
            <DialogContentText key={"valoresTitle"} color="inherit">
              {despesaPermanente
                ? "Divisão Manual de Valores"
                : "Divisão Manual de Valores da Parcela Atual"}
            </DialogContentText>
            {condominio["Pagantes"].map(pagante => (
              <FormControl key={"valorIndividualForm" + pagante.id}>
                <InputLabel htmlFor={"valorIndividual" + pagante.id}>
                  Custo para {pagante.complemento}
                </InputLabel>
                <Input
                  id={"valorIndividual" + pagante.id}
                  defaultValue={
                    valores.length > 0
                      ? String(
                          valores.filter(
                            valorIndividual =>
                              valorIndividual["paganteId"] === pagante.id
                          )[0].valor
                        )
                      : ""
                  }
                ></Input>
              </FormControl>
            ))}
          </section>
        )}
      </form>
    </div>
  );
}

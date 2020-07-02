import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  NativeSelect,
  InputLabel,
  Input,
} from "@material-ui/core";

// CSS
import "./style.css";

export default function FormDespesa(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [date, setDate] = props.date;

  // form reference
  const formRef = useRef(null);

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // const getMonth = () => new Date().getMonth();
  const getYear = () => new Date().getFullYear();

  const pad = (num, size) => {
    return String(num).padStart(size, "0");
  };

  // function that runs each time there is a change in the form
  function formOnChange() {
    const formList = [...formRef.current.elements];
    // console.log("FORM LIST:", formList);

    const mes = formList[0].value;
    const ano = formList[1].value;
    const emissao = formList[2].value;
    const vencimento = formList[3].value;
    const competencia = `${pad(months.indexOf(mes) + 1, 2)}/${ano}`;

    setDate({
      mes,
      ano,
      competencia,
      emissao,
      vencimento,
    });

    setFormCompleted(mes !== "" && ano !== "");
  }

  return (
    <div id={"formEscolherData"}>
      <form ref={formRef} onChange={formOnChange}>
        <section>
          <DialogContentText key={"dataTitle"} color="inherit">
            Data
          </DialogContentText>
          <div>
            <FormControl>
              <InputLabel htmlFor="mes">Mês *</InputLabel>
              <NativeSelect id="mes" className="Selector">
                <option key={"mes0"} value={""}></option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="ano">Ano *</InputLabel>
              <NativeSelect id="ano" className="Selector">
                <option key={"ano0"} value={""}></option>
                <option key={getYear() - 1} value={getYear() - 1}>
                  {getYear() - 1}
                </option>
                <option key={getYear()} value={getYear()}>
                  {getYear()}
                </option>
                <option key={getYear() + 1} value={getYear() + 1}>
                  {getYear() + 1}
                </option>
              </NativeSelect>
            </FormControl>
          </div>
        </section>
        <section>
          <DialogContentText key={"dataTitle"} color="inherit">
            Emissão
          </DialogContentText>
          <div>
            <FormControl>
              <InputLabel htmlFor="emissao">Data de Emissão</InputLabel>
              <Input id="emissao"></Input>
            </FormControl>
          </div>
        </section>
        <section>
          <DialogContentText key={"dataTitle"} color="inherit">
            Vencimento
          </DialogContentText>
          <div>
            <FormControl>
              <InputLabel htmlFor="vencimento">Data de Vencimento</InputLabel>
              <Input id="vencimento"></Input>
            </FormControl>
          </div>
        </section>
      </form>
    </div>
  );
}

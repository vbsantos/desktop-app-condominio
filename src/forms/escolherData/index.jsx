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

  const getMonth = () => new Date().getMonth();
  const getYear = () => new Date().getFullYear();

  // function that runs each time there is a change in the form
  function formOnChange() {
    const formList = [...formRef.current.elements];
    // console.log("FORM LIST:", formList);

    const mes = formList[0].value;
    const ano = formList[1].value;

    setDate({
      mes,
      ano,
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
      </form>
    </div>
  );
}

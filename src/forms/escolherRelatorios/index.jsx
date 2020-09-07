import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContent,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";

export default function FormReports(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [reports, setReports] = props.reports;

  // form reference
  const formRef = useRef(null);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    setReports({
      rg: reports.rg === null ? null : formList[0].checked,
      rr: reports.rr === null ? null : formList[1].checked,
      ra: reports.ra === null ? null : formList[2].checked,
      rfr: reports.rfr === null ? null : formList[3].checked,
      ris: reports.ris === null ? null : formList[4].checked,
    });

    setFormCompleted(formList.find((f) => f.checked) !== undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                disabled={reports.rg === null}
                name="rg"
                color="primary"
              />
            }
            label="Demonstrativo Financeiro"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                disabled={reports.rr === null}
                name="rr"
                color="primary"
              />
            }
            label="Planilha de Previsão de Receita"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                disabled={reports.ra === null}
                name="ra"
                color="primary"
              />
            }
            label="Leitura de Água"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                disabled={reports.rfr === null}
                name="rfr"
                color="primary"
              />
            }
            label="Extrato Fundo Reserva"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                disabled={reports.ris === null}
                name="ris"
                color="primary"
              />
            }
            label="Relatórios Individuais"
          />
        </FormControl>
      </section>

      {/* FEEDBACK */}
      {!formCompleted && (
        <DialogContent>{"É necessário selecionar um relatório"}</DialogContent>
      )}
    </form>
  );
}

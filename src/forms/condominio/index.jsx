import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  FormControl,
  DialogContent,
  DialogContentText,
  InputLabel,
  Input,
} from "@material-ui/core";

export default function FormCondominio(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [condominio, setCondominio] = props.condominio;

  // condominio must belong to a beneficiario
  const { beneficiario } = props;

  // form reference
  const formRef = useRef(null);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    setCondominio({
      id: condominio.id,
      nome: formList[0].value,
      leituraAgua: formList[1].value.replace(",", "."),
      beneficiarioId: beneficiario.id,
    });
    setFormCompleted(formList.find((f) => f.value === "") === undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações do Condomínio
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome *</InputLabel>
          <Input autoFocus defaultValue={condominio.nome} id="nome"></Input>
        </FormControl>
      </section>

      <section>
        <DialogContentText color="inherit">
          Última Leitura de água Contabilizado
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="leituraAgua">Leitura da água *</InputLabel>
          <Input defaultValue={condominio.leituraAgua} id="leituraAgua"></Input>
        </FormControl>
      </section>

      {/* FEEDBACK */}
      {!formCompleted && (
        <DialogContent>
          {condominio.id === ""
            ? "É necessário preencher os campos obrigatórios (*) para cadastrar"
            : "É necessário modificar algum campo para salvar"}
        </DialogContent>
      )}
    </form>
  );
}

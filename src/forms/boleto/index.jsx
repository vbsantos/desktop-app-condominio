import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";

export default function FormBeneficiario(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [boleto, setBoleto] = props.boleto;

  // form reference
  const formRef = useRef(null);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    setBoleto({
      id: boleto.id,
      emissao: formList[0].value,
      vencimento: formList[1].value,
      documento: formList[2].value,
      titulo: formList[3].value,
    });
    setFormCompleted(formList.filter((f) => f.value === "")[0] === undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Datas Oficiais
          <br />
          (datas no formato: "2019-12-31")
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="emissao">Data de Emissão</InputLabel>
          <Input autoFocus defaultValue={boleto.emissao} id="emissao"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="vencimento">Data de Vencimento</InputLabel>
          <Input defaultValue={boleto.vencimento} id="vencimento"></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">
          Informações Essenciais
          <br />
          (documento: "EX1", titulo: "DM")
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="documento">Documento</InputLabel>
          <Input
            autoFocus
            defaultValue={boleto.documento}
            id="documento"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="titulo">Título</InputLabel>
          <Input defaultValue={boleto.titulo} id="titulo"></Input>
        </FormControl>
      </section>
    </form>
  );
}

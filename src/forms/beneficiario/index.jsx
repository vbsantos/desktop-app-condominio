import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  FormControl,
  InputLabel,
  Input
} from "@material-ui/core";

export default function FormBeneficiario(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [beneficiario, setBeneficiario] = props.beneficiario;

  // form reference
  const formRef = useRef(null);

  function formOnChange() {
    const formList = [...formRef.current.elements];
    setBeneficiario({
      id: beneficiario.id,
      nome: formList[0].value,
      cprf: formList[1].value,
      token_acesso: formList[2].value,
      token_conta: formList[3].value,
      cep: formList[4].value,
      uf: formList[5].value,
      localidade: formList[6].value,
      bairro: formList[7].value,
      logradouro: formList[8].value,
      numero: formList[9].value,
      complemento: formList[10].value
    });
    setFormCompleted(formList.filter(f => f.value === "")[0] === undefined);
  }

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações Pessoais
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome</InputLabel>
          <Input autoFocus defaultValue={beneficiario.nome} id="nome"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="cprf">CPF/CNPJ</InputLabel>
          <Input defaultValue={beneficiario.cprf} id="cprf"></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">Boleto.Cloud</DialogContentText>
        <FormControl>
          <InputLabel htmlFor="tokenAcesso">Token Acesso</InputLabel>
          <Input
            defaultValue={beneficiario.token_acesso}
            id="tokenAcesso"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="tokenConta">Token Conta</InputLabel>
          <Input
            defaultValue={beneficiario.token_conta}
            id="tokenConta"
          ></Input>
        </FormControl>
      </section>
      <section>
        <DialogContentText color="inherit">Endereço</DialogContentText>
        <FormControl>
          <InputLabel htmlFor="cep">CEP</InputLabel>
          <Input defaultValue={beneficiario.cep} id="cep"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="uf">UF</InputLabel>
          <Input defaultValue={beneficiario.uf} id="uf"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="localidade">Localidade</InputLabel>
          <Input defaultValue={beneficiario.localidade} id="localidade"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="bairro">Bairro</InputLabel>
          <Input defaultValue={beneficiario.bairro} id="bairro"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="logradouro">Logradouro</InputLabel>
          <Input defaultValue={beneficiario.logradouro} id="logradouro"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="numero">Número</InputLabel>
          <Input defaultValue={beneficiario.numero} id="numero"></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="complemento">Complemento</InputLabel>
          <Input
            defaultValue={beneficiario.complemento}
            id="complemento"
          ></Input>
        </FormControl>
      </section>
    </form>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Container, FormControl, InputLabel, Input } from "@material-ui/core";

// CSS
import "./style.css";

export default function RegistrarBeneficiario(props) {
  const [footbar, setFootbar] = props.buttons;
  const navigate = useNavigate();
  // Armazena os dados do beneficiário sendo cadastrado
  const [beneficiario, setBeneficiario] = useState({});
  // True se todos os campos do formulário foram preenchidos
  const [form, setForm] = useState({ completed: false });

  console.log("Entrou em RegistrarBeneficiario\nFootbar:", footbar);

  // This function runs only when the component is monted
  useEffect(() => {
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "CANCELAR"
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: true,
          value: ""
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "CADASTRAR"
        }
      ],
      action: -1
    });
    return () => console.log("RegistrarBeneficiario - Encerrou");
  }, []);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("RegistrarBeneficiario - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/");
        break;
      case 2:
        console.log("RegistrarBeneficiario - Botão da direita");
        window.ipcRenderer.invoke("beneficiarios", {
          method: "create",
          content: beneficiario
        });
        setFootbar({ ...footbar, action: -1 });
        navigate("/");
        break;
    }
  }, [footbar.action]);

  // This function runs only when all the fields of the form are filled
  useEffect(() => {
    setFootbar({
      ...footbar,
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "CANCELAR"
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: true,
          value: ""
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: form.completed,
          value: "CADASTRAR"
        }
      ]
    });
  }, [form.completed]);

  // function that runs each time there is a change in the form
  function changedForm() {
    const form = document.getElementsByTagName("form")[0];
    const formList = Array.from(form);
    const formCompleted = formList.filter(f => f.value === "")[0] === undefined;
    setBeneficiario({
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
    setForm({ completed: formCompleted });
  }

  return (
    <div id="registrarBeneficiario">
      <h1 className="PageTitle">Cadastre o Beneficiário</h1>
      <Container maxWidth="sm">
        <form onChange={() => changedForm()} id="formBeneficiario">
          <section>
            <h2>Informações Pessoais</h2>
            <FormControl>
              <InputLabel htmlFor="nome">Nome</InputLabel>
              <Input autoFocus id="nome" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="cprf">CPF/CNPJ</InputLabel>
              <Input id="cprf" type="text"></Input>
            </FormControl>
          </section>
          <section>
            <h2>Boleto.Cloud</h2>
            <FormControl>
              <InputLabel htmlFor="tokenAcesso">Token Acesso</InputLabel>
              <Input id="tokenAcesso" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="tokenConta">Token Conta</InputLabel>
              <Input id="tokenConta" type="text"></Input>
            </FormControl>
          </section>
          <section>
            <h2>Endereço</h2>
            <FormControl>
              <InputLabel htmlFor="cep">CEP</InputLabel>
              <Input id="cep" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="uf">UF</InputLabel>
              <Input id="uf" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="localidade">Localidade</InputLabel>
              <Input id="localidade" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="bairro">Bairro</InputLabel>
              <Input id="bairro" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="logradouro">Logradouro</InputLabel>
              <Input id="logradouro" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="numero">Número</InputLabel>
              <Input id="numero" type="text"></Input>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="complemento">Complemento</InputLabel>
              <Input id="complemento" type="text"></Input>
            </FormControl>
          </section>
        </form>
      </Container>
    </div>
  );
}

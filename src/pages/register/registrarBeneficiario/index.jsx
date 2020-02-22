import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// CSS
import "./style.css";

export default function RegistrarBeneficiario(props) {
  const [footbar, setFootbar] = props.buttons;
  const [beneficiario, setBeneficiario] = useState({});
  const [form, setForm] = useState({ completed: false });
  const navigate = useNavigate();

  console.log("ao entrar em RegistrarBeneficiario: ", footbar);

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
      action: -1,
      data: footbar.data
    });
    return () => console.log("RegistrarBeneficiario - Encerrou");
  }, []);

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
        setFootbar({ ...footbar, action: -1, data: { beneficiario } });
        navigate("/");
        break;
      // default:
      //   console.log("footbar.action resetado");
    }
  }, [footbar.action]);

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

  function changedForm() {
    const form = document.getElementsByTagName("form")[0];
    const formList = Array.from(form);
    const preenchido = formList.filter(f => f.value === "")[0] == undefined;
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
    setForm({ completed: preenchido });
  }

  return (
    <div className="registrarBeneficiario">
      <div className="Screen">
        <h1 className="PageTitle">Cadastre o Beneficiário</h1>
        <form onChange={() => changedForm()} id="formBeneficiario">
          <section>
            <h2>Informações Pessoais</h2>
            <label>Nome: </label>
            <input id="nome" type="text"></input>
            <label>CPF/CNPJ: </label>
            <input id="cprf" type="text"></input>
            <br />
            <br />
          </section>
          <section>
            <h2>Boleto.Cloud</h2>
            <label>Token Acesso: </label>
            <input id="tokenAcesso" type="text"></input>
            <label>Token Conta: </label>
            <input id="tokenConta" type="text"></input>
            <br />
            <br />
          </section>
          <section>
            <h2>Endereço</h2>
            <label>CEP: </label>
            <input id="cep" type="text"></input>
            <label>UF: </label>
            <input id="uf" type="text"></input>
            <br />
            <label>Localidade: </label>
            <input id="localidade" type="text"></input>
            <label>Bairro: </label>
            <input id="bairro" type="text"></input>
            <br />
            <label>Logradouro: </label>
            <input id="logradouro" type="text"></input>
            <label>Número: </label>
            <input id="numero" type="text"></input>
            <br />
            <label>Complemento: </label>
            <input id="complemento" type="text"></input>
          </section>
        </form>
      </div>
    </div>
  );
}

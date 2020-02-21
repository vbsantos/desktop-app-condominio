import React from "react";

import "./style.css";

export default function FormBeneficiario(props) {
  return (
    <div>
      <form>
        <label>Nome:</label>
        <input type="text"></input>
        <label>E-mail:</label>
        <input type="text"></input>
        <label>Token Acesso:</label>
        <input type="text"></input>
        <label>Token Conta:</label>
        <input type="text"></input>
        <label>CEP:</label>
        <input type="text"></input>
        <label>UF:</label>
        <input type="text"></input>
        <label>Localidade:</label>
        <input type="text"></input>
        <label>Bairro:</label>
        <input type="text"></input>
        <label>Logradouro:</label>
        <input type="text"></input>
        <label>Número:</label>
        <input type="text"></input>
        <label>Complemento:</label>
        <input type="text"></input>
      </form>
    </div>
  );
}

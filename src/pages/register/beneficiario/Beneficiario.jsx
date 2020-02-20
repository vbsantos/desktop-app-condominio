import React, { Component } from "react";
// import PropTypes from "prop-types";

export class Beneficiario extends Component {
  // static propTypes = {};

  // nome
  // cprf
  // token_acesso
  // token_conta
  // cep
  // uf
  // localidade
  // bairro
  // logradouro
  // numero
  // complemento

  render() {
    return (
      <form>
        <label>Nome:</label>
        <input type="text"></input>
        <label>E-mail:</label>
        <input type="text"></input>
      </form>
    );
  }
}

export default Beneficiario;

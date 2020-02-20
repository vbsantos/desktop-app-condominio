import React, { Component } from "react";
// import PropTypes from "prop-types";

import Footbar from "../../components/footbar/Footbar";

import DropdownInput from "../../components/dropdownInput/DropdownInput";

import "../../App.css";

export class Login extends Component {
  // static propTypes = {};

  render() {
    const { administradores } = this.props;
    // console.log("Login - administradores:", administradores);
    return (
      <div className="Login">
        <div className="Screen">
          <h2>Selecione o Beneficiário</h2>
          <DropdownInput options={administradores} />
        </div>
        <Footbar
          left={{
            value: "Cadastrar Novo",
            function: () => console.log("Cadastrar novo administrador")
          }}
          right={{
            value: "Selecionar",
            function: () => console.log("Administrador selecionado")
          }}
        />
      </div>
    );
  }
}

export default Login;

import React, { Component } from "react";

import "./App.css";

import Login from "./pages/login/Login";

export class App extends Component {
  state = {
    administradores: []
  };

  async componentWillMount() {
    const migrations = await this.runMigrations();
    console.assert(migrations, "Erro ao rodar as migrations!");
    const seeds = await this.fillDatabase();
    console.assert(seeds, "Erro ao rodar as seeds!");
    const admins = await this.getAdministradores();
    console.assert(admins, "Erro ao buscar administradores!");
  }

  runMigrations = async () => {
    console.time("runMigrations");
    const migrations = await window.ipcRenderer.invoke("database", {
      method: "migrations",
      content: null
    });
    console.timeEnd("runMigrations");
    return migrations;
  };

  getAdministradores = async () => {
    console.time("getAdministradores");
    const beneficiarios = await window.ipcRenderer.invoke("beneficiarios", {
      method: "index",
      content: null
    });
    this.setState({ administradores: [...beneficiarios] });
    // console.log("App - administradores:", this.state.administradores);
    console.timeEnd("getAdministradores");
    return beneficiarios.length > 0 ? true : false;
  };

  fillDatabase = async () => {
    console.time("fillDatabase");
    try {
      const beneficiario1 = await window.ipcRenderer.invoke("beneficiarios", {
        method: "create",
        content: {
          nome: "Vinícius Bohrer dos Santos",
          cprf: "036.580.500-98",
          token_acesso: "api-key_q-hk4iotl6nWZkqoSPEW32BL9HAWIwckXolM9LEx0H0=",
          token_conta: "api-key_A1wDgeIdIPoLqmWf159v6OMBCZZ_UW-cVcwtWGl81mI=",
          cep: "97010-150",
          uf: "RS",
          localidade: "Santa Maria",
          bairro: "Nossa Senhora do Rosário",
          logradouro: "Rua Daudt",
          numero: "425",
          complemento: "Apto 401"
        }
      });

      const beneficiario2 = await window.ipcRenderer.invoke("beneficiarios", {
        method: "create",
        content: {
          nome: "Edmilson Borges dos Santos",
          cprf: "047.690.600-09",
          token_acesso: "api-key_q-hk4iotl6nWZkqoSPEW32BL9HAWIwckXolM9LEx0H0=",
          token_conta: "api-key_A1wDgeIdIPoLqmWf159v6OMBCZZ_UW-cVcwtWGl81mI=",
          cep: "91000-100",
          uf: "RS",
          localidade: "Ijuí",
          bairro: "Penha",
          logradouro: "Rua Gustavo Colombo",
          numero: "1230",
          complemento: "Apto 202"
        }
      });

      const condominio1 = await window.ipcRenderer.invoke("condominios", {
        method: "create",
        content: {
          nome: "Edifício Netuno",
          cep: "97010-100",
          uf: "RS",
          localidade: "Santa Maria",
          bairro: "Centro",
          logradouro: "Rua 1",
          numero: "412",
          beneficiarioId: 1
        }
      });
      const condominio2 = await window.ipcRenderer.invoke("condominios", {
        method: "create",
        content: {
          nome: "Edifício Plutão",
          cep: "97010-090",
          uf: "RS",
          localidade: "Santa Maria",
          bairro: "Dores",
          logradouro: "Rua 2",
          numero: "1463",
          beneficiarioId: 1
        }
      });
      const condominio3 = await window.ipcRenderer.invoke("condominios", {
        method: "create",
        content: {
          nome: "Edifício Vênus",
          cep: "97010-080",
          uf: "RS",
          localidade: "Santa Maria",
          bairro: "Camobi",
          logradouro: "Rua 3",
          numero: "673",
          beneficiarioId: 1
        }
      });

      const pagante1 = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: {
          nome: "Eduardo Batata",
          cprf: "043.214.364-12",
          complemento: "101",
          fracao: "0.5",
          condominioId: 1
        }
      });
      const pagante2 = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: {
          nome: "Jorge Batata",
          cprf: "132.654.412-12",
          complemento: "102",
          fracao: "0.5",
          condominioId: 1
        }
      });
      const pagante3 = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: {
          nome: "Jacson dos Santos",
          cprf: "421.412.524-24",
          complemento: "101",
          fracao: "0.5",
          condominioId: 2
        }
      });
      const pagante4 = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: {
          nome: "Marcos Pereira",
          cprf: "543.123.758-53",
          complemento: "201",
          fracao: "0.5",
          condominioId: 2
        }
      });
      const pagante5 = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: {
          nome: "Dalmir Borges",
          cprf: "564.234.463-34",
          complemento: "1001",
          fracao: "0.333",
          condominioId: 3
        }
      });
      const pagante6 = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: {
          nome: "Odila Locatelli",
          cprf: "123.245.547-39",
          complemento: "1002",
          fracao: "0.333",
          condominioId: 3
        }
      });
      const pagante7 = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: {
          nome: "Everton Charles",
          cprf: "128.734.643-92",
          complemento: "1003",
          fracao: "0.333",
          condominioId: 3
        }
      });

      const boleto1 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000001-1",
          titulo: "DM",
          valor: "200.00",
          paganteId: 1
        }
      });
      const boleto2 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000002-1",
          titulo: "DM",
          valor: "213.42",
          paganteId: 1
        }
      });
      const boleto3 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000003-1",
          titulo: "DM",
          valor: "200.00",
          paganteId: 2
        }
      });
      const boleto4 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000004-1",
          titulo: "DM",
          valor: "213.42",
          paganteId: 2
        }
      });
      const boleto5 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000005-1",
          titulo: "DM",
          valor: "200.00",
          paganteId: 3
        }
      });
      const boleto6 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000006-1",
          titulo: "DM",
          valor: "213.42",
          paganteId: 3
        }
      });
      const boleto7 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000007-1",
          titulo: "DM",
          valor: "200.00",
          paganteId: 4
        }
      });
      const boleto8 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000008-1",
          titulo: "DM",
          valor: "213.42",
          paganteId: 4
        }
      });
      const boleto9 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000009-1",
          titulo: "DM",
          valor: "200.00",
          paganteId: 5
        }
      });
      const boleto10 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000010-1",
          titulo: "DM",
          valor: "213.42",
          paganteId: 5
        }
      });
      const boleto11 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000011-1",
          titulo: "DM",
          valor: "200.00",
          paganteId: 6
        }
      });
      const boleto12 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000012-1",
          titulo: "DM",
          valor: "213.42",
          paganteId: 6
        }
      });
      const boleto13 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000013-1",
          titulo: "DM",
          valor: "200.00",
          paganteId: 7
        }
      });
      const boleto14 = await window.ipcRenderer.invoke("boletos", {
        method: "create",
        content: {
          emissao: "2020-02-10",
          vencimento: "2020-02-17",
          documento: "EX1",
          numero: "10000014-1",
          titulo: "DM",
          valor: "213.42",
          paganteId: 7
        }
      });
      console.timeEnd("fillDatabase");
      return true;
    } catch (error) {
      console.timeEnd("fillDatabase");
      return false;
    }
  };

  render() {
    return (
      <div className="App">
        <Login administradores={this.state.administradores} />
      </div>
    );
  }
}

export default App;

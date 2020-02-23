import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import {
  Container,
  ExpansionPanel,
  Typography,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";

// CSS
import "./style.css";

export default function EscolherCondominio(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;
  const [selected, setSelected] = useState({ id: -1 });
  const navigate = useNavigate();

  console.log("Entrou em EscolherCondominio: ", footbar);
  console.log("DATA FROM FIRST SCREEN:", data);

  useEffect(() => {
    // async function getCondominios() {
    //   console.time("getCondominios");
    //   const condominios = await window.ipcRenderer.invoke("condominios", {
    //     method: "index",
    //     content: null
    //   });
    //   console.log(condominios);
    //   setData({
    //     ...data,
    //     condominios: [...condominios]
    //   });
    //   console.timeEnd("getCondominios");
    //   console.log(data);
    // }
    // getCondominios();
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR"
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: "CADASTRAR"
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "CONTINUAR"
        }
      ],
      action: -1
    });
    return () => console.log("EscolherCondominio - Encerrou");
  }, []);

  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("Login - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/"); // vai pra tela de cadastro
        break;
      case 1:
        console.log("Login - Botão do centro");
        setFootbar({ ...footbar, action: -1 });
        break;
      case 2:
        console.log("Login - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        break;
    }
  }, [footbar.action]);

  useEffect(() => {
    console.log("Condomínio selecionado:", selected);
    setFootbar({
      ...footbar,
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR"
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: "CADASTRAR"
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: selected.id !== -1,
          value: "CONTINUAR"
        }
      ]
    });
  }, [selected.id]);

  function handleChange(string) {
    console.log(string);
  }

  return (
    <div id="EscolherCondominio">
      <h1 className="PageTitle">Selecione o Condomínio</h1>
      {/* <Container maxWidth="xl">
        {data.condominios.map(condominio => (
          <ExpansionPanel
            key={condominio.id}
            onChange={() => handleChange(condominio.id)}
          >
            <ExpansionPanelSummary expandIcon={"+"} id="condominio.id">
              <Typography>{condominio.nome}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{JSON.stringify(condominio)}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </Container> */}
    </div>
  );
}

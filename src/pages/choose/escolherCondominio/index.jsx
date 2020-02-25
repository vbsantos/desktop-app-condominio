import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import {
  List,
  ListItem,
  Container,
  Typography,
  ListItemText,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";

// CSS
import "./style.css";

// DIALOGS
import RegistrarCondominio from "../../../dialogs/registrarCondominio";

export default function EscolherCondominio(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;
  const [selected, setSelected] = useState({ id: -1 });
  const navigate = useNavigate();
  // Boolean for Dialog
  const [dialog, setDialog] = useState(false);

  console.log(
    "Entrou em EscolherCondominio\nFootbar:",
    footbar,
    "\nData:",
    data
  );

  // This function runs only when the component is monted
  useEffect(() => {
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

  // This function runs only when the dialog status is closed
  useEffect(() => {
    async function getEverything() {
      console.time("getEverything");
      const response = await window.ipcRenderer.invoke("beneficiarios", {
        method: "showNested",
        content: { id: data.beneficiario.id }
      });
      setData({
        ...data,
        allNested: response
      });
      console.timeEnd("getEverything");
      console.log(response);
    }
    getEverything();
  }, [dialog]);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("Login - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/"); // vai pra tela de login
        break;
      case 1:
        console.log("Login - Botão do centro");
        setFootbar({ ...footbar, action: -1 });
        // navigate("/RegistrarCondominio"); // vai pra tela de cadastro de condomínio
        setDialog(true);
        break;
      case 2:
        console.log("Login - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        // navigate("/screen-5"); // vai pra tela de rateamento de contas
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

  console.log(data);
  return (
    <div id="EscolherCondominio">
      {dialog && (
        <RegistrarCondominio
          beneficiario={data.beneficiario}
          //condominio={data.allNested["Condominios"][0]}
          open={[dialog, setDialog]}
        />
      )}

      <h1 className="PageTitle">Selecione o Condomínio</h1>
      {/* TODOS OS CONDOMÍNIOS */}
      <Container maxWidth="xl">
        {/*CADA CONDOMÍNIO*/}
        {typeof data.allNested["Condominios"] !== "undefined" &&
          data.allNested["Condominios"].map(condominio => (
            <ExpansionPanel
              key={condominio.id}
              onChange={() => handleChange("Clicou em " + condominio.nome)}
            >
              <ExpansionPanelSummary expandIcon={"+"} id={condominio.id}>
                <Typography>{condominio.nome}</Typography>
              </ExpansionPanelSummary>
              {/* TODOS OS PAGANTES */}
              <ExpansionPanelDetails>
                <List>
                  {/* CADA PAGANTE */}
                  {condominio["Pagantes"].map(pagante => (
                    <ListItem key={pagante.id}>
                      <ListItemText
                        primary={pagante.complemento}
                        secondary={pagante.nome}
                        onClick={() => handleChange(pagante.id)}
                      />
                    </ListItem>
                  ))}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
      </Container>
    </div>
  );
}

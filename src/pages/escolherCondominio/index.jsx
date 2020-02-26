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
import DialogCondominio from "../../dialogs/condominio";
import DialogExcluirCondominio from "../../dialogs/confirmar";

export default function EscolherCondominio(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // ID of the Condomínio selected
  const [selected, setSelected] = useState({ id: -1 });

  // Boolean for Condomínio expanded panels
  const [expanded, setExpanded] = React.useState(false);

  // Boolean for Form Dialog
  const [formDialog, setFormDialog] = useState(false);

  // Boolean for Confirmation Dialog
  const [destroyDialog, setDestroyDialog] = useState(false);

  // console.log(
  //   "Entrou em EscolherCondominio\nFootbar:",
  //   footbar,
  //   "\nData:",
  //   data
  // );

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

  // This function runs only when the confirm delete dialog is closed
  useEffect(() => {
    if (!destroyDialog) {
      // Started as a bug, now it is a feature
      setSelected({ id: -1 });
      setExpanded(false);
    }
  }, [destroyDialog]);

  // This function runs only when the dialog status is closed
  useEffect(() => {
    if (!formDialog || !destroyDialog) {
      async function getEverything() {
        console.time("getEverything");
        const response = await window.ipcRenderer.invoke("beneficiarios", {
          method: "showNested",
          content: { id: data.beneficiario.id }
        });
        setData({
          ...data,
          allNestedBeneficiario: response
        });
        console.timeEnd("getEverything");
      }
      getEverything();
    }
  }, [formDialog, destroyDialog]);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("Login - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        selected.id === -1 ? navigate("/") : setDestroyDialog(true);
        break;
      case 1:
        console.log("Login - Botão do centro");
        setFootbar({ ...footbar, action: -1 });
        setFormDialog(true);
        break;
      case 2:
        console.log("Login - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        navigate("/"); // vai pra tela de rateamento de contas
        break;
    }
  }, [footbar.action]);

  // This function runs only when a different Condomínio is selected
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
          value: selected.id === -1 ? "VOLTAR" : "EXCLUIR"
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: selected.id === -1 ? "CADASTRAR" : "EDITAR"
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

  const handleClickCondominio = panel => (event, isExpanded) => {
    if (isExpanded) {
      setSelected({ id: panel });
      setExpanded(panel);
      const allNestedCondominio = data.allNestedBeneficiario[
        "Condominios"
      ].filter(condominio => condominio.id == panel)[0];
      setData({ ...data, allNestedCondominio });
    } else {
      setSelected({ id: -1 });
      setExpanded(false);
    }
  };

  function handleClickPagante(string) {
    console.log(string);
  }

  return (
    <div id="EscolherCondominio">
      {formDialog && (
        <DialogCondominio
          beneficiario={data.beneficiario}
          condominio={selected.id === -1 ? undefined : data.allNestedCondominio}
          open={[formDialog, setFormDialog]}
        />
      )}
      {destroyDialog && (
        <DialogExcluirCondominio
          condominio={data.allNestedCondominio}
          open={[destroyDialog, setDestroyDialog]}
        />
      )}
      <h1 className="PageTitle">Selecione o Condomínio</h1>
      {/* TODOS OS CONDOMÍNIOS */}
      <Container maxWidth="xl">
        {/*CADA CONDOMÍNIO*/}
        {typeof data.allNestedBeneficiario["Condominios"] !== "undefined" &&
          data.allNestedBeneficiario["Condominios"].map(condominio => (
            <ExpansionPanel
              key={condominio.id}
              expanded={expanded === condominio.id}
              onChange={handleClickCondominio(condominio.id)}
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
                        onClick={() =>
                          handleClickPagante(
                            pagante.complemento + " " + pagante.nome
                          )
                        }
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

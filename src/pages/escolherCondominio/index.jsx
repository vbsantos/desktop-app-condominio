import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import {
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction
} from "@material-ui/core";

// MATERIAL UI ICONS
import {
  Delete,
  Create,
  HomeWorkOutlined,
  PeopleOutlined,
  PlusOne
} from "@material-ui/icons";

// CSS
import "./style.css";

// DIALOGS
import DialogCondominio from "../../dialogs/condominio";
import DialogExcluirCondominio from "../../dialogs/deletarCondominio";
import DialogPagante from "../../dialogs/pagante";
import DialogExcluirPagante from "../../dialogs/deletarPagante";

export default function EscolherCondominio(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // ID of the selected Condominio
  const [selectedCondominio, setSelectedCondominio] = useState({ id: -1 });

  // ID of the selected Pagante
  const [selectedPagante, setSelectedPagante] = useState({ id: -1 });

  // Boolean for Condominio expanded panels
  const [expanded, setExpanded] = React.useState(false);

  // Boolean for Register Dialog
  const [
    dialogRegisterCondominioForm,
    setDialogRegisterCondominioForm
  ] = useState(false);

  // Boolean for Edit Dialog
  const [dialogEditCondominioForm, setDialogEditCondominioForm] = useState(
    false
  );

  // Boolean for Delete Confirmation Dialog
  const [dialogDeleteCondominio, setDialogDeleteCondominio] = useState(false);

  // Boolean for Register Dialog
  const [dialogRegisterPaganteForm, setDialogRegisterPaganteForm] = useState(
    false
  );

  // Boolean for Edit Dialog
  const [dialogEditPaganteForm, setDialogEditPaganteForm] = useState(false);

  // Boolean for Delete Confirmation Dialog
  const [dialogDeletePagante, setDialogDeletePagante] = useState(false);

  console.groupCollapsed("EscolherCondominio: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("EscolherCondominio: System data");

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
          visible: false,
          enabled: false,
          value: ""
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

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("EscolherCondominio - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/");
        break;
      case 2:
        console.log("EscolherCondominio - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        navigate("/RegistrarDespesas"); // vai pra tela de rateamento de contas
        break;
    }
  }, [footbar.action]);

  // This function runs only when a different Condominio is selectedCondominio
  useEffect(() => {
    console.log("Condominio selecionado:", selectedCondominio);
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
          visible: false,
          enabled: false,
          value: ""
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: selectedCondominio.id !== -1,
          value: "CONTINUAR"
        }
      ]
    });
  }, [selectedCondominio.id]);

  // This function runs only when the confirm delete Condominio dialog is closed
  useEffect(() => {
    if (!dialogDeleteCondominio) {
      // Started as a bug, now it is a feature
      setSelectedCondominio({ id: -1 });
      setExpanded(false);
    }
  }, [dialogDeleteCondominio]);

  // This function runs only when the all dialogs are closed
  useEffect(() => {
    data.beneficiario.id || navigate("/"); //corrects development bug when reloading pages
    const allDialogsClosed = !(
      dialogRegisterCondominioForm ||
      dialogDeleteCondominio ||
      dialogEditCondominioForm ||
      dialogRegisterPaganteForm ||
      dialogDeletePagante ||
      dialogEditPaganteForm
    );
    if (allDialogsClosed) {
      async function getEverything() {
        console.time("Get all data from database");
        const response = await window.ipcRenderer.invoke("beneficiarios", {
          method: "showNested",
          content: { id: data.beneficiario.id }
        });
        selectedCondominio.id === -1
          ? setData({
              ...data,
              allNestedBeneficiario: response
            })
          : setData({
              ...data,
              allNestedBeneficiario: response,
              allNestedCondominio: response["Condominios"].filter(
                condominio => condominio.id == selectedCondominio.id
              )[0]
            });
        console.timeEnd("Get all data from database");
      }
      getEverything();
    }
  }, [
    dialogRegisterCondominioForm,
    dialogDeleteCondominio,
    dialogEditCondominioForm,
    dialogRegisterPaganteForm,
    dialogDeletePagante,
    dialogEditPaganteForm
  ]);

  const handleCondominioClick = panel => (event, isExpanded) => {
    if (isExpanded) {
      setSelectedCondominio({ id: panel });
      setExpanded(panel);
      const allNestedCondominio = data.allNestedBeneficiario[
        "Condominios"
      ].filter(condominio => condominio.id === panel)[0];
      setData({ ...data, allNestedCondominio });
    } else {
      setSelectedCondominio({ id: -1 });
      setExpanded(false);
    }
  };

  function handleCondominioEdit(e) {
    // console.log("Editar Condomínio", selectedCondominio.id);
    setDialogEditCondominioForm(true);
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  function handleCondominioDelete(e) {
    // console.log("Deletar Condomínio", selectedCondominio.id);
    setDialogDeleteCondominio(true);
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  function hadleCondominioRegister() {
    // console.log("Cadastrar Condomínio");
    setDialogRegisterCondominioForm(true);
  }

  function handlePaganteEdit(paganteId) {
    // console.log("Editar Pagante", paganteId);
    setSelectedPagante({ id: paganteId });
    setDialogEditPaganteForm(true);
  }

  function handlePaganteDelete(paganteId) {
    // console.log("Deletar Pagante", paganteId);
    setSelectedPagante({ id: paganteId });
    setDialogDeletePagante(true);
  }

  function hadlePaganteRegister() {
    // console.log("Cadastrar Pagante");
    setDialogRegisterPaganteForm(true);
  }

  return (
    <div id="EscolherCondominio">
      {/* CONDOMINIO DIALOGS */}
      {dialogRegisterCondominioForm && (
        <DialogCondominio
          open={[dialogRegisterCondominioForm, setDialogRegisterCondominioForm]}
          delete={[dialogDeleteCondominio, setDialogDeleteCondominio]}
          beneficiario={data.beneficiario}
        />
      )}
      {dialogEditCondominioForm && (
        <DialogCondominio
          open={[dialogEditCondominioForm, setDialogEditCondominioForm]}
          delete={[dialogDeleteCondominio, setDialogDeleteCondominio]}
          beneficiario={data.beneficiario}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogDeleteCondominio && (
        <DialogExcluirCondominio
          open={[dialogDeleteCondominio, setDialogDeleteCondominio]}
          condominio={data.allNestedCondominio}
        />
      )}
      {/* PAGANTE DIALOGS */}
      {dialogRegisterPaganteForm && (
        <DialogPagante
          open={[dialogRegisterPaganteForm, setDialogRegisterPaganteForm]}
          delete={[dialogDeletePagante, setDialogDeletePagante]}
          condominio={selectedCondominio}
        />
      )}
      {dialogEditPaganteForm && (
        <DialogPagante
          open={[dialogEditPaganteForm, setDialogEditPaganteForm]}
          delete={[dialogDeletePagante, setDialogDeletePagante]}
          condominio={selectedCondominio}
          pagante={
            data.allNestedCondominio["Pagantes"].filter(
              pagante => pagante.id === selectedPagante.id
            )[0]
          }
        />
      )}
      {dialogDeletePagante && (
        <DialogExcluirPagante
          open={[dialogDeletePagante, setDialogDeletePagante]}
          pagante={
            data.allNestedCondominio["Pagantes"].filter(
              pagante => pagante.id === selectedPagante.id
            )[0]
          }
        />
      )}
      <h1 className="PageTitle">Selecione o Condominio</h1>
      {/* TODOS OS CONDOMINIOS */}
      <Container maxWidth="xl">
        {/*CADA CONDOMINIO*/}
        {typeof data.allNestedBeneficiario["Condominios"] !== "undefined" &&
          data.allNestedBeneficiario["Condominios"].map(condominio => (
            <ExpansionPanel
              elevation={condominio.id === selectedCondominio.id ? 10 : 3}
              key={condominio.id}
              expanded={expanded === condominio.id}
              onChange={handleCondominioClick(condominio.id)}
            >
              <ExpansionPanelSummary expandIcon={"+"}>
                <div className="leftCondominioItens">
                  <HomeWorkOutlined />
                  <h3>{condominio.nome}</h3>
                </div>
                {condominio.id === selectedCondominio.id && (
                  <div className="rightCondominioItens">
                    <p className="EditIcon" onClick={handleCondominioEdit}>
                      <Create />
                      Editar
                    </p>
                    <p className="DeleteIcon" onClick={handleCondominioDelete}>
                      <Delete />
                      Deletar
                    </p>
                  </div>
                )}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {/* TODOS OS PAGANTES */}
                <List dense>
                  {/* CADA PAGANTE */}
                  {condominio["Pagantes"].map(pagante => (
                    <ListItem key={pagante.id}>
                      <ListItemAvatar>
                        <PeopleOutlined />
                      </ListItemAvatar>
                      <p>
                        <strong>{pagante.complemento}</strong>
                        {" " + pagante.nome}
                      </p>
                      <ListItemSecondaryAction>
                        <div className="rightCondominioItens">
                          <p
                            className="EditIcon"
                            onClick={() => handlePaganteEdit(pagante.id)}
                          >
                            <Create />
                            Editar
                          </p>
                          <p
                            className="DeleteIcon"
                            onClick={() => handlePaganteDelete(pagante.id)}
                          >
                            <Delete />
                            Deletar
                          </p>
                        </div>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {/* BOTÃO DE ADICIONAR PAGANTE */}
                  <ListItem
                    key={-1}
                    id="PaganteRegisterLink"
                    onClick={hadlePaganteRegister}
                  >
                    <ListItemAvatar>
                      <PlusOne />
                    </ListItemAvatar>
                    <p>
                      <strong>Adicionar novo morador</strong>
                    </p>
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        {/* BOTÃO DE ADICIONAR CONDOMINIO */}
        <ExpansionPanel
          id="CondominioRegisterLink"
          elevation={0}
          key={-1}
          expanded={false}
        >
          <ExpansionPanelSummary onClick={hadleCondominioRegister}>
            <div className="leftCondominioItens">
              <PlusOne />
              <h3>Adicionar Novo Condomínio</h3>
            </div>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </Container>
    </div>
  );
}

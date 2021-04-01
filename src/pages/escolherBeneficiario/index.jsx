import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import {
  FormControl,
  InputLabel,
  NativeSelect,
  ButtonGroup,
  Button,
} from "@material-ui/core";

// CSS
import "./style.css";

// DIALOGS
import DialogBeneficiario from "../../dialogs/beneficiario";
import DialogExcluirBeneficiario from "../../dialogs/deletarBeneficiario";

export default function EscolherBeneficiario(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // List of Beneficiários
  const [list, setList] = useState([]);

  // ID of the Beneficiário selected
  const [selected, setSelected] = useState({ id: -1 });

  // Boolean for Register Dialog
  const [dialogRegisterForm, setDialogRegisterForm] = useState(false);

  // Boolean for Edit Dialog
  const [dialogEditForm, setDialogEditForm] = useState(false);

  // Boolean for Confirmation Dialog
  const [dialogDelete, setDialogDelete] = useState(false);

  console.groupCollapsed("EscolherBeneficiario: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("EscolherBeneficiario: System data");

  // This function runs only when the component is monted
  useEffect(() => {
    if (data.systemVersion !== "") {
      console.warn("App Version:", data.systemVersion);
    }
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "SAIR",
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: "",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "CONTINUAR",
        },
      ],
      action: -1,
    });
    return () => console.log("EscolherBeneficiário - Encerrou");
  }, []);

  // This function runs only when the all dialogs are closed closed
  useEffect(() => {
    const allDialogsClosed = !(
      dialogRegisterForm ||
      dialogDelete ||
      dialogEditForm
    );
    if (allDialogsClosed) {
      async function getBeneficiarios() {
        console.time("Get beneficiarios from database");
        const beneficiarios = await window.ipcRenderer.invoke("beneficiarios", {
          method: "index",
          content: null,
        });
        setList([...beneficiarios]);
        if (
          beneficiarios.find(
            (beneficiario) => beneficiario.id === selected.id
          ) === undefined
        ) {
          setSelected({ id: -1 });
        }
        console.timeEnd("Get beneficiarios from database");
        return beneficiarios.length > 0 ? true : false;
      }
      getBeneficiarios();
    }
  }, [dialogRegisterForm, dialogDelete, dialogEditForm]);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    async function next() {
      switch (footbar.action) {
        case 0:
          console.log("EscolherBeneficiario - Botão da esquerda");
          setFootbar({ ...footbar, action: -1 });
          window.close(); // sai do sistema
          break;
        case 1:
          console.log("EscolherBeneficiario - Botão do centro");
          setFootbar({ ...footbar, action: -1 });
          break;
        case 2:
          console.log("EscolherBeneficiario - Botão da direita");
          const beneficiario = list.find((a) => a.id === selected.id);
          const allNestedBeneficiario = await window.ipcRenderer.invoke(
            "beneficiarios",
            {
              method: "showNested",
              content: { id: beneficiario.id },
            }
          );
          setData({
            ...data,
            beneficiario,
            allNestedBeneficiario,
          });
          setFootbar({
            ...footbar,
            action: -1,
          });
          navigate("/EscolherCondominio"); // vai pra tela de condominios
          break;
      }
    }
    next();
  }, [footbar.action]);

  // This function runs only when a different Beneficiário is selected
  useEffect(() => {
    console.log("Beneficiário selecionado:", selected);
    setFootbar({
      ...footbar,
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "SAIR",
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: "",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: selected.id !== -1,
          value: "CONTINUAR",
        },
      ],
    });
  }, [selected.id]);

  function beneficiarioSelected(id) {
    setSelected({ id: Number(id) });
  }

  return (
    <div id="EscolherBeneficiario">
      {dialogRegisterForm && (
        <DialogBeneficiario
          open={[dialogRegisterForm, setDialogRegisterForm]}
          delete={[dialogDelete, setDialogDelete]}
        />
      )}
      {dialogEditForm && (
        <DialogBeneficiario
          beneficiario={list.find((a) => a.id === selected.id)}
          open={[dialogEditForm, setDialogEditForm]}
          delete={[dialogDelete, setDialogDelete]}
        />
      )}
      {dialogDelete && (
        <DialogExcluirBeneficiario
          beneficiario={list.find((a) => a.id === selected.id)}
          open={[dialogDelete, setDialogDelete]}
        />
      )}
      <h1 className="PageTitle">Gestão de Condomínios</h1>
      <div className="UserInputs">
        <FormControl>
          <InputLabel htmlFor="administrator">Administrador</InputLabel>
          <NativeSelect
            id="administrator"
            className="Selector"
            onChange={(e) => beneficiarioSelected(e.target.value)}
          >
            <option key={-1} value={-1}>
              {""}
            </option>
            {list.map((beneficiario) => (
              <option key={beneficiario.id} value={beneficiario.id}>
                {beneficiario.nome}
              </option>
            ))}
          </NativeSelect>
          <ButtonGroup className="Buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDialogRegisterForm(true)}
            >
              Cadastrar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={selected.id === -1}
              onClick={() => setDialogEditForm(true)}
            >
              Alterar
            </Button>
          </ButtonGroup>
        </FormControl>
      </div>
    </div>
  );
}

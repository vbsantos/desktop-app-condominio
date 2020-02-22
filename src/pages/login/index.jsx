import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import DropdownInput from "../../components/dropdownInput";

// CSS
import "./style.css";

export default function Login(props) {
  const [admin, setAdmin] = useState([]);
  const [footbar, setFootbar] = props.buttons;
  const [selected, setSelected] = useState({ id: -1 });
  const navigate = useNavigate();

  console.log("ao entrar em Login: ", footbar);

  useEffect(() => {
    getAdministradores();
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "SAIR"
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
      action: -1,
      data: footbar.data
    });
    return () => console.log("Login - Encerrou");
  }, []);

  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("Login - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        window.close();
        break;
      case 1:
        console.log("Login - Botão do centro");
        setFootbar({ ...footbar, action: -1 });
        navigate("/screen-2");
        break;
      case 2:
        console.log("Login - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        break;
      // default:
      //   console.log("footbar.action resetado");
    }
  }, [footbar.action]);

  useEffect(() => {
    console.log("ENABLING", selected);
    setFootbar({
      ...footbar,
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "SAIR"
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
          enabled: selected.id != -1,
          value: "CONTINUAR"
        }
      ]
    });
  }, [selected.id]);

  async function getAdministradores() {
    console.time("getAdministradores");
    const beneficiarios = await window.ipcRenderer.invoke("beneficiarios", {
      method: "index",
      content: null
    });
    setAdmin([...beneficiarios]);
    console.timeEnd("getAdministradores");
    return beneficiarios.length > 0 ? true : false;
  }

  return (
    <div id="Login">
      <h1 className="PageTitle">Selecione o Beneficiário</h1>
      <DropdownInput
        className="DropdownInput"
        selected={[selected, setSelected]}
        options={admin}
      />
    </div>
  );
}

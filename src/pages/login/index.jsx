import React, { useState, useEffect } from "react";

// COMPONENTS
import DropdownInput from "../../components/dropdownInput";

// CSS
import "./style.css";

export default function Login(props) {
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    init();
    return () => console.log("Cleanup function - Login encerrou");
  }, []);

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

  async function init() {
    const administradores = await getAdministradores();
    console.assert(administradores, "Erro ao buscar administradores!");
  }

  return (
    <div id="Login">
      <h1 className="PageTitle">Selecione o Beneficiário</h1>
      <DropdownInput className="DropdownInput" options={admin} />
    </div>
  );
}

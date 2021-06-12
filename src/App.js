import React, { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";

// ROTAS
import Routes from "./routes";

// CSS
import "./style.css";

// IMAGES
import logo from "./assets/icon.png";

export default function App() {
  // true when the migrations and seeds already ran
  const [config, setConfig] = useState({ done: false });

  useEffect(() => {
    if (!config.done) {
      async function runMigrations() {
        console.time("runMigrations");
        const migrations = await window.ipcRenderer.invoke("database", {
          method: "migrations",
          content: null,
        });
        console.timeEnd("runMigrations");
        return migrations;
      }
      async function initDatabase() {
        const migrations = await runMigrations();
        console.assert(migrations, "Erro ao rodar as migrations!");
        //const seeds = await fillDatabase();
        //console.assert(seeds, "Erro ao rodar as seeds!");
        setConfig({ done: true });
      }
      initDatabase();
    }
    return () => console.log("Cleanup function - App encerrou");
  }, []);

  return (
    <div id="App">
      {config.done ? (
        <HashRouter>
          <Routes />
        </HashRouter>
      ) : (
        <div id="LoadingContainer">
          <div id="Loading">
            <img src={logo} width="50%" />
            <h2>Por favor aguarde enquanto o sistema carrega...</h2>
          </div>
        </div>
      )}
    </div>
  );
}

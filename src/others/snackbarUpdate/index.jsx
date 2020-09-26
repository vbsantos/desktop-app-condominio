import React, { useState, useEffect } from "react";

// MATERIAL UI COMPONENTS
import { CircularProgress, Snackbar } from "@material-ui/core";

// COMPONENTS
import CircularProgressWithLabel from "../../components/circularProgressWithLabel";

// CSS
import "./style.css";

export default function UpdateSnackbar(props) {
  // boolean that opens and closes this snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(true);

  // boolean that indicates end of update
  const [updateEnd, setUpdateEnd] = useState(false);

  // object with interface data
  const [snackbarInterface, setSnackbarInterface] = useState({
    symbol: <CircularProgress color={"secondary"} />,
    text: <p>Procurando por Atualização</p>,
  });

  const updateStatus = (msg, error, speed, percent) => {
    switch (msg) {
      case "checking-for-update":
        setUpdateEnd(false);
        return {
          symbol: <CircularProgress color={"primary"} />,
          text: <p>Procurando por nova versão</p>,
        };

      case "update-available":
        setUpdateEnd(false);
        return {
          symbol: <CircularProgress color={"primary"} />,
          text: <p>Nova versão encontrada</p>,
        };

      case "update-not-available":
        setUpdateEnd(true);
        return {
          symbol: (
            <CircularProgress
              color={"secondary"}
              variant="static"
              value={100}
            />
          ),
          text: <p>O sistema já está na última versão</p>,
        };

      case "error":
        setUpdateEnd(true);
        console.error(error);
        return {
          symbol: (
            <CircularProgress
              color={"secondary"}
              variant="static"
              value={100}
            />
          ),
          text: <p>Erro, tentaremos mais tarde</p>,
        };

      case "download-progress":
        setUpdateEnd(false);
        return {
          symbol: <CircularProgressWithLabel value={percent} />,
          text: <p>Baixando: {`${(speed / 1000).toFixed(1)} kb/s`}</p>,
        };

      case "update-downloaded":
        setUpdateEnd(true);
        return {
          symbol: <CircularProgressWithLabel value={100} />,
          text: <p>Feche o sistema para instalar</p>,
        };
    }
  };

  useEffect(() => {
    (async () => {
      window.ipcRenderer.on("update", (event, arg) => {
        const { msg, error, speed, percent } = arg;
        // console.log("[UPDATE EVENT]:", arg);
        setSnackbarInterface(updateStatus(msg, error, speed, percent));
      });

      const res = await window.ipcRenderer.invoke("update", {
        method: "check",
        content: null,
      });

      if (res === null) {
        console.error("Não é possível atualizar a versão de desenvolvimento");
        setSnackbarInterface({
          symbol: (
            <CircularProgress
              color={"secondary"}
              variant="static"
              value={100}
            />
          ),
          text: <p>Erro ao procurar por uma nova versão</p>,
        });
        setUpdateEnd(true);
      }
    })();
  }, []);

  const handleClose = () => {
    updateEnd && setSnackbarOpen(false);
  };

  return (
    <div id="snackbarSystemUpdate">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={snackbarOpen}
        onClose={handleClose}
        message={
          <>
            {snackbarInterface.symbol}
            {snackbarInterface.text}
          </>
        }
        key={"snackbar_top_left"}
      />
    </div>
  );
}

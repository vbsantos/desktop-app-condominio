import React, { useState, useEffect } from "react";

// MATERIAL UI COMPONENTS
import { Snackbar } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

// CSS
import "./style.css";

// MATERIAL UI ICONS
import { GetApp as DownloadIcon } from "@material-ui/icons";

export default function UpdateSnackbar(props) {
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const [updateEnd, setUpdateEnd] = useState(false);
  const [snackbarInterface, setSnackbarInterface] = useState({
    symbol: <CircularProgress color={"secondary"} />,
    text: <p>Procurando por Atualização</p>,
  });

  const status = {
    "checking-for-update": {
      symbol: <CircularProgress color={"secondary"} />,
      text: <p>Procurando por Atualização</p>,
    },
    "update-available": {
      symbol: <CircularProgress color={"secondary"} />,
      text: <p>Atualização Encontrada</p>,
    },
    "update-not-available": {
      symbol: <CircularProgress color={"secondary"} />,
      text: <p>Atualização não encontrada</p>,
    },
    error: {
      symbol: <CircularProgress color={"secondary"} />,
      text: <p>Erro</p>,
    },
    "download-progress": {
      symbol: <CircularProgress color={"secondary"} />,
      text: <p>Baixando</p>,
    },
    "update-downloaded": {
      symbol: <CircularProgress color={"secondary"} />,
      text: <p>Atualização Baixada</p>,
    },
  };

  useEffect(() => {
    (async () => {
      window.ipcRenderer.on("update", (event, arg) => {
        console.warn("[UPDATE]:", arg.msg);
        console.warn("[UPDATE STATUS]:", status.arg.msg);

        setSnackbarInterface(status.arg.msg);
      });

      const res = await window.ipcRenderer.invoke("update", {
        method: "check",
        content: null,
      });
    })();
  }, []);

  const handleClose = () => {
    // REVIEW só fecha a snackbar depois que receber um event determinado
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

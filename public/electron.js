const { app, BrowserWindow, ipcMain } = require("electron");
const Log = require("electron-log");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
const Path = require("path");

let win;

//-------------------------------------------------------------------
// IPC Communication
//-------------------------------------------------------------------

const ipcEvents = require("./ipcEvents.js");

//-------------------------------------------------------------------
// Logger & Auto-Updater
//-------------------------------------------------------------------

ipcMain.handle("update", async (event, arg) => {
  const { method } = arg;
  let status;
  try {
    switch (method) {
      case "check":
        console.log("entrada:", arg);
        const sendToFrontend = (data) => {
          win.webContents.send("update", data);
        };
        autoUpdater.on("checking-for-update", () => {
          sendToFrontend({
            msg: "checking-for-update",
            error: null,
            speed: null,
            percent: null,
          });
        });
        autoUpdater.on("update-available", (info) => {
          sendToFrontend({
            msg: "update-available",
            error: null,
            speed: null,
            percent: null,
          });
        });
        autoUpdater.on("update-not-available", (info) => {
          sendToFrontend({
            msg: "update-not-available",
            error: null,
            speed: null,
            percent: null,
          });
        });
        autoUpdater.on("error", (err) => {
          sendToFrontend({ msg: "error", error: err });
        });
        autoUpdater.on("download-progress", (progressObj) => {
          sendToFrontend({
            msg: "download-progress",
            error: null,
            speed: progressObj.bytesPerSecond,
            percent: progressObj.percent,
          });
        });
        autoUpdater.on("update-downloaded", (info) => {
          sendToFrontend({
            msg: "update-downloaded",
            error: null,
            speed: null,
            percent: null,
          });
        });
        status = await autoUpdater.checkForUpdatesAndNotify();
        console.log("saida:", status);
        break;
      default:
        console.log({ error: "This method do not exist." });
    }
    return status;
  } catch (error) {
    console.log("Erro no ipcEvents:", error);
    return { error };
  }
});

//-------------------------------------------------------------------
// Window
//-------------------------------------------------------------------

const createDefaultWindow = () => {
  win = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      preload: Path.join(__dirname, "preload.js"),
    },
  });

  // page zoom disabled
  win.webContents.on("did-finish-load", () => {
    win.setMenuBarVisibility(false);
    if (isDev) {
      win.webContents.openDevTools();
    }
  });

  win.on("closed", () => {
    win = null;
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${Path.join(__dirname, "..", "build", "index.html")}`
  );

  return win;
};

app.on("ready", () => {
  try {
    createDefaultWindow();
  } catch (error) {
    Log.info("Startup Sequence Error:", error);
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

const { app, BrowserWindow } = require("electron");
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

autoUpdater.logger = Log;
autoUpdater.logger.transports.file.level = "info";

const sendStatusToWindow = text => {
  Log.info(text);
  win.webContents.send("message", text);
};

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", info => {
  sendStatusToWindow("Update available.");
});

autoUpdater.on("update-not-available", info => {
  sendStatusToWindow("Update not available.");
});

autoUpdater.on("error", err => {
  sendStatusToWindow("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", progressObj => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow("Update downloaded");
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
      preload: Path.join(__dirname, "preload.js")
    }
  });

  // page zoom disabled
  win.webContents.on("did-finish-load", () => {
    win.webContents.setZoomFactor(1);
    win.webContents.setVisualZoomLevelLimits(1, 1);
    win.webContents.setLayoutZoomLevelLimits(0, 0);
  });

  // menu disabled
  win.setMenuBarVisibility(false);

  if (isDev) {
    win.webContents.openDevTools();
  }

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
  // Create the Menu
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
  try {
    createDefaultWindow();
    autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    Log.info("Startup Sequence Error:", error);
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

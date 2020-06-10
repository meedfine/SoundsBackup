"use strict";
declare const __static: any;
import { app, protocol, BrowserWindow, Tray, screen, ipcMain, Rectangle, dialog } from "electron";
import { createProtocol, installVueDevtools } from "vue-cli-plugin-electron-builder/lib";
import path from "path";
import axios from "axios";
import { autoUpdater, Logger } from "electron-updater";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;
let trayIcon: Tray;
let trayWin: BrowserWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

function createMain() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    frame: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      // enableRemoteModule: false,
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.once("ready-to-show", () => {
    win && win.show();
  });
  win.on("close", e => {
    e.preventDefault();
    win.hide();
    win.setSkipTaskbar(true);
  });
  win.on("closed", () => {
    (win as any) = null;
  });
  win.on("resize", () => {
    win.webContents.send("resizeWindow", win.isMaximized());
  });
  win.on("will-resize", (event, bounds) => {
    if (bounds.width < 1000 || bounds.height < 600) {
      event.preventDefault();
    }
  });
}
function createTray() {
  // 先创托盘窗口，保证id为1的是托盘，以后的是页面
  trayIcon = new Tray(path.join(__static, "favicon.ico"));
  trayWin = new BrowserWindow({
    width: 220,
    height: 330,
    type: "toolbar",
    frame: false,
    alwaysOnTop: true,
    fullscreenable: false,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  trayWin.on("blur", () => {
    trayWin.hide();
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    trayWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/#/trayMenu");
  } else {
    createProtocol("app");
    trayWin.loadURL("app://./index.html/#/trayMenu");
  }
  trayIcon.on("click", () => {
    win.show();
    win.setSkipTaskbar(false);
  });
  trayIcon.on("right-click", () => {
    const { x, y } = screen.getCursorScreenPoint();
    trayWin.setBounds({
      x: x - trayWin.getSize()[0] > 0 ? x - (trayWin.getSize()[0] + 5) : x,
      y: y - trayWin.getSize()[1] > 0 ? y - (trayWin.getSize()[1] + 5) : y
    } as Rectangle);
    trayWin.show();
  });
}

function checkClient() {
  const message = {
    error: "检查更新出错",
    checking: "正在检查更新……",
    updateAva: "检测到新版本，可更新",
    updateNotAva: "现在使用的就是最新版本，不用更新"
  };
  // disabled force updater
  autoUpdater.autoDownload = !1;
  autoUpdater.on("error", function() {
    win &&
      win.webContents.send("updateClient", {
        type: "error",
        value: message.error
      });
  });
  autoUpdater.on("checking-for-update", function() {
    win &&
      win.webContents.send("updateClient", {
        type: "checking",
        value: message.checking
      });
  });
  autoUpdater.on("update-available", function(info) {
    win &&
      win.webContents.send("updateClient", {
        type: "updateAva",
        value: message.updateAva,
        ...info
      });
  });
  autoUpdater.on("update-not-available", function() {
    win &&
      win.webContents.send("updateClient", {
        type: "updateNotAva",
        value: message.updateNotAva
      });
  });
  // 更新下载进度事件
  autoUpdater.on("download-progress", function(progress) {
    win &&
      win.webContents.send("updateClient", {
        type: "progress",
        value: progress
      });
  });
  // 更新下载完成事件
  autoUpdater.on("update-downloaded", function() {
    // 发送是否立即更新事件
    win &&
      win.webContents.send("updateClient", {
        type: "downloadUpdate",
        value: true
      });
    setImmediate(() => {
      // 因为close事件使用了preventDefault  所以手动关掉窗口
      win.destroy();
      autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.logger = require("electron-log");
  (autoUpdater.logger as any).transports.file.level = "info";
  (autoUpdater.logger as Logger).info("App starting...");
  autoUpdater.checkForUpdates();
}

function downloadClient() {
  autoUpdater.downloadUpdate();
}

function checkContent() {
  axios.get("//cdn.517la.net/js/testUpdate/version.json").then(res => {
    // const updatePath = res.data.latest;
    const updateMd5 = res.data.latestMd5;
    if (updateMd5 !== "000000") {
      win &&
        win.webContents.send("updateContent", {
          type: "updateContent",
          value: "内容更新可用"
        });
    }
  });
}

function downloadContent() {
  axios
    .get("//cdn.517la.net/js/testUpdate/0328test.zip", {
      responseType: "arraybuffer"
    })
    .then(res => {
      console.log(res);
    });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createMain();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // 当运行第二个实例时,将会聚焦到win这个窗口
    if (win) {
      win.show();
    }
  });
  app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installVueDevtools();
      } catch (e) {
        // console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    createTray();
    createMain();
  });
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("showWindow", () => {
  win.show();
  win.setSkipTaskbar(false);
});
ipcMain.on("closeWindow", () => {
  win.hide();
  win.setSkipTaskbar(true);
});
ipcMain.on("hideWindow", () => {
  win.minimize();
});
ipcMain.on("minimaxWindow", () => {
  win.isMaximized() ? win.unmaximize() : win.maximize();
});
ipcMain.on("checkClient", () => {
  checkClient();
});
ipcMain.on("downloadClient", () => {
  downloadClient();
});
ipcMain.on("checkContent", () => {
  checkContent();
});
ipcMain.on("downloadContent", () => {
  downloadContent();
});
ipcMain.on("getAppInfo", () => {
  const appInfo = {
    version: app.getVersion(),
    name: app.getName()
  };
  win && win.webContents.send("getAppInfo", appInfo);
});
ipcMain.on("openDirectoryDialog", () => {
  dialog.showOpenDialog({ title: "选择目录", properties: ["openDirectory"] }).then(res => {
    win && win.webContents.send("openDirectoryDialog", res.filePaths[0]);
    return;
  });
});
ipcMain.on("exitAPP", () => {
  app.exit();
});

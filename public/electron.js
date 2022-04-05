const electron = require("electron");
const ipc = electron.ipcMain;
const app = electron.app;
const { BrowserWindow } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
// const startIPerf3 = require('../src/pages/RunTraffic/iperf3Test/Iperf3Desktop')
const { Iperf3 } = require("node-iperf3");

let mainWindow;

function createWindow() {
  // Define the applications dimension
  mainWindow = new electron.BrowserWindow({
    width: 1440,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      enableRemoteModule: true,
    },
  });
  // Determine what to render based on environment
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Show chrome developer tools when in dev environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  // Create event to close window on close
  mainWindow.on("closed", () => (mainWindow = null));
}

// On launch create app window
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  // Based on which operating system you are using
  if (process.platform !== "linux") {
    // If os not linux, close the app
    // you can add darwin(mac os), win64 and so many more
    app.quit();
  }
});

ipc.on("msg", (event, data) => {
  if (data === "iperf3 Download Data") {
    event.reply("reply", " sending iperf3 Download Data");
    let iperf3Instance = new Iperf3(["-c", "192.168.0.119"]);
    // console.log("iperf3Instance ", iperf3Instance);
    iperf3Instance.start();

    iperf3Instance.on("interval", (interval) => {
      event.reply("Interval DL", interval);
      console.log(`Interval throughput Download: ${interval}`);
    });

    iperf3Instance.on("receiver", (interval) => {
      event.reply("Receiver DL", interval);
      console.log(`Receiver throughput Download: ${interval}`);
    });
  } else if (data === "iperf3 Upload Data") {
    event.reply("reply", " sending iperf3 Upload Data");
    let iperf3Instance = new Iperf3(["-c", "192.168.0.119", "-R"]);
    console.log("iperf3Instance ", iperf3Instance);
    iperf3Instance.start();

    iperf3Instance.on("interval", (interval) => {
      event.reply("Interval UL", interval);
      console.log(`Interval throughput Upload: ${interval}`);
    });

    iperf3Instance.on("receiver", (interval) => {
      event.reply("Receiver UL", interval);
      console.log(`Receiver throughput Upload: ${interval}`);
    });
  }
});

// Browser functionality in Main Process
ipc.on("BrowserMessage", async (event, data) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
  });
  console.log("Website finished loading. Fetching timings...");

  win.webContents.once("dom-ready", async () => {
    function startTime() {
      return win.webContents.executeJavaScript(
        "window.performance.timing.navigationStart"
      );
    }

    function endTime() {
      return win.webContents.executeJavaScript(
        "window.performance.timing.loadEventEnd"
      );
    }

    async function getTotalCount() {
      var firstCount = await startTime().then((value) => {
        console.log(`startTime: ${value}`);
        return value;
      });
      var secondCount = await endTime().then((value) => {
        console.log(`endTime: ${value}`);
        return value;
      });
      return (secondCount - firstCount) / 1000;
    }
    getTotalCount().then((value) => {
      console.log(`getTotalCount: ${value}s`);
      // event.reply("reply", value);
      event.returnValue = value;
      win.close();
    });

    win.webContents.session.clearCache(() => {
      console.log("Cache cleared!");
    });
   
  });
  // Load a remote URL
  win.loadURL(data);
  return;
});

app.on("activate", () => {
  if (mainWindow !== null) {
    createWindow();
  }
});

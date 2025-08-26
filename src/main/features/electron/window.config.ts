import { is } from "@electron-toolkit/utils";
import icon from "@resources/logo.png?asset";
import { BrowserWindow, shell } from "electron";
import { join } from "path";
import { ConfigRepository } from "@main/features/database/repository/config-repository";

let resizeTimeout: NodeJS.Timeout | null = null;

export const setupWindowConfig = async (
  app: Electron.App,
): Promise<BrowserWindow> => {

  const configRepository = new ConfigRepository();
  const config = await configRepository.getConfig();
  console.log(
    "current window config",
    config?.windowWidth,
    config?.windowHeight,
  );
  const mainWindow = new BrowserWindow({
    width: config?.windowWidth || 1024,
    height: config?.windowHeight || 768,
    minWidth: 450,
    minHeight: 500,
    skipTaskbar: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    show: false, // start hidden
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
    title: "AI Assistant Studio",
  });

  app.setName("AI Assistant Studio");

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  mainWindow.on("resize", async () => {
    if (!mainWindow) return;

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(async () => {
      const [width, height] = mainWindow.getSize();
      if (!width || !height) return;

      console.log("saveConfig", {
        windowWidth: width,
        windowHeight: height,
      });
      await configRepository.saveConfig({
        windowWidth: width,
        windowHeight: height,
      });
    }, 3000);
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("ready-to-show", () => {
    if (
      process.argv.includes("--hidden") ||
      process.execArgv.includes("--hidden") ||
      app.getLoginItemSettings().wasOpenedAtLogin
    ) {
      return;
    }
    mainWindow?.show();
  });

  return mainWindow;
};

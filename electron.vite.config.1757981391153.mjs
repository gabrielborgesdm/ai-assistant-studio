// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var __electron_vite_injected_dirname = "C:\\www_personal\\ai-assistant-studio";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@global": resolve(__electron_vite_injected_dirname, "src/global"),
        "@resources": resolve(__electron_vite_injected_dirname, "resources"),
        "@main": resolve(__electron_vite_injected_dirname, "src/main"),
        "@preload": resolve(__electron_vite_injected_dirname, "src/preload")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@global": resolve(__electron_vite_injected_dirname, "src/global"),
        "@resources": resolve(__electron_vite_injected_dirname, "resources"),
        "@main": resolve(__electron_vite_injected_dirname, "src/main"),
        "@preload": resolve(__electron_vite_injected_dirname, "src/preload")
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve(__electron_vite_injected_dirname, "src/renderer/src"),
        "@global": resolve(__electron_vite_injected_dirname, "src/global"),
        "@": resolve(__electron_vite_injected_dirname, "src/renderer/src"),
        "@resources": resolve(__electron_vite_injected_dirname, "resources")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};

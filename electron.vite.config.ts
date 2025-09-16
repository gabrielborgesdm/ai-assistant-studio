import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@global": resolve(__dirname, "src/global"),
        "@resources": resolve(__dirname, "resources"),
        "@main": resolve(__dirname, "src/main"),
        "@preload": resolve(__dirname, "src/preload"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@global": resolve(__dirname, "src/global"),
        "@resources": resolve(__dirname, "resources"),
        "@main": resolve(__dirname, "src/main"),
        "@preload": resolve(__dirname, "src/preload"),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve(__dirname, "src/renderer/src"),
        "@global": resolve(__dirname, "src/global"),
        "@": resolve(__dirname, "src/renderer/src"),
        "@resources": resolve(__dirname, "resources"),
      },
    },
    plugins: [react()],
  },
});

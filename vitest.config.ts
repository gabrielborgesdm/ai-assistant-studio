import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@test": path.resolve(__dirname, "src/test"),
    },
  },
  test: {
    // Use the 'jsdom' environment to simulate a browser environment for testing
    environment: "jsdom",
    // Enable globals so you don't have to import `describe`, `it`, etc.
    globals: true,
    // Increase the default test timeout to 30 seconds for long-running tests
    testTimeout: 30000,
    // A setup file to run before each test file
    setupFiles: "./vitest.setup.ts",
    // Include all files in the src directory that end with .test.ts or .spec.ts
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    // Exclude node_modules, dist, and out directories from tests
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache", "out"],
    // Enable rich UI for test results
    // Configure the UI host and port
    ui: true,
  },
});

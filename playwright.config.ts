import { defineConfig, devices } from "@playwright/test";

const runtimeProcess: unknown = Reflect.get(globalThis, "process");
const runtimeEnvironment: unknown = typeof runtimeProcess === "object" && runtimeProcess !== null
  ? Reflect.get(runtimeProcess, "env")
  : null;
const requestedPort: unknown = typeof runtimeEnvironment === "object" && runtimeEnvironment !== null
  ? Reflect.get(runtimeEnvironment, "PLAYWRIGHT_PORT")
  : null;
const previewPort = typeof requestedPort === "string" ? requestedPort : "4173";
const previewUrl = `http://127.0.0.1:${previewPort}/dostavay/`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: previewUrl,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run build && npm exec vite preview -- --host 127.0.0.1 --port ${previewPort}`,
    url: previewUrl,
    reuseExistingServer: false,
  },
});

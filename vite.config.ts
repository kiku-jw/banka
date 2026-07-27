import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/dostavay/",
  build: {
    target: "es2022",
  },
  test: {
    environment: "node",
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
  },
});

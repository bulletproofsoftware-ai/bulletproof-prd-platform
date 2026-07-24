import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    exclude: ["node_modules", "e2e"],
  },
});

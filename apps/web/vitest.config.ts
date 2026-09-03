import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const appTests = "src/**/*.test.{ts,tsx}";
const legacyLocaleRedirectTest = "src/lib/legacy-locale-redirect.test.ts";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "parallel",
          include: [appTests],
          exclude: [legacyLocaleRedirectTest],
          sequence: { groupOrder: 0 },
        },
      },
      {
        extends: true,
        test: {
          name: "next-integration",
          include: [legacyLocaleRedirectTest],
          environment: "node",
          fileParallelism: false,
          sequence: { groupOrder: 1 },
        },
      },
    ],
  },
});

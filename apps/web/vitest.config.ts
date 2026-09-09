import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const appTests = "src/**/*.test.{ts,tsx}";
const legacyLocaleRedirectTest = "src/lib/legacy-locale-redirect.test.ts";
const heavyHomeRenderTests = [
  "src/components/site-shell.test.tsx",
  "src/components/home/home-living-archive.test.tsx",
];

const srcRoot = fileURLToPath(new URL("./src", import.meta.url));
const studioRoot = fileURLToPath(new URL("./src/app/[locale]/(studio)", import.meta.url));
const careerRoot = fileURLToPath(new URL("./src/app/[locale]/(career)", import.meta.url));
const studioLocaleLayoutHarness = fileURLToPath(
  new URL("./src/test-support/studio-locale-layout.tsx", import.meta.url),
);

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/app/[locale]/layout", replacement: studioLocaleLayoutHarness },
      { find: "@/app/[locale]/page", replacement: `${studioRoot}/page` },
      { find: "@/app/[locale]/about", replacement: `${studioRoot}/about` },
      {
        find: "@/app/[locale]/built-with-skills",
        replacement: `${studioRoot}/built-with-skills`,
      },
      { find: "@/app/[locale]/changelog", replacement: `${studioRoot}/changelog` },
      { find: "@/app/[locale]/contribute", replacement: `${studioRoot}/contribute` },
      {
        find: "@/app/[locale]/getting-started",
        replacement: `${studioRoot}/getting-started`,
      },
      { find: "@/app/[locale]/packs", replacement: `${studioRoot}/packs` },
      { find: "@/app/[locale]/roadmap", replacement: `${studioRoot}/roadmap` },
      { find: "@/app/[locale]/skills", replacement: `${studioRoot}/skills` },
      {
        find: "@/app/[locale]/career-lab",
        replacement: `${careerRoot}/career-lab`,
      },
      { find: "@", replacement: srcRoot },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "parallel",
          include: [appTests],
          exclude: [legacyLocaleRedirectTest, ...heavyHomeRenderTests],
          sequence: { groupOrder: 0 },
        },
      },
      {
        extends: true,
        test: {
          name: "home-render",
          include: heavyHomeRenderTests,
          fileParallelism: false,
          sequence: { groupOrder: 1 },
        },
      },
      {
        extends: true,
        test: {
          name: "next-integration",
          include: [legacyLocaleRedirectTest],
          environment: "node",
          fileParallelism: false,
          sequence: { groupOrder: 2 },
        },
      },
    ],
  },
});

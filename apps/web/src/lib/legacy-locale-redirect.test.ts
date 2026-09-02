// @vitest-environment node

import { spawn, type ChildProcess } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { isFixtureLocationSafe } from "./next-request-fixture";

const webRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const fixtureEntries = [
  "next.config.ts",
  "next-env.d.ts",
  "package.json",
  "postcss.config.mjs",
  "src",
  "tsconfig.json",
] as const;

function createNextRequestFixture(): string {
  const fixtureRoot = mkdtempSync(resolve(webRoot, "..", "next-locale-redirect-"));

  for (const entry of fixtureEntries) {
    cpSync(resolve(webRoot, entry), resolve(fixtureRoot, entry), {
      recursive: true,
      filter: (source) => !/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(source),
    });
  }
  symlinkSync(
    resolve(webRoot, "node_modules"),
    resolve(fixtureRoot, "node_modules"),
    process.platform === "win32" ? "junction" : "dir",
  );

  return fixtureRoot;
}

async function reservePort(): Promise<number> {
  const server = createServer();

  await new Promise<void>((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Unable to reserve a local port");
  }

  await new Promise<void>((resolveClose, reject) => {
    server.close((error) => (error ? reject(error) : resolveClose()));
  });

  return address.port;
}

async function waitForServer(child: ChildProcess, url: string, logs: () => string) {
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready\n${logs()}`);
    }

    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolveWait) => setTimeout(resolveWait, 50));
    }
  }

  throw new Error(`Next.js did not become ready\n${logs()}`);
}

async function stopServer(child: ChildProcess) {
  if (child.exitCode !== null) return;

  child.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resolveExit) => child.once("exit", () => resolveExit())),
    new Promise<void>((resolveWait) => setTimeout(resolveWait, 2_000)),
  ]);

  if (child.exitCode === null) child.kill("SIGKILL");
}

describe("legacy Portuguese locale redirect", () => {
  it("rejects a fixture outside the web root when it crosses Windows volumes", () => {
    expect(
      isFixtureLocationSafe(
        "D:\\a\\agent-skills\\agent-skills\\apps\\web",
        "C:\\Users\\runneradmin\\AppData\\Local\\Temp\\next-locale-redirect-123",
        "win32",
      ),
    ).toBe(false);
    expect(
      isFixtureLocationSafe(
        "D:\\a\\agent-skills\\agent-skills\\apps\\web",
        "D:\\a\\agent-skills\\agent-skills\\apps\\next-locale-redirect-123",
        "win32",
      ),
    ).toBe(true);
  });

  it("creates its Next project outside the Vitest project root on the same volume", () => {
    const fixtureRoot = createNextRequestFixture();

    try {
      expect(isFixtureLocationSafe(webRoot, fixtureRoot)).toBe(true);
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });

  it("does not copy test sources into the temporary Next project", () => {
    const fixtureRoot = createNextRequestFixture();

    try {
      const copiedTests = readdirSync(resolve(fixtureRoot, "src"), {
        encoding: "utf8",
        recursive: true,
      }).filter((entry) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(entry));
      expect(copiedTests).toEqual([]);
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });

  it(
    "redirects only legacy casing and serves the canonical request without another redirect",
    async () => {
      const fixtureRoot = createNextRequestFixture();
      const port = await reservePort();
      const origin = `http://127.0.0.1:${port}`;
      const nextBin = resolve(webRoot, "node_modules/next/dist/bin/next");

      const child = spawn(
        process.execPath,
        [
          nextBin,
          "dev",
          "--webpack",
          "--hostname",
          "127.0.0.1",
          "--port",
          String(port),
        ],
        {
          cwd: fixtureRoot,
          env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      let logs = "";
      child.stdout?.on("data", (chunk) => {
        logs += chunk.toString();
      });
      child.stderr?.on("data", (chunk) => {
        logs += chunk.toString();
      });

      try {
        await waitForServer(child, `${origin}/en`, () => logs);

        const legacyResponse = await fetch(`${origin}/pt-br/skills`, {
          redirect: "manual",
        });
        expect(legacyResponse.status).toBe(308);
        expect(new URL(legacyResponse.headers.get("location") ?? "", origin).pathname).toBe(
          "/pt-BR/skills",
        );

        const canonicalResponse = await fetch(`${origin}/pt-BR/skills`, {
          redirect: "manual",
        });
        const canonicalBody = await canonicalResponse.text();
        expect(
          canonicalResponse.status,
          `canonical response body:\n${canonicalBody}\nNext.js logs:\n${logs}`,
        ).toBe(200);
        expect(canonicalResponse.headers.get("location")).toBeNull();
      } finally {
        await stopServer(child);
        rmSync(fixtureRoot, {
          recursive: true,
          force: true,
          maxRetries: 10,
          retryDelay: 100,
        });
      }
    },
    45_000,
  );
});

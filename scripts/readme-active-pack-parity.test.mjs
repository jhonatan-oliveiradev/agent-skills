import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function activePackSlugs() {
  const packDir = path.join(root, "catalog", "packs");
  const files = (await readdir(packDir)).filter((name) => name.endsWith(".json"));
  const packs = await Promise.all(
    files.map(async (name) => JSON.parse(await readFile(path.join(packDir, name), "utf8"))),
  );

  return packs
    .filter((pack) => pack.status === "active")
    .map((pack) => pack.slug)
    .sort();
}

function sectionBetween(source, startHeading, endHeading) {
  const start = source.indexOf(startHeading);
  assert.notEqual(start, -1, `missing README heading: ${startHeading}`);

  const end = source.indexOf(endHeading, start + startHeading.length);
  assert.notEqual(end, -1, `missing README heading: ${endHeading}`);

  return source.slice(start, end);
}

test("lists every active pack in both README catalog sections", async () => {
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  const activePacks = await activePackSlugs();
  const english = sectionBetween(
    readme,
    "## Catalog and thematic packs",
    "## Catálogo e pacotes temáticos (Português)",
  );
  const portugueseStart = readme.indexOf("## Catálogo e pacotes temáticos (Português)");
  assert.notEqual(portugueseStart, -1);
  const nextHeading = readme.indexOf("\n## ", portugueseStart + 1);
  const portuguese = readme.slice(
    portugueseStart,
    nextHeading === -1 ? readme.length : nextHeading,
  );

  for (const slug of activePacks) {
    const marker = `- \`${slug}\``;
    assert.ok(english.includes(marker), `English README is missing ${slug}`);
    assert.ok(portuguese.includes(marker), `PT-BR README is missing ${slug}`);
  }

  assert.match(english, /All eleven published packs are active and installable\./);
  assert.match(portuguese, /Todos os onze pacotes publicados estão ativos e são instaláveis\./);
});

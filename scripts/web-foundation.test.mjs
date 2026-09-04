import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('repository exposes complete web gates and Vercel policy', () => {
  const root = JSON.parse(readFileSync('package.json', 'utf8'));
  const web = JSON.parse(readFileSync('apps/web/package.json', 'utf8'));
  const workflow = readFileSync('.github/workflows/validate.yml', 'utf8');
  const readme = readFileSync('README.md', 'utf8');
  const gitignore = readFileSync('.gitignore', 'utf8');

  for (const [script, command] of [
    ['web:test', 'npm --prefix apps/web test'],
    ['web:typecheck', 'npm --prefix apps/web run typecheck'],
    ['web:lint', 'npm --prefix apps/web run lint'],
    ['web:build', 'npm --prefix apps/web run build'],
  ]) {
    assert.equal(root.scripts[script], command, `incorrect ${script}`);
  }

  assert.equal(web.scripts.pretest, 'node scripts/sync-catalog.mjs');
  assert.equal(
    web.scripts.pretypecheck,
    'node scripts/sync-catalog.mjs && next typegen',
  );
  assert.equal(web.scripts.typecheck, 'tsc --noEmit');
  assert.equal(
    web.scripts.predev,
    'node ../../scripts/generate-skill-zips.mjs && node ../../scripts/generate-pack-zips.mjs && node scripts/sync-catalog.mjs',
  );
  assert.equal(
    web.scripts.prebuild,
    'node ../../scripts/generate-skill-zips.mjs && node ../../scripts/generate-pack-zips.mjs && node scripts/sync-catalog.mjs',
  );
  assert.match(gitignore, /^apps\/web\/public\/downloads\/skills\/$/m);
  assert.match(gitignore, /^apps\/web\/public\/downloads\/packs\/$/m);

  let previousIndex = -1;
  for (const command of [
    'npm test',
    'npm run validate',
    'npm ci --prefix apps/web',
    'npm run web:test',
    'npm run web:typecheck',
    'npm run web:lint',
    'npm run web:build',
  ]) {
    const commandIndex = workflow.indexOf(`- run: ${command}`);
    assert.ok(commandIndex > previousIndex, `${command} is missing or out of order`);
    previousIndex = commandIndex;
  }

  assert.match(readme, /Root Directory.*apps\/web/i);
  assert.match(readme, /dev.*pre-production/i);
  assert.match(readme, /main.*production/i);
});

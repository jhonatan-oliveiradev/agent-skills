import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('repository exposes complete web gates and Vercel policy', () => {
  const root = JSON.parse(readFileSync('package.json', 'utf8'));
  const workflow = readFileSync('.github/workflows/validate.yml', 'utf8');
  const readme = readFileSync('README.md', 'utf8');

  for (const script of ['web:test', 'web:typecheck', 'web:lint', 'web:build']) {
    assert.ok(root.scripts[script], `missing ${script}`);
  }

  assert.match(workflow, /npm ci --prefix apps\/web/);
  assert.match(workflow, /npm run web:build/);
  assert.match(readme, /Root Directory.*apps\/web/i);
  assert.match(readme, /dev.*pre-production/i);
  assert.match(readme, /main.*production/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { deduceScope, generateCommitProposals } from '../src/analyzer.js';

test('deduceScope identifies scope from single file directory', () => {
  const staged = [{ status: 'M', file: 'src/auth/jwt.js' }];
  assert.equal(deduceScope(staged), 'auth');
});

test('deduceScope identifies readme scope', () => {
  const staged = [{ status: 'M', file: 'README.md' }];
  assert.equal(deduceScope(staged), 'readme');
});

test('deduceScope identifies dependencies scope', () => {
  const staged = [{ status: 'M', file: 'package.json' }];
  assert.equal(deduceScope(staged), 'deps');
});

test('generateCommitProposals generates documentation proposals for markdown', () => {
  const staged = [{ status: 'M', file: 'README.md' }];
  const proposals = generateCommitProposals('', staged);

  assert.ok(proposals.length > 0);
  assert.ok(proposals[0].startsWith('docs(readme):'));
});

test('generateCommitProposals detects bug fix signals in diff', () => {
  const staged = [{ status: 'M', file: 'src/api/handler.js' }];
  const diff = '+ // fix: handle null pointer exception when token is undefined';
  const proposals = generateCommitProposals(diff, staged);

  const hasFix = proposals.some((p) => p.startsWith('fix('));
  assert.ok(hasFix, 'Should propose fix message when fix keywords exist in diff');
});

test('generateCommitProposals detects new feature file additions', () => {
  const staged = [{ status: 'A', file: 'src/cli.js' }];
  const proposals = generateCommitProposals('', staged);

  const hasFeat = proposals.some((p) => p.startsWith('feat('));
  assert.ok(hasFeat, 'Should propose feat message when files are added');
});

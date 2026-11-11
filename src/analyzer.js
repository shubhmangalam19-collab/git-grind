import path from 'node:path';

/**
 * Extracts the most relevant architectural scope from changed file paths.
 * @param {Array<{ status: string, file: string }>} stagedFiles
 * @returns {string}
 */
export function deduceScope(stagedFiles) {
  if (!stagedFiles || stagedFiles.length === 0) return '';
  if (stagedFiles.length === 1) {
    const file = stagedFiles[0].file;
    const base = path.basename(file, path.extname(file)).toLowerCase();
    const dir = path.dirname(file).split(/[\/\\]/).filter(Boolean).pop();

    if (file.toLowerCase().includes('readme')) return 'readme';
    if (file.toLowerCase().includes('package.json')) return 'deps';
    if (file.toLowerCase().includes('workflow') || file.includes('.github')) return 'ci';
    if (file.toLowerCase().includes('test') || file.toLowerCase().includes('spec')) return 'test';
    if (dir && dir !== '.' && dir !== 'src') return dir.toLowerCase();
    return base || '';
  }

  // Multi-file scope: check common directory
  const dirs = stagedFiles.map((f) => {
    const parts = path.dirname(f.file).split(/[\/\\]/).filter((p) => p !== '.' && p !== 'src');
    return parts[0] || '';
  }).filter(Boolean);

  if (dirs.length > 0 && dirs.every((d) => d === dirs[0])) {
    return dirs[0].toLowerCase();
  }

  // Detect common themes across files
  const allFiles = stagedFiles.map((f) => f.file.toLowerCase());
  if (allFiles.every((f) => f.endsWith('.md'))) return 'docs';
  if (allFiles.every((f) => f.includes('test') || f.includes('spec'))) return 'tests';
  if (allFiles.every((f) => f.includes('.github') || f.includes('workflow'))) return 'ci';
  if (allFiles.some((f) => f.includes('package.json') || f.includes('lock'))) return 'deps';

  return '';
}

/**
 * Analyzes the diff text and staged files to produce intelligent commit proposals.
 * @param {string} diff
 * @param {Array<{ status: string, file: string }>} stagedFiles
 * @returns {Array<string>}
 */
export function generateCommitProposals(diff, stagedFiles) {
  const scope = deduceScope(stagedFiles);
  const scopePrefix = scope ? `(${scope})` : '';

  const addedFiles = stagedFiles.filter((f) => f.status.startsWith('A'));
  const deletedFiles = stagedFiles.filter((f) => f.status.startsWith('D'));
  const modifiedFiles = stagedFiles.filter((f) => f.status.startsWith('M'));

  const diffLower = (diff || '').toLowerCase();
  const addedLines = (diff || '')
    .split('\n')
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    .map((l) => l.slice(1).trim().toLowerCase())
    .join(' ');

  const proposals = [];

  // 1. Documentation detection
  const isAllDocs = stagedFiles.every((f) => f.file.endsWith('.md') || f.file.endsWith('.txt'));
  if (isAllDocs) {
    proposals.push(`docs${scopePrefix}: update documentation and guides`);
    proposals.push(`docs${scopePrefix}: clarify setup and usage instructions`);
    proposals.push(`docs${scopePrefix}: improve structure and examples`);
    return proposals;
  }

  // 2. Dependency / Configuration changes
  const isDeps = stagedFiles.some((f) => f.file.includes('package.json') || f.file.includes('requirements.txt'));
  if (isDeps) {
    proposals.push(`chore${scopePrefix}: update project dependencies and configurations`);
  }

  // 3. CI/CD Workflows
  const isCI = stagedFiles.some((f) => f.file.includes('.github') || f.file.includes('workflow') || f.file.includes('action'));
  if (isCI) {
    proposals.push(`ci${scopePrefix}: configure automated build and deployment workflows`);
  }

  // 4. Testing
  const isTests = stagedFiles.some((f) => f.file.includes('test') || f.file.includes('spec'));
  if (isTests) {
    proposals.push(`test${scopePrefix}: add unit and integration test coverage`);
  }

  // 5. Bug Fix Signals
  const fixKeywords = ['fix', 'bug', 'issue', 'error', 'null', 'undefined', 'exception', 'catch', 'resolve', 'crash'];
  const hasFixSignals = fixKeywords.some((word) => diffLower.includes(word));
  if (hasFixSignals) {
    proposals.push(`fix${scopePrefix}: resolve edge case in handler logic`);
    proposals.push(`fix${scopePrefix}: handle error states and improve stability`);
  }

  // 6. New Features / Additions Signals
  if (addedFiles.length > 0) {
    const mainAdded = addedFiles.map((f) => path.basename(f.file, path.extname(f.file))).join(', ');
    proposals.push(`feat${scopePrefix}: implement initial ${mainAdded || 'modules'}`);
    proposals.push(`feat${scopePrefix}: add support for new feature components`);
  } else if (modifiedFiles.length > 0) {
    proposals.push(`feat${scopePrefix}: enhance core implementation logic`);
    proposals.push(`refactor${scopePrefix}: restructure internal logic for clarity`);
  }

  // 7. Deletions / Removals
  if (deletedFiles.length > 0) {
    const mainDeleted = deletedFiles.map((f) => path.basename(f.file)).join(', ');
    proposals.push(`chore${scopePrefix}: remove deprecated ${mainDeleted}`);
  }

  // 8. Style / Clean-up
  proposals.push(`style${scopePrefix}: polish formatting and code style`);

  // Ensure unique, clean, conventional proposals (limit to top 4)
  const unique = Array.from(new Set(proposals));
  return unique.slice(0, 5);
}

import { execSync } from 'node:child_process';

/**
 * Executes a git command safely and returns standard output trimmed.
 * @param {string} command
 * @returns {string}
 */
export function execGit(command) {
  try {
    return execSync(`git ${command}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    throw new Error(error.stderr ? error.stderr.trim() : error.message);
  }
}

/**
 * Checks if the current directory is inside a Git repository.
 * @returns {boolean}
 */
export function isInsideGitRepo() {
  try {
    execGit('rev-parse --is-inside-work-tree');
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the current active branch name.
 * @returns {string}
 */
export function getCurrentBranch() {
  try {
    return execGit('rev-parse --abbrev-ref HEAD');
  } catch {
    return 'main';
  }
}

/**
 * Gets a list of currently staged files with their status (A, M, D, R, etc.).
 * @returns {Array<{ status: string, file: string }>}
 */
export function getStagedFiles() {
  try {
    const output = execGit('diff --cached --name-status');
    if (!output) return [];

    return output
      .split('\n')
      .map((line) => {
        const parts = line.split('\t');
        return {
          status: parts[0]?.trim() || 'M',
          file: parts[1]?.trim() || parts[0]?.trim()
        };
      })
      .filter((item) => Boolean(item.file));
  } catch {
    return [];
  }
}

/**
 * Gets a list of unstaged or untracked changes.
 * @returns {Array<string>}
 */
export function getUnstagedFiles() {
  try {
    const statusOutput = execGit('status --porcelain');
    if (!statusOutput) return [];

    return statusOutput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Stages all tracked and untracked changes (git add -A).
 */
export function stageAll() {
  execGit('add -A');
}

/**
 * Retrieves the full diff of staged changes.
 * @returns {string}
 */
export function getStagedDiff() {
  try {
    return execGit('diff --cached');
  } catch {
    return '';
  }
}

/**
 * Commits staged changes with a commit message.
 * @param {string} message
 * @returns {string}
 */
export function commitChanges(message) {
  // Escape double quotes in message
  const escaped = message.replace(/"/g, '\\"');
  return execGit(`commit -m "${escaped}"`);
}

/**
 * Pushes the current branch to its upstream remote.
 * @returns {string}
 */
export function pushToRemote() {
  const branch = getCurrentBranch();
  return execGit(`push -u origin ${branch}`);
}

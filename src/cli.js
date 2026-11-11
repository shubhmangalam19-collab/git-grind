import { intro, outro, spinner, select, text, confirm, note, isCancel, cancel } from '@clack/prompts';
import pc from 'picocolors';
import {
  isInsideGitRepo,
  getStagedFiles,
  getUnstagedFiles,
  stageAll,
  getStagedDiff,
  commitChanges,
  pushToRemote,
  getCurrentBranch
} from './git.js';
import { generateCommitProposals } from './analyzer.js';

export async function run(args = []) {
  // Command line flags
  const isHelp = args.includes('-h') || args.includes('--help');
  const isVersion = args.includes('-v') || args.includes('--version');
  const isAutoStage = args.includes('-a') || args.includes('--all');
  const isAutoPush = args.includes('-p') || args.includes('--push');
  const isDryRun = args.includes('-d') || args.includes('--dry-run');

  if (isVersion) {
    console.log(`git-grind v1.0.0`);
    return;
  }

  if (isHelp) {
    console.log(`
${pc.bold(pc.cyan('⚡ git-grind'))} - The Intelligent Conventional Commit CLI

${pc.bold('USAGE:')}
  $ ${pc.green('npx git-grind')} [options]
  $ ${pc.green('gg')} [options]

${pc.bold('OPTIONS:')}
  -a, --all      Stage all tracked & untracked files automatically
  -p, --push     Automatically push to remote branch after committing
  -d, --dry-run  Generate and display commit message without committing
  -v, --version  Show current version
  -h, --help     Show this help menu
`);
    return;
  }

  console.log();
  intro(pc.bgCyan(pc.black(' ⚡ GIT-GRIND: CONVENTIONAL COMMIT ENGINE ')));

  // 1. Verify Git Repository
  if (!isInsideGitRepo()) {
    cancel(pc.red('Error: Not inside a Git repository. Run this inside a project initialized with git.'));
    process.exit(1);
  }

  // 2. Check Staged Changes
  let staged = getStagedFiles();

  if (staged.length === 0) {
    const unstaged = getUnstagedFiles();

    if (unstaged.length === 0) {
      outro(pc.yellow('✨ Working tree clean. No changes to commit.'));
      return;
    }

    if (isAutoStage) {
      stageAll();
      staged = getStagedFiles();
    } else {
      const shouldStage = await confirm({
        message: `No staged changes found, but ${pc.cyan(unstaged.length)} file(s) modified. Stage all changes now?`,
        initialValue: true
      });

      if (isCancel(shouldStage) || !shouldStage) {
        cancel('Commit aborted. Stage your changes with `git add` and run `git-grind` again.');
        process.exit(0);
      }

      const s = spinner();
      s.start('Staging all files (`git add -A`)...');
      stageAll();
      staged = getStagedFiles();
      s.stop('Files staged successfully.');
    }
  }

  // 3. Display Staged Summary
  const fileSummary = staged
    .map((item) => {
      const prefix = item.status.startsWith('A')
        ? pc.green('+')
        : item.status.startsWith('D')
        ? pc.red('-')
        : pc.yellow('~');
      return `  ${prefix} ${item.file}`;
    })
    .join('\n');

  note(fileSummary, pc.bold(`Staged Files (${staged.length})`));

  // 4. Generate Proposals
  const s = spinner();
  s.start('Analyzing git diff and synthesizing Conventional Commits...');
  const diff = getStagedDiff();
  const proposals = generateCommitProposals(diff, staged);
  s.stop('Proposals synthesized.');

  // 5. Select or Custom Commit
  const options = proposals.map((msg, index) => ({
    value: msg,
    label: `${pc.cyan(`[${index + 1}]`)} ${msg}`
  }));

  options.push({ value: '__EDIT__', label: pc.yellow('✏️  Edit one of the proposals...') });
  options.push({ value: '__CUSTOM__', label: pc.magenta('💬  Write custom commit message...') });
  options.push({ value: '__CANCEL__', label: pc.gray('❌  Cancel') });

  const chosen = await select({
    message: 'Select a commit message:',
    options
  });

  if (isCancel(chosen) || chosen === '__CANCEL__') {
    cancel('Commit aborted.');
    process.exit(0);
  }

  let finalMessage = chosen;

  if (chosen === '__EDIT__') {
    const toEdit = await select({
      message: 'Choose a proposal to edit:',
      options: proposals.map((p) => ({ value: p, label: p }))
    });

    if (isCancel(toEdit)) {
      cancel('Commit aborted.');
      process.exit(0);
    }

    finalMessage = await text({
      message: 'Edit commit message:',
      initialValue: toEdit,
      validate(val) {
        if (!val || val.trim().length === 0) return 'Commit message cannot be empty.';
      }
    });

    if (isCancel(finalMessage)) {
      cancel('Commit aborted.');
      process.exit(0);
    }
  } else if (chosen === '__CUSTOM__') {
    finalMessage = await text({
      message: 'Enter your commit message:',
      placeholder: 'feat(core): implement new feature',
      validate(val) {
        if (!val || val.trim().length === 0) return 'Commit message cannot be empty.';
      }
    });

    if (isCancel(finalMessage)) {
      cancel('Commit aborted.');
      process.exit(0);
    }
  }

  // 6. Dry Run Check
  if (isDryRun) {
    note(finalMessage, pc.bold('Dry-Run Commit Message'));
    outro(pc.green('Dry-run complete. No changes were committed.'));
    return;
  }

  // 7. Commit
  const commitSpinner = spinner();
  commitSpinner.start(`Committing with message: "${finalMessage}"...`);

  try {
    commitChanges(finalMessage);
    commitSpinner.stop(pc.green('Changes successfully committed! 🚀'));
  } catch (err) {
    commitSpinner.stop(pc.red('Commit failed.'));
    console.error(err.message);
    process.exit(1);
  }

  // 8. Push to Remote
  const branch = getCurrentBranch();
  let shouldPush = isAutoPush;

  if (!isAutoPush) {
    const pushAnswer = await confirm({
      message: `Push to remote branch (${pc.cyan(branch)}) now?`,
      initialValue: false
    });

    if (!isCancel(pushAnswer) && pushAnswer) {
      shouldPush = true;
    }
  }

  if (shouldPush) {
    const pushSpinner = spinner();
    pushSpinner.start(`Pushing commits to origin/${branch}...`);
    try {
      pushToRemote();
      pushSpinner.stop(pc.green(`Pushed to origin/${branch} successfully! 🌐`));
    } catch (pushErr) {
      pushSpinner.stop(pc.yellow(`Notice: Push skipped or failed (${pushErr.message}).`));
    }
  }

  outro(pc.bold(pc.cyan('⚡ Keep on the #GitHubGrind! Star & streak growing.')));
}

#!/usr/bin/env node

import { run } from '../src/cli.js';

run(process.argv.slice(2)).catch((err) => {
  console.error('\nFatal error in git-grind:', err);
  process.exit(1);
});

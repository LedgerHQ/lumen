#!/usr/bin/env node
import { run } from './run.js';

process.exitCode = run(process.argv.slice(2), {
  cwd: process.cwd(),
  write: (text) => console.log(text),
});

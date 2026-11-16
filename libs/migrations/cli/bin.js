#!/usr/bin/env node
import { run } from './run.js';

try {
  process.exitCode = run(process.argv.slice(2), {
    cwd: process.cwd(),
    write: (text) => console.log(text),
  });
} catch (error) {
  // An uncaught error would exit 1, which callers read as "migrations pending".
  console.error(error);
  process.exitCode = 3;
}

#!/usr/bin/env node
// Screenshots of live docs demos for ds-discovery reports, taken with the local
// Google Chrome through playwright-core (no browser download).
//
//   capture <outDir> '<targets JSON>'
//     targets: [{ "id": "spectrum", "url": "https://…", "near": "textarea" }]
//     `near` is a CSS selector for an element inside the demo (e.g. textarea,
//     [role="tablist"]); the shot is its nearest ancestor of demo size.
//   inline <report.html> <outDir>
//     replaces each {{shot:<id>}} with <outDir>/<id>.png as a data URI, so the
//     report stays one self-contained file and no image data passes through the agent.
//
// playwright-core is installed outside the repo's dependencies, once:
//   npm install --prefix tmp/ds-discovery/tools playwright-core@1
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim();
const [command, ...args] = process.argv.slice(2);

const capture = async (outDir, targetsJson) => {
  const toolsDir = join(root, 'tmp/ds-discovery/tools');
  let chromium;
  try {
    ({ chromium } = createRequire(join(toolsDir, 'package.json'))(
      'playwright-core',
    ));
  } catch {
    console.error(
      `playwright-core is missing. Run: npm install --prefix tmp/ds-discovery/tools playwright-core@1`,
    );
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium
    .launch({ channel: 'chrome', headless: true })
    .catch(() => {
      console.error('Google Chrome is not installed; skip screenshots.');
      process.exit(1);
    });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  for (const { id, url, near } of JSON.parse(targetsJson)) {
    const started = Date.now();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
      const inner = page.locator(near).first();
      await inner.waitFor({ timeout: 15_000 });
      const demo = await inner.evaluateHandle((el) => {
        for (let node = el; node; node = node.parentElement) {
          const { width, height } = node.getBoundingClientRect();
          if (width >= 320 && height >= 90 && height <= 520) return node;
        }
        return el;
      });
      await demo.scrollIntoViewIfNeeded();
      const file = join(outDir, `${id}.png`);
      await demo.screenshot({ path: file });
      console.log(
        `${id}\tok\t${Date.now() - started}ms\t${Math.round(statSync(file).size / 1024)}KB`,
      );
    } catch (error) {
      console.log(`${id}\tfailed\t${error.message.split('\n')[0]}`);
    }
  }
  await browser.close();
};

const inline = (reportPath, outDir) => {
  let html = readFileSync(reportPath, 'utf8');
  html = html.replace(/\{\{shot:([\w-]+)\}\}/g, (placeholder, id) => {
    const file = join(outDir, `${id}.png`);
    if (!existsSync(file)) {
      console.warn(`no screenshot for "${id}"; placeholder left in place`);
      return placeholder;
    }
    return `data:image/png;base64,${readFileSync(file).toString('base64')}`;
  });
  writeFileSync(reportPath, html);
  console.log(
    `inlined screenshots into ${reportPath} (${Math.round(statSync(reportPath).size / 1024)}KB)`,
  );
};

if (command === 'capture' && args.length === 2)
  await capture(resolve(args[0]), args[1]);
else if (command === 'inline' && args.length === 2)
  inline(resolve(args[0]), resolve(args[1]));
else {
  console.error(
    "usage: capture <outDir> '<targets JSON>' | inline <report.html> <outDir>",
  );
  process.exit(1);
}

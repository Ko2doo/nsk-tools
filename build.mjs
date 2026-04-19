import * as fs from 'node:fs';
import * as node_path from 'node:path';

import { build } from 'esbuild';

const __dirname = node_path.resolve();
const { dependencies } = JSON.parse(
  fs.readFileSync(node_path.resolve(__dirname, './package.json'), 'utf-8'),
);

await build({
  entryPoints: ['src/bin/cli.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/bin/cli.js',
  // banner: {
  //   js: '#!/usr/bin/env node', // shebang save
  // },
  external: Object.keys(dependencies),
}).catch(() => process.exit(1));

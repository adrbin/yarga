import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const enabled = process.env.NETLIFY_ENABLE_REDDIT_PROXY === 'true';

const rootDir = process.cwd();
const sourceDir = join(rootDir, 'netlify', 'edge-functions');
const outputDir = join(rootDir, '.netlify', 'edge-functions-build');

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

if (enabled && existsSync(sourceDir)) {
  cpSync(sourceDir, outputDir, { recursive: true });
  console.log('[netlify] reddit proxy edge function enabled');
} else {
  console.log('[netlify] reddit proxy edge function disabled');
}

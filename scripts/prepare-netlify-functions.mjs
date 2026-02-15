import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const enabled = process.env.NETLIFY_ENABLE_REDDIT_PROXY === 'true';

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, 'netlify', 'functions');
const outputDir = path.join(rootDir, '.netlify', 'functions-build');

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

if (enabled && existsSync(sourceDir)) {
  cpSync(sourceDir, outputDir, { recursive: true });
  console.log('[netlify] reddit proxy function enabled');
} else {
  console.log('[netlify] reddit proxy function disabled');
}

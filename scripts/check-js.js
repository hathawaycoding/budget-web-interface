import { readdirSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const includedDirs = ['server', 'public/js', 'scripts'];
const ignoredNames = new Set(['node_modules', '.git']);

function collectJavaScriptFiles(directory) {
  const entries = readdirSync(directory);
  const files = [];

  entries.forEach((entry) => {
    if (ignoredNames.has(entry)) {
      return;
    }

    const filePath = resolve(directory, entry);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      files.push(...collectJavaScriptFiles(filePath));
      return;
    }

    if (extname(filePath) === '.js') {
      files.push(filePath);
    }
  });

  return files;
}

const filesToCheck = includedDirs.flatMap((directory) => collectJavaScriptFiles(resolve(rootDir, directory)));

filesToCheck.forEach((filePath) => {
  execFileSync(process.execPath, ['--check', filePath], { stdio: 'inherit' });
});

console.log(`Checked ${filesToCheck.length} JavaScript files.`);

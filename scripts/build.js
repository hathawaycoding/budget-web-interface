import { accessSync, constants } from 'node:fs';
import { resolve } from 'node:path';

const requiredPaths = [
  'public/index.html',
  'public/css/variables.css',
  'public/js/app.js',
  'server/index.js',
  'server/data/sample-data.js',
];

requiredPaths.forEach((filePath) => {
  accessSync(resolve(process.cwd(), filePath), constants.R_OK);
});

console.log('Build verification passed. Static app assets and server entry are present.');

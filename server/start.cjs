const fs = require('fs');
const path = require('path');

const candidateEntries = [
  path.resolve(__dirname, 'dist', 'index.js'),
  path.resolve(__dirname, '..', 'dist', 'index.js'),
  path.resolve(process.cwd(), 'dist', 'index.js'),
  path.resolve(process.cwd(), '..', 'dist', 'index.js'),
  path.resolve(process.cwd(), 'server', 'dist', 'index.js'),
];

const entryPoint = candidateEntries.find((candidate) => fs.existsSync(candidate));

if (!entryPoint) {
  throw new Error(
    `Unable to find the compiled server entrypoint. Looked in: ${candidateEntries.join(', ')}`,
  );
}

require(entryPoint);
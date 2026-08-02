#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const docsDir = path.resolve('docs');
let failures = 0;

if (!fs.existsSync(docsDir)) {
  console.log('No docs directory found at docs/. Skipping validation.');
  process.exit(0);
}

const adrDir = path.join(docsDir, 'adr');
if (fs.existsSync(adrDir)) {
  const adrFiles = fs.readdirSync(adrDir).filter(f => f.endsWith('.md'));
  for (const file of adrFiles) {
    const filePath = path.join(adrDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('## Status') || !content.includes('## Context') || !content.includes('## Decision')) {
      console.error(`FAIL: [docs/adr/${file}] Missing required ADR headings.`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`Docs validation failed with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log('All documentation files passed validation.');
  process.exit(0);
}

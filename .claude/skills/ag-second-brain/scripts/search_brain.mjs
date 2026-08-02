import fs from 'fs';
import path from 'path';

const vaultDir = '/home/ngxc/workspace/obsidian/my-second-brain';
const query = process.argv.slice(2).join(' ').trim();

if (!query) {
  console.log('Error: Please provide a search query.');
  process.exit(1);
}

const ignoreDirs = ['99_Meta', '40_Archives', '.git', '.obsidian', 'node_modules'];

function getMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        results = results.concat(getMarkdownFiles(filePath));
      }
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  if (!match) return { data: {}, body: content };

  const fmText = match[1];
  const body = content.substring(match[0].length).trim();
  const data = {};

  const lines = fmText.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.substring(0, colonIdx).trim();
    let val = line.substring(colonIdx + 1).trim();

    // Parse simple arrays [a, b, c] or single strings
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.substring(1, val.length - 1)
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''));
    } else {
      val = val.replace(/^["']|["']$/g, '');
    }
    data[key] = val;
  }

  return { data, body };
}

function extractTLDR(body) {
  const tldrRegex = /## TL;DR\r?\n([\s\S]*?)(?=\n##|\n---|$)/;
  const match = body.match(tldrRegex);
  return match ? match[1].trim() : '';
}

function search() {
  const files = getMarkdownFiles(vaultDir);
  const results = [];
  const queryTerms = query.toLowerCase().split(/\s+/);

  for (const file of files) {
    const rawContent = fs.readFileSync(file, 'utf8');
    const { data, body } = parseFrontmatter(rawContent);
    const relativePath = path.relative(vaultDir, file);
    const fileName = path.basename(file, '.md');
    const title = fileName.replace(/_/g, ' ');

    let score = 0;
    const matchedTerms = new Set();

    const tags = Array.isArray(data.tags) ? data.tags : [];
    const aliases = Array.isArray(data.aliases) ? data.aliases : (data.aliases ? [data.aliases] : []);

    for (const term of queryTerms) {
      // 1. Check title/filename
      if (title.toLowerCase().includes(term) || fileName.toLowerCase().includes(term)) {
        score += 15;
        matchedTerms.add(term);
      }

      // 2. Check aliases
      for (const alias of aliases) {
        if (alias.toLowerCase().includes(term)) {
          score += 10;
          matchedTerms.add(term);
        }
      }

      // 3. Check tags
      for (const tag of tags) {
        if (tag.toLowerCase().includes(term)) {
          score += 8;
          matchedTerms.add(term);
        }
      }

      // 4. Check body content
      const bodyLower = body.toLowerCase();
      let occurrences = 0;
      let pos = bodyLower.indexOf(term);
      while (pos !== -1) {
        occurrences++;
        pos = bodyLower.indexOf(term, pos + term.length);
      }
      if (occurrences > 0) {
        score += Math.min(occurrences, 10); // cap at 10 points
        matchedTerms.add(term);
      }
    }

    // Must match at least one query term to be included
    if (matchedTerms.size > 0 && score > 0) {
      results.push({
        path: relativePath,
        title,
        tags,
        aliases,
        tldr: extractTLDR(body),
        body,
        score
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    console.log('NO_MATCHES_FOUND');
    return;
  }

  console.log(`FOUND ${results.length} MATCHING NOTES:\n`);
  for (let i = 0; i < Math.min(results.length, 5); i++) {
    const r = results[i];
    console.log(`---`);
    console.log(`Source: ${r.path}`);
    console.log(`Title: ${r.title}`);
    if (r.tags.length > 0) console.log(`Tags: ${r.tags.join(', ')}`);
    if (r.aliases.length > 0) console.log(`Aliases: ${r.aliases.join(', ')}`);
    if (r.tldr) {
      console.log(`TL;DR:\n${r.tldr}`);
    } else {
      // Show first 200 chars of body
      const cleanBody = r.body.replace(/[#*`]/g, '').trim();
      console.log(`Content Preview:\n${cleanBody.substring(0, 250)}...`);
    }
    console.log(`---`);
  }
}

search();

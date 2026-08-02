#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../..');

const MAX_SKILL_LINES = 150;

/**
 * Parses YAML frontmatter from Markdown string
 */
function parseFrontmatter(content) {
  try {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;

    const rawYaml = match[1];
    const result = {};
    
    for (const line of rawYaml.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        const key = trimmed.slice(0, colonIdx).trim();
        let value = trimmed.slice(colonIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        result[key] = value;
      }
    }

    if (rawYaml.includes('metadata:')) {
      result.metadata = {};
      const lines = rawYaml.split('\n');
      let inMetadata = false;
      for (const l of lines) {
        if (l.trim().startsWith('metadata:')) {
          inMetadata = true;
          continue;
        }
        if (inMetadata) {
          if (l.startsWith('  ') || l.startsWith('\t')) {
            const colonIdx = l.indexOf(':');
            if (colonIdx !== -1) {
              const key = l.slice(0, colonIdx).trim();
              const val = l.slice(colonIdx + 1).trim();
              result.metadata[key] = val;
            }
          } else if (l.trim() && !l.startsWith('#')) {
            inMetadata = false;
          }
        }
      }
    }

    return result;
  } catch (err) {
    return null;
  }
}

/**
 * Validates a single SKILL.md file with safe isolation
 */
function validateSkill(filePath) {
  const errors = [];
  const warnings = [];
  const skillDir = path.dirname(filePath);
  const skillName = path.basename(skillDir);

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return { skillName, filePath, errors: [`Cannot read file: ${e.message}`], warnings: [], lineCount: 0 };
  }

  const lines = content.split(/\r?\n/);
  const isEmpty = content.trim().length === 0;

  if (isEmpty) {
    warnings.push('SKILL.md is empty (uninitialized stub file).');
    return { skillName, filePath, errors, warnings, lineCount: lines.length };
  }

  // 1. Mandatory Line count check (Reference Extraction Rule)
  if (lines.length > MAX_SKILL_LINES) {
    errors.push(`SKILL.md is ${lines.length} lines long (max allowed: ${MAX_SKILL_LINES}). BẮT BUỘC phải tách ra các tệp references/*.md dưới ## References để tránh ép agent đọc hết file quá dài.`);
  }

  // 2. YAML Frontmatter validation
  const frontmatter = parseFrontmatter(content);
  const isNewTemplateSkill = frontmatter && (frontmatter.metadata || frontmatter.license);

  if (!frontmatter) {
    warnings.push('Missing or non-standard YAML frontmatter delimiters.');
  } else {
    if (!frontmatter.name) {
      errors.push('Frontmatter missing required field: "name"');
    }

    if (!frontmatter.description) {
      errors.push('Frontmatter missing required field: "description"');
    } else if (!frontmatter.description.includes('Trigger keywords:')) {
      if (isNewTemplateSkill) {
        errors.push('Frontmatter "description" MUST include "Trigger keywords: <keywords>" for discoverability.');
      } else {
        warnings.push('Frontmatter "description" recommended to include "Trigger keywords: <keywords>".');
      }
    }
  }

  // 3. Required Headings validation
  const requiredHeadings = [
    { heading: '## When to Apply', level: 2 },
    { heading: '## How to Use', level: 2 },
    { heading: '### 1. Step-by-Step Instructions', level: 3 },
    { heading: '### 2. Examples', level: 3 },
    { heading: '## Quick Reference', level: 2 },
    { heading: '## References', level: 2 },
  ];

  for (const item of requiredHeadings) {
    if (!content.includes(item.heading)) {
      if (isNewTemplateSkill) {
        errors.push(`Missing required template heading: "${item.heading}"`);
      } else {
        warnings.push(`Legacy skill missing template heading: "${item.heading}"`);
      }
    }
  }

  // 4. Validate References extraction and broken file links safely
  const refSectionIdx = content.indexOf('## References');
  if (refSectionIdx !== -1) {
    try {
      const refContent = content.slice(refSectionIdx);
      const linkMatches = refContent.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
      
      for (const match of linkMatches) {
        const linkPath = match[2];
        if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) continue;

        const resolvedPath = path.resolve(skillDir, linkPath);
        if (!fs.existsSync(resolvedPath)) {
          errors.push(`Broken reference link in ## References: "${linkPath}" does not exist at ${resolvedPath}`);
        }
      }
    } catch (err) {
      warnings.push(`Could not parse references section links: ${err.message}`);
    }
  }

  return { skillName, filePath, errors, warnings, lineCount: lines.length };
}

/**
 * Main Execution - Scans .agents/skills and .claude/skills with de-duplication
 */
function main() {
  try {
    const candidateDirs = [
      path.join(rootDir, '.agents/skills'),
      path.join(rootDir, '.claude/skills')
    ];

    const seenRealPaths = new Set();
    const skillFiles = [];

    for (const cDir of candidateDirs) {
      if (!fs.existsSync(cDir)) continue;
      const entries = fs.readdirSync(cDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillFilePath = path.join(cDir, entry.name, 'SKILL.md');
          if (fs.existsSync(skillFilePath)) {
            try {
              const realP = fs.realpathSync(skillFilePath);
              if (!seenRealPaths.has(realP)) {
                seenRealPaths.add(realP);
                skillFiles.push(skillFilePath);
              }
            } catch (e) {
              skillFiles.push(skillFilePath);
            }
          }
        }
      }
    }

    console.log('\n==================================================');
    console.log('       SKILL VALIDATION & AUDIT REPORT            ');
    console.log('==================================================\n');

    const results = [];
    for (const sFile of skillFiles) {
      try {
        results.push(validateSkill(sFile));
      } catch (err) {
        const sName = path.basename(path.dirname(sFile));
        results.push({
          skillName: sName,
          filePath: sFile,
          errors: [`Unhandled exception during validation: ${err.message}`],
          warnings: [],
          lineCount: 0
        });
      }
    }

    let totalErrors = 0;
    let totalWarnings = 0;

    for (const res of results) {
      const statusSymbol = res.errors.length > 0 ? '❌ ERROR' : (res.warnings.length > 0 ? '⚠️  WARN' : '✅ PASS');
      console.log(`[${statusSymbol}] ${res.skillName} (${res.lineCount} lines)`);
      
      for (const err of res.errors) {
        console.log(`    ❌ Error: ${err}`);
        totalErrors++;
      }
      for (const warn of res.warnings) {
        console.log(`    ⚠️  Warning: ${warn}`);
        totalWarnings++;
      }
      if (res.errors.length === 0 && res.warnings.length === 0) {
        console.log('    All template requirements and reference limits passed.');
      }
      console.log('');
    }

    console.log('--------------------------------------------------');
    console.log(`Total Unique Skills Audited: ${results.length}`);
    console.log(`Passed Cleanly: ${results.filter(r => r.errors.length === 0 && r.warnings.length === 0).length}`);
    console.log(`Total Errors: ${totalErrors}`);
    console.log(`Total Warnings: ${totalWarnings}`);
    console.log('--------------------------------------------------\n');

    if (totalErrors > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal execution error in validate-skills.mjs:', err);
    process.exit(1);
  }
}

main();

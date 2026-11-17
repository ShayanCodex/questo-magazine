import { execSync } from 'node:child_process';
import fs from 'node:fs';

const isForce = process.env.FORCE_DEPLOY === 'true';
const commitMsg = process.env.COMMIT_MESSAGE || '';
const hasDeployKeyword = /\[(deploy|release|publish)\]/i.test(commitMsg);

console.log('--- Batched Deployment Change Detection ---');
console.log('Force Deploy:', isForce);
console.log('Commit Message:', commitMsg);
console.log('Has [deploy] keyword:', hasDeployKeyword);

let hasChanges = false;
let diffFiles = [];

try {
  // Check if deployed-latest tag exists
  const tags = execSync('git tag -l deployed-latest', { encoding: 'utf8' }).trim();
  
  if (!tags) {
    console.log('No previous "deployed-latest" tag found. First deployment detected.');
    hasChanges = true;
  } else {
    const diffOutput = execSync('git diff --name-only deployed-latest HEAD', { encoding: 'utf8' }).trim();
    diffFiles = diffOutput ? diffOutput.split('\n').filter(Boolean) : [];
    console.log(`Found ${diffFiles.length} file(s) changed since last deployment tag.`);
    
    if (diffFiles.length > 0) {
      hasChanges = true;
      console.log('Changed files sample:', diffFiles.slice(0, 10));
    }
  }
} catch (e) {
  console.warn('Error checking git diff, defaulting to hasChanges=true:', e.message);
  hasChanges = true;
}

if (isForce || hasDeployKeyword) {
  hasChanges = true;
}

console.log(`\nFinal Verdict: has_changes = ${hasChanges}`);

// Output to GitHub Actions environment
const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  fs.appendFileSync(githubOutput, `has_changes=${hasChanges}\n`, 'utf8');
  fs.appendFileSync(githubOutput, `changed_count=${diffFiles.length}\n`, 'utf8');
}

// Write to GitHub Step Summary if available
const stepSummary = process.env.GITHUB_STEP_SUMMARY;
if (stepSummary) {
  const summary = `
### 📦 Batched Deployment Change Detection
- **Status:** ${hasChanges ? '🚀 Deployment Needed' : '💤 No Changes Detected (Skipping Build)'}
- **Files Modified since last deploy:** ${diffFiles.length}
- **Force Deploy:** ${isForce ? 'Yes' : 'No'}
- **Deploy Keyword:** ${hasDeployKeyword ? 'Yes' : 'No'}
${diffFiles.length > 0 ? `\n<details><summary>View changed files (${diffFiles.length})</summary>\n\n\`\`\`\n${diffFiles.slice(0, 30).join('\n')}\n\`\`\`\n</details>` : ''}
`;
  fs.appendFileSync(stepSummary, summary, 'utf8');
}

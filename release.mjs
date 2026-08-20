import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import readline from 'node:readline/promises';

const version = process.argv[2];

if (!version) {
  console.error('❌ Usage: node scripts/release.js 1.0.0');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('❌ Invalid version format. Expected: 1.0.0');
  process.exit(1);
}

// ─── Pre-flight checks ────────────────────────────────
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

if (currentBranch !== 'master' && currentBranch !== 'main') {
  console.error(`❌ Releases must be created from main/master. Current: ${currentBranch}`);
  process.exit(1);
}

const dirty = execSync('git status --porcelain').toString().trim();
if (dirty) {
  console.error('❌ Working tree is not clean. Commit or stash changes first.');
  process.exit(1);
}

const existingTags = execSync('git tag').toString().split('\n');
if (existingTags.includes(`v${version}`)) {
  console.error(`❌ Tag v${version} already exists`);
  process.exit(1);
}

// publish.yml only fires on a *published* GitHub Release, not on a tag
// push. Check this up front, before any git mutation, so a missing/
// unauthenticated gh CLI doesn't get discovered only after the tag and
// branch are already pushed.
let ghAvailable = false;
try {
  execSync('gh --version', { stdio: 'ignore' });
  execSync('gh auth status', { stdio: 'ignore' });
  ghAvailable = true;
  console.log('✅ gh CLI found and authenticated');
} catch {
  console.warn('⚠️  gh CLI not found or not authenticated.');
  console.warn('   The tag/branch will still be pushed, but publish.yml will NOT');
  console.warn('   fire automatically — you will need to create the GitHub Release');
  console.warn('   yourself afterwards.');

  const preAckRl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const proceedAnswer = await preAckRl.question('   Continue anyway? (y/N): ');
  preAckRl.close();

  if (proceedAnswer.toLowerCase() !== 'y') {
    console.log('✅ Release cancelled. No changes were made.');
    process.exit(0);
  }
}

// ─── Build & package integrity check ──────────────────
// This is the step that would have caught today's incident: publishing a
// tarball with no dist/ contents at all. We run the real build, then check
// every path package.json actually promises to ship (bin + main/exports),
// and finally cross-check against what `npm pack` would really include —
// because a missing "files" entry can pass a plain existsSync check while
// still being excluded from the tarball.

console.log('🔨 Running build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch {
  console.error('❌ Build failed. Fix build errors before releasing.');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const expectedPaths = [];

if (pkg.bin) {
  const binPaths = typeof pkg.bin === 'string' ? [pkg.bin] : Object.values(pkg.bin);
  expectedPaths.push(...binPaths);
}
if (pkg.main) expectedPaths.push(pkg.main);
if (pkg.types || pkg.typings) expectedPaths.push(pkg.types || pkg.typings);
if (pkg.exports) {
  const collectExportPaths = (node) => {
    if (typeof node === 'string') return [node];
    if (node && typeof node === 'object') return Object.values(node).flatMap(collectExportPaths);
    return [];
  };
  expectedPaths.push(...collectExportPaths(pkg.exports));
}

const missing = [...new Set(expectedPaths)].filter((p) => !existsSync(p));

if (missing.length) {
  console.error('❌ Build finished but expected file(s) are missing on disk:');
  missing.forEach((p) => console.error(`   - ${p}`));
  console.error('Check build.mjs output paths vs package.json "bin"/"main"/"exports".');
  process.exit(1);
}

console.log('✅ All declared entry points exist on disk:', expectedPaths.join(', '));

// Cross-check against the actual tarball npm would publish — this is the
// part that existsSync alone can't catch (files silently excluded by a
// missing/misconfigured "files" field or .npmignore).
console.log('📦 Verifying npm pack contents...');
const packOutput = JSON.parse(execSync('npm pack --dry-run --json').toString());
const packedFiles = packOutput[0].files.map((f) => f.path);

const notPacked = [...new Set(expectedPaths)].filter((p) => !packedFiles.includes(p.replace(/^\.\//, '')));

if (notPacked.length) {
  console.error('❌ File(s) exist on disk but would NOT be included in the published tarball:');
  notPacked.forEach((p) => console.error(`   - ${p}`));
  console.error('Check the "files" field in package.json (or .npmignore).');
  process.exit(1);
}

console.log(`✅ npm pack would include ${packedFiles.length} file(s), all declared entry points present.`);

// ─── Confirmation ──────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const answer = await rl.question(`\n[!] Confirm release v${version} on branch "${currentBranch}"? (Y/n): `);
rl.close();

if (answer.toLowerCase() !== 'y') {
  console.log('✅ Release cancelled. No changes were made.');
  process.exit(0);
}

console.log('🚀 Processing release...');

// ─── Version bump ─────────────────────────────────────
pkg.version = version;
writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
console.log('✅ package.json:', version);

// ─── Changelog ────────────────────────────────────────
const stripPrefix = (prefix, commit) =>
  commit.replace(new RegExp(`^${prefix}(?:\\d{4}-\\d{2}-\\d{2}::)?\\s*`, 'i'), '').trim();

let range = '';
try {
  const lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
  range = `${lastTag}..HEAD`;
  console.log(`Collecting commits since last tag: ${lastTag}`);
} catch {
  console.log('No previous tags found, using full history');
}

const raw = execSync(range ? `git log ${range} --pretty=format:"%s"` : `git log --pretty=format:"%s"`)
  .toString()
  .trim();
const commits = raw.split('\n').filter(Boolean);

console.log(`Found ${commits.length} commits to process`);

const updates = [];
const fixes = [];
const other = [];

for (const commit of commits) {
  if (/^RELEASE:/i.test(commit) || /^REL:/i.test(commit)) continue;

  if (/^UPD:FIX:/i.test(commit)) {
    const msg = stripPrefix('UPD:FIX:', commit);
    updates.push(msg);
    fixes.push(msg);
    continue;
  }
  if (/^UPD:/i.test(commit)) {
    updates.push(stripPrefix('UPD:', commit));
    continue;
  }
  if (/^FIX:/i.test(commit)) {
    fixes.push(stripPrefix('FIX:', commit));
    continue;
  }
  other.push(commit);
}

const today = new Date().toISOString().split('T')[0];

let newEntry = `## v${version} — ${today}\n\n`;
if (updates.length) newEntry += `### 🆕 Updates\n${updates.map((m) => `- ${m}`).join('\n')}\n\n`;
if (fixes.length) newEntry += `### 🐛 Fixes\n${fixes.map((m) => `- ${m}`).join('\n')}\n\n`;
if (other.length) newEntry += `### 📝 Other Changes\n${other.map((m) => `- ${m}`).join('\n')}\n\n`;

let changelog = `# Changelog\n\n${newEntry}`;
if (existsSync('./CHANGELOG.md')) {
  const existing = readFileSync('./CHANGELOG.md', 'utf-8');
  changelog += existing.replace(/^# Changelog\n\n/, '');
} else {
  console.log('No existing CHANGELOG.md found, creating a new one');
}

writeFileSync('./CHANGELOG.md', changelog);
console.log('✅ CHANGELOG.md generated');

// ─── Git ──────────────────────────────────────────────
try {
  console.log('📦 Committing and pushing...');

  // Explicit file list only — NOT `git add .`. The build step above just
  // wrote fresh build output (e.g. bin/cli.js) into the working tree, and a
  // blanket `git add .` would sweep that (and any other stray/untracked
  // file sitting in the repo — build artifacts, local .env, etc.) into the
  // commit. Only stage what this script itself is meant to change.
  const filesToStage = ['package.json', 'CHANGELOG.md'];
  if (existsSync('./package-lock.json')) filesToStage.push('package-lock.json');

  execSync(`git add ${filesToStage.join(' ')}`, { stdio: 'inherit' });
  execSync(`git commit -m "RELEASE:${today}:: v${version}"`, { stdio: 'inherit' });

  const branchName = `release-v${version}`;
  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
  execSync(`git tag v${version}`, { stdio: 'inherit' });
  execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
  execSync(`git push origin v${version}`, { stdio: 'inherit' });

  console.log(`\n🚀 Tagged and pushed v${version} on branch ${branchName}.`);
} catch (error) {
  console.error('\n❌ Git step failed:', error.message);
  console.error('Local commit and tag may already exist. Fix the issue and push manually:');
  console.error(`  git push -u origin release-v${version}`);
  console.error(`  git push origin v${version}`);
  process.exit(1);
}

// ─── GitHub Release ────────────────────────────────────
// publish.yml triggers on `release: types: [published]`, NOT on tag push —
// pushing the tag alone will not run the publish workflow. Create the
// actual GitHub Release here via gh CLI so the pipeline fires.
if (ghAvailable) {
  const notesPath = `.release-notes-v${version}.tmp.md`;
  try {
    console.log('📣 Creating GitHub release to trigger publish workflow...');

    // Only this version's entry, not the whole accumulated CHANGELOG.md —
    // otherwise every release description grows to contain the full
    // project history.
    writeFileSync(notesPath, newEntry);

    execSync(
      `gh release create v${version} --title "v${version}" --notes-file ${notesPath} --target release-v${version}`,
      { stdio: 'inherit' },
    );
    console.log(`\n✅ Released v${version} — publish.yml should now be running.`);
  } catch (error) {
    console.warn('\n⚠️  Release creation failed:', error.message);
    console.warn(`   Tag v${version} is pushed, but publish.yml only fires on a published GitHub Release.`);
    console.warn(`   Create it manually: gh release create v${version} --target release-v${version}`);
  } finally {
    if (existsSync(notesPath)) execSync(`rm ${notesPath}`);
  }
} else {
  console.warn(`\n⚠️  Skipped GitHub release creation (gh unavailable/unauthenticated).`);
  console.warn(`   Tag v${version} is pushed. Create the release manually:`);
  console.warn(`   gh release create v${version} --target release-v${version}`);
}

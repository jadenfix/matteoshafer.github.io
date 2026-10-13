const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'artifacts', 'demo');
const manifest = JSON.parse(fs.readFileSync(path.join(output, 'source-manifest.json')));
const receipt = JSON.parse(fs.readFileSync(path.join(output, 'capture.json')));

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function probe(file) {
  const value = execFileSync('ffprobe', [
    '-v', 'error', '-count_frames', '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,width,height,nb_read_frames:format=duration',
    '-of', 'json', file,
  ], { encoding: 'utf8' });
  const parsed = JSON.parse(value);
  const stream = parsed.streams[0];
  return { codec: stream.codec_name, width: Number(stream.width), height: Number(stream.height), frames: Number(stream.nb_read_frames || 1) };
}

if (receipt.source_commit !== manifest.source_commit || receipt.source_tree !== manifest.source_tree) {
  throw new Error('Capture and source manifest identities differ');
}
for (const input of manifest.inputs) {
  const file = path.join(root, input.path);
  if (!fs.existsSync(file)) throw new Error(`Missing source input: ${input.path}`);
  if (sha256(file) !== input.sha256) throw new Error(`Source SHA-256 drift: ${input.path}`);
  if (git('hash-object', '--', input.path) !== input.git_blob) throw new Error(`Source Git blob drift: ${input.path}`);
}
for (const [name, expected] of Object.entries(receipt.media)) {
  const file = path.join(root, expected.path);
  if (!fs.existsSync(file)) throw new Error(`Missing ${name}: ${expected.path}`);
  if (fs.statSync(file).size !== expected.bytes || sha256(file) !== expected.sha256) throw new Error(`${name} bytes do not match receipt`);
  const actual = probe(file);
  for (const key of ['codec', 'width', 'height', 'frames']) {
    if (actual[key] !== expected[key]) throw new Error(`${name} ${key} mismatch: ${actual[key]} != ${expected[key]}`);
  }
  if (actual.frames < 1 || actual.width < 320 || actual.height < 180) throw new Error(`${name} did not decode to usable frames`);
}
console.log(`Verified ${manifest.inputs.length} source inputs and ${Object.keys(receipt.media).length} fully decoded media files at ${receipt.source_commit}`);

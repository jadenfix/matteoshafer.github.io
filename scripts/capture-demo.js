const { chromium } = require('playwright');
const { execFileSync, spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'artifacts', 'demo');
const raw = path.join(output, 'raw');
const baseURL = 'http://127.0.0.1:4173/matteoshafer.github.io/';
const files = {
  gif: path.join(output, 'portfolio-archive-demo.gif'),
  mp4: path.join(output, 'portfolio-archive-demo.mp4'),
  poster: path.join(output, 'portfolio-archive-poster.png'),
};

function run(command, args, options = {}) {
  return execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: options.quiet ? 'pipe' : 'inherit' });
}

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function probe(file) {
  const value = execFileSync('ffprobe', [
    '-v', 'error', '-count_frames', '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,width,height,nb_read_frames:format=duration',
    '-of', 'json', file,
  ], { encoding: 'utf8' });
  const parsed = JSON.parse(value);
  const stream = parsed.streams[0];
  return {
    codec: stream.codec_name,
    width: Number(stream.width),
    height: Number(stream.height),
    frames: Number(stream.nb_read_frames || 1),
    duration_seconds: Number(Number(parsed.format?.duration || 0).toFixed(3)),
  };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch (_) {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Production preview did not become ready');
}

async function pause(page, milliseconds = 1400) {
  await page.waitForTimeout(milliseconds);
}

(async () => {
  const status = git('status', '--porcelain', '--untracked-files=no');
  if (status) throw new Error(`Tracked source must be clean before capture:\n${status}`);

  fs.rmSync(raw, { recursive: true, force: true });
  fs.mkdirSync(raw, { recursive: true });
  run('npm', ['run', 'build']);

  const server = spawn(process.execPath, ['scripts/production-server.js'], { cwd: root, stdio: 'inherit' });
  try {
    await waitForServer();
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      recordVideo: { dir: raw, size: { width: 1440, height: 900 } },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const video = page.video();

    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await pause(page, 1700);
    await page.locator('.project-index').scrollIntoViewIfNeeded();
    await pause(page, 1500);
    await page.getByRole('link', { name: /^Predictive stochastic A historical/ }).click();
    await page.getByRole('heading', { name: 'Predictive Stochastic Modeling for Financial Markets' }).waitFor();
    await pause(page, 1700);
    await page.getByRole('link', { name: 'NLP' }).click();
    await page.getByRole('heading', { name: 'N-Gram Language Model for Next-Word Prediction' }).waitFor();
    await pause(page, 1700);
    await page.goto(`${baseURL}#/retired-project`);
    await page.getByRole('heading', { name: 'This archive page does not exist' }).waitFor();
    await pause(page, 1900);
    await page.getByRole('link', { name: 'Return to the verified archive index' }).click();
    await page.getByRole('heading', { name: 'Research project index' }).waitFor();
    await page.locator('.project-index').scrollIntoViewIfNeeded();
    await pause(page, 2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await pause(page, 300);
    await page.screenshot({ path: files.poster });

    await context.close();
    const webm = await video.path();
    await browser.close();

    run('ffmpeg', ['-y', '-i', webm, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', files.mp4]);
    run('ffmpeg', ['-y', '-i', files.mp4, '-vf', 'fps=10,scale=1120:-2:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3', '-loop', '0', files.gif]);
  } finally {
    server.kill('SIGTERM');
  }

  const tracked = git('ls-files').split('\n').filter((file) => file && !file.startsWith('artifacts/demo/'));
  const manifest = {
    source_commit: git('rev-parse', 'HEAD'),
    source_tree: git('rev-parse', 'HEAD^{tree}'),
    scope: 'Checked-in historical portfolio routes only; no external repository, result, live-service, or deployment verification.',
    inputs: tracked.map((file) => ({
      path: file,
      git_blob: git('hash-object', '--', file),
      sha256: sha256(path.join(root, file)),
    })),
  };
  fs.writeFileSync(path.join(output, 'source-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const receipt = {
    source_commit: manifest.source_commit,
    source_tree: manifest.source_tree,
    base_url: baseURL,
    viewport: { width: 1440, height: 900 },
    interaction: ['archive index', 'predictive stochastic summary', 'NLP summary', 'stale-route recovery', 'archive index return'],
    media: Object.fromEntries(Object.entries(files).map(([name, file]) => [name, {
      path: path.relative(root, file),
      bytes: fs.statSync(file).size,
      sha256: sha256(file),
      ...probe(file),
    }])),
  };
  fs.writeFileSync(path.join(output, 'capture.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  fs.rmSync(raw, { recursive: true, force: true });
  console.log(`Captured ${receipt.media.mp4.frames} MP4 frames at source ${receipt.source_commit}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

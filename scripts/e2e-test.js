#!/usr/bin/env node
/**
 * End-to-end test: dashboard API, progress, and review trigger.
 * Run from repo root: node scripts/e2e-test.js
 * Automatically starts the dashboard server if it's not already running.
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE = 'http://localhost:7700';

async function fetch(url, opts = {}) {
  const res = await globalThis.fetch(url, opts);
  return { ok: res.ok, status: res.status, json: () => res.json(), text: () => res.text() };
}

let serverProcess = null;

function cleanupServer() {
  if (serverProcess) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(serverProcess.pid), '/f', '/t'], { stdio: 'ignore' });
      } else {
        serverProcess.kill('SIGTERM');
      }
    } catch (_) {}
    serverProcess = null;
  }
}

process.on('exit', cleanupServer);
process.on('SIGINT', () => { cleanupServer(); process.exit(1); });
process.on('SIGTERM', () => { cleanupServer(); process.exit(1); });

async function ensureDashboardRunning() {
  try {
    const res = await fetch(`${BASE}/api/progress`);
    if (res.ok) {
      return; // Already running
    }
  } catch (_) {}

  console.log('Dashboard not running. Starting dashboard server...');
  serverProcess = spawn('node', ['server.js'], {
    cwd: join(ROOT, 'dashboard'),
    stdio: 'ignore',
    env: { ...process.env, DASHBOARD_PORT: '7700' }
  });

  const maxWait = 10000;
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch(`${BASE}/api/progress`);
      if (res.ok) {
        console.log('Dashboard server started on port 7700.\n');
        return;
      }
    } catch (_) {}
  }
  throw new Error('Timed out waiting for dashboard server to start on port 7700.');
}

async function main() {
  console.log('E2E Test: Dashboard + Review pipeline\n');
  console.log('='.repeat(50));

  await ensureDashboardRunning();

  // 1. Progress API
  console.log('\n1. GET /api/progress');
  try {
    const r = await fetch(`${BASE}/api/progress`);
    if (!r.ok) throw new Error(`Status ${r.status}`);
    const data = await r.json();
    console.log('   OK – pathway:', data.pathway?.name || 'Mobile & Full-Stack', '| courses:', Object.keys(data.courses || {}).length);
  } catch (e) {
    console.log('   FAIL –', e.message);
    process.exit(1);
  }

  // 2. Courses API
  console.log('\n2. GET /api/courses');
  try {
    const r = await fetch(`${BASE}/api/courses?page=1&limit=5`);
    if (!r.ok) throw new Error(`Status ${r.status}`);
    const data = await r.json();
    console.log('   OK – total courses:', data.total, '| page:', data.page);
  } catch (e) {
    console.log('   FAIL –', e.message);
    process.exit(1);
  }

  // 3. Challenge detail (instructions)
  const courseId = '01-react-native-fundamentals';
  const challengeId = '01-expo-setup-basics';
  console.log(`\n3. GET /api/courses/${courseId}/challenges/${challengeId}`);
  try {
    const r = await fetch(`${BASE}/api/courses/${courseId}/challenges/${challengeId}`);
    if (!r.ok) throw new Error(`Status ${r.status}`);
    const data = await r.json();
    const hasInstructions = (data.instructions || '').length > 0;
    console.log('   OK – instructions:', hasInstructions ? 'yes' : 'no', '| score:', data.score ?? '—');
  } catch (e) {
    console.log('   FAIL –', e.message);
    process.exit(1);
  }

  // 4. POST /api/review (run review for one challenge)
  console.log(`\n4. POST /api/review (${courseId} / ${challengeId})`);
  try {
    const r = await fetch(`${BASE}/api/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, challengeId })
    });
    const data = await r.json();
    if (!data.ok) throw new Error(data.error || 'Review failed');
    console.log('   OK – review triggered, started:', data.started ? 'yes' : 'no');
  } catch (e) {
    console.log('   FAIL –', e.message);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log('E2E tests passed. Dashboard and review pipeline are working.');
  console.log('\nTo enable AI review: set GROQ_API_KEY, then run: npm run test:ai-review');

  cleanupServer();
}

main().catch(e => {
  cleanupServer();
  console.error(e);
  process.exit(1);
});

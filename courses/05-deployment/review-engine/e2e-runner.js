import { spawnSync, execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// 4 min (Windows/slow machines need more than 2 min); execSync on Windows avoids spawnSync npx.cmd EINVAL
const E2E_TIMEOUT_MS = 240000;

function extractFailedTestErrors(testResults) {
  const errors = [];
  function traverse(item) {
    if (!item) return;
    if (item.specs) {
      for (const spec of item.specs) {
        if (!spec.ok) {
          const firstFailedTest = (spec.tests || []).find(t => t.results?.some(r => r.status === 'failed' || r.status === 'unexpected'));
          const failedResult = firstFailedTest?.results?.find(r => r.status === 'failed' || r.status === 'unexpected');
          const rawMsg = failedResult?.error?.message || failedResult?.errors?.[0]?.message || '';
          const cleanMsg = rawMsg ? rawMsg.replace(/\u001b\[[0-9;]*m/g, '').split('\n').map(s => s.trim()).filter(Boolean)[0] : 'Test failed';
          errors.push(`${spec.title}: ${cleanMsg}`);
        }
      }
    }
    if (item.suites) {
      for (const s of item.suites) {
        traverse(s);
      }
    }
  }
  if (Array.isArray(testResults?.suites)) {
    for (const s of testResults.suites) {
      traverse(s);
    }
  }
  return errors;
}

/**
 * Runs Playwright E2E tests for a specific challenge
 * These tests verify visual output and user interactions.
 * On port conflict, retries with alternate ports (5174–5180).
 */
function runPlaywright(projectDir, testFileRel, env) {
  const isWin = process.platform === 'win32';
  const runEnv = { ...process.env, ...env };

  // On Windows, spawnSync('npx.cmd', ..., { shell: false }) can cause EINVAL; use execSync with long timeout
  if (isWin) {
    try {
      return execSync(`npx playwright test "${testFileRel}" --reporter=json`, {
        cwd: projectDir,
        encoding: 'utf-8',
        timeout: E2E_TIMEOUT_MS,
        maxBuffer: 10 * 1024 * 1024,
        env: runEnv,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (err) {
      err.stdout = err.stdout ?? '';
      err.stderr = err.stderr ?? '';
      throw err;
    }
  }

  const result = spawnSync('npx', ['playwright', 'test', testFileRel, '--reporter=json'], {
    cwd: projectDir,
    encoding: 'utf-8',
    timeout: E2E_TIMEOUT_MS,
    maxBuffer: 10 * 1024 * 1024,
    env: runEnv,
    shell: false
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const err = new Error(result.signal || `Exit ${result.status}`);
    err.stdout = result.stdout;
    err.stderr = result.stderr;
    err.status = result.status;
    throw err;
  }
  return result.stdout || '';
}

export async function runE2ETests(challengeId, projectDir) {
  const challengeNum = challengeId.split('-')[0];
  const testFileName = `challenge-${challengeNum}.spec.ts`;
  let testFileRel = `tests/e2e/${testFileName}`;
  let testFileAbs = join(projectDir, testFileRel);

  if (!existsSync(testFileAbs)) {
    const altFileName = `challenge-${challengeId}.spec.ts`;
    const altFileAbs = join(projectDir, 'tests', 'e2e', altFileName);
    if (existsSync(altFileAbs)) {
      testFileAbs = altFileAbs;
      testFileRel = `tests/e2e/${altFileName}`;
    } else {
      return {
        score: 100,
        passed: true,
        note: 'No E2E tests configured for this challenge',
        details: []
      };
    }
  }

  const baseEnv = { CI: '1' };
  const portsToTry = [undefined, 5175, 5176, 5177, 5178, 5179, 5180]; // undefined = use config default (5174 in CI)
  let lastError = null;

  for (const port of portsToTry) {
    try {
      const env = port != null ? { ...baseEnv, PLAYWRIGHT_APP_PORT: String(port) } : baseEnv;
      const output = runPlaywright(projectDir, testFileRel, env);

      // Parse Playwright JSON output (may have npm prefix)
      const raw = (output || '') + '';
      const jsonMatch = raw.match(/\{[\s\S]*"stats"[\s\S]*\}|\[[\s\S]*"status"[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : raw;
      const testResults = JSON.parse(jsonStr);
      const stats = testResults.stats || {};
      // Playwright JSON reporter uses: expected (passed), unexpected (failed), skipped, flaky
      const totalTests = (stats.expected ?? 0) + (stats.unexpected ?? 0) + (stats.skipped ?? 0) + (stats.flaky ?? 0) || (Array.isArray(testResults) ? testResults.length : 0);
      const passedTests = stats.expected ?? (Array.isArray(testResults) ? testResults.filter(t => t.status === 'passed').length : 0);
      const failedTests = stats.unexpected ?? (Array.isArray(testResults) ? testResults.filter(t => t.status === 'failed').length : 0);

      const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
      const failedDetails = extractFailedTestErrors(testResults);
      const errorMsg = failedDetails.length > 0 ? failedDetails.join('\n') : undefined;

      return {
        score: Math.round(score * 10) / 10,
        passed: failedTests === 0 && totalTests > 0,
        totalTests,
        passedTests,
        failedTests,
        details: testResults.suites || testResults,
        screenshots: testResults.screenshots || [],
        ...(errorMsg ? { error: errorMsg } : {})
      };
    } catch (error) {
      lastError = error;
      const errMsg = (error.stdout ?? '') + (error.stderr ?? '') + (error.message ?? '');
      if (/already used|EADDRINUSE|port.*in use/i.test(errMsg) && port !== portsToTry[portsToTry.length - 1]) {
        continue; // try next port
      }
      break; // non-port error or last port: handle below
    }
  }

  if (lastError) {
    const errorOutput = (lastError.stdout ?? '') + (lastError.stderr ?? '');
    const fullMessage = [lastError.message, errorOutput.trim()].filter(Boolean).join('\n');

    const tryParse = () => {
      try {
        const jsonMatch = errorOutput.match(/\{[\s\S]*"stats"[\s\S]*\}|\[[\s\S]*"status"[\s\S]*\]/);
        if (jsonMatch) {
          const testResults = JSON.parse(jsonMatch[0]);
          const stats = testResults.stats || {};
          const totalTests = (stats.expected ?? 0) + (stats.unexpected ?? 0) + (stats.skipped ?? 0) + (stats.flaky ?? 0) || (Array.isArray(testResults) ? testResults.length : 0);
          const passedTests = stats.expected ?? (Array.isArray(testResults) ? testResults.filter(t => t.status === 'passed').length : 0);
          const failedTests = stats.unexpected ?? (Array.isArray(testResults) ? testResults.filter(t => t.status === 'failed').length : 0);
          const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
          const failedDetails = extractFailedTestErrors(testResults);
          const errorMsg = failedDetails.length > 0 ? failedDetails.join('\n') : (lastError.message || 'E2E tests failed');
          return { score: Math.round(score * 10) / 10, totalTests, passedTests, failedTests, details: testResults.suites || testResults, error: errorMsg };
        }
      } catch (_) {}
      return null;
    };

    const parsed = tryParse();
    if (parsed) {
      return { ...parsed, passed: false };
    }

    const needsBrowsers = /Executable doesn't exist|browserType\.launch|playwright install/i.test(fullMessage);
    const portInUse = /already used|EADDRINUSE|port.*in use/i.test(fullMessage);
    return {
      score: 0,
      passed: false,
      error: fullMessage,
      details: [],
      note: needsBrowsers
        ? 'Playwright browsers not installed. Run from repo root: npm run setup (or in project: npm run setup:e2e).'
        : portInUse
          ? 'Port in use. Close other dev servers or set PLAYWRIGHT_APP_PORT=5180 (or another free port).'
          : 'E2E failed. The app is started automatically by Playwright (webServer in playwright.config).'
    };
  }

  return { score: 0, passed: false, error: 'E2E run failed', details: [] };
}

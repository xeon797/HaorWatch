import assert from 'node:assert';
import {
  formatArea,
  formatPercent,
  formatScore,
  formatDate,
  formatDateRange,
  formatValidationStatus,
  formatAreaDelta,
} from '../src/lib/formatters.ts';

console.log('Testing formatters...');

// 1. formatArea: strict null vs zero handling
assert.strictEqual(formatArea(null), 'Unavailable', 'null must return "Unavailable"');
assert.strictEqual(formatArea(undefined), 'Unavailable', 'undefined must return "Unavailable"');
assert.strictEqual(formatArea(NaN), 'Unavailable', 'NaN must return "Unavailable"');
assert.strictEqual(formatArea(0), '0.00 km²', '0 must return "0.00 km²"');
assert.strictEqual(formatArea(84.62), '84.62 km²', '84.62 must return "84.62 km²"');
assert.strictEqual(formatArea(181.15), '181.15 km²');

// 2. formatPercent: strict null vs zero handling
assert.strictEqual(formatPercent(null), 'Unavailable', 'null must return "Unavailable"');
assert.strictEqual(formatPercent(undefined), 'Unavailable');
assert.strictEqual(formatPercent(0), '0.0%', '0 must return "0.0%"');
assert.strictEqual(formatPercent(36.93), '36.9%');
assert.strictEqual(formatPercent(100), '100.0%');

// 3. formatScore: strict null vs zero handling
assert.strictEqual(formatScore(null), 'Unavailable', 'null must return "Unavailable"');
assert.strictEqual(formatScore(0), '0.000', '0 must return "0.000"');
assert.strictEqual(formatScore(0.857), '0.857');
assert.strictEqual(formatScore(0.75), '0.750');

// 4. formatDate & formatDateRange
assert.strictEqual(formatDate(null), 'Unavailable');
assert.ok(formatDate('2026-05-13T00:00:00Z').includes('13 May 2026 UTC'));

const range = formatDateRange('2026-05-01T00:00:00Z', '2026-05-13T00:00:00Z');
assert.ok(range.includes('01 – 13 May 2026 UTC'), `Expected date range format, got: ${range}`);
assert.strictEqual(formatDateRange(null, null), 'Date range unavailable');

// 5. formatValidationStatus
assert.strictEqual(formatValidationStatus('internal_test_only').label, 'Internal Test Only');
assert.strictEqual(formatValidationStatus('external_reference_checked').label, 'External Reference Checked');
assert.strictEqual(formatValidationStatus('not_available').label, 'External Validation Unavailable');
assert.strictEqual(formatValidationStatus(null).label, 'External Validation Unavailable');

// 6. formatAreaDelta
const deltaPos = formatAreaDelta(84.62, 78.40);
assert.strictEqual(deltaPos.sign, 'positive');
assert.strictEqual(deltaPos.deltaFormatted, '+6.22 km² vs baseline');

const deltaZero = formatAreaDelta(84.62, 84.62);
assert.strictEqual(deltaZero.sign, 'neutral');
assert.strictEqual(deltaZero.deltaFormatted, 'Matches baseline');

const deltaNull = formatAreaDelta(null, 78.40);
assert.strictEqual(deltaNull.sign, 'unknown');
assert.strictEqual(deltaNull.deltaFormatted, 'No baseline comparison');

console.log('All formatter assertions passed successfully!');

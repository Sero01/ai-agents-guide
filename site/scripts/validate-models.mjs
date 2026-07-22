#!/usr/bin/env node
/**
 * Build-time gate for src/data/models.json.
 *
 *   node scripts/validate-models.mjs
 *
 * Exit 0 = clean, 1 = errors. Wired to `prebuild`, so a failure stops the
 * Astro build — and therefore stops the Cloudflare Pages deploy.
 *
 * This is the CI-side twin of execution/validate_models.py. The Python copy is
 * the local authoring tool; this one ships with the repo because execution/ is
 * gitignored and would not exist in a CI checkout. Both are data-driven off the
 * `source_registry`, `validation_policy` and `benchmark_registry` blocks inside
 * models.json, so the policy itself lives in exactly one place.
 *
 * The invariant: a cell may be missing, but it may never carry a value without
 * an attributable source. The previous schema enforced the opposite —
 * "every row has 8 benchmark cells" — which could only be satisfied by
 * inventing the numbers vendors had not published.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODELS_JSON = resolve(HERE, '../src/data/models.json');
const SCHEMA_VERSION = 2;
const REQUIRED_FIELDS = ['id', 'name', 'vendor', 'license', 'released', 'status'];

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

const data = JSON.parse(readFileSync(MODELS_JSON, 'utf8'));

if (data.schema_version !== SCHEMA_VERSION) {
  console.error(`FATAL: schema_version is ${data.schema_version}, expected ${SCHEMA_VERSION}`);
  process.exit(1);
}

const SOURCES = data.source_registry || {};
const BENCHMARKS = data.benchmark_registry || {};
const POLICY = data.validation_policy || {};
const BLOCKED = new Set(POLICY.blocked_source_hosts || []);
const MIN_CELLS = POLICY.min_scored_cells ?? 3;
const STATUSES = new Set(POLICY.model_statuses || []);
const RANKED = new Set(POLICY.ranked_statuses || ['current']);

for (const block of ['source_registry', 'benchmark_registry', 'validation_policy']) {
  if (!data[block]) {
    console.error(`FATAL: models.json is missing the '${block}' block`);
    process.exit(1);
  }
}

/** Validate one benchmark cell. Returns true if it may contribute to a ranking. */
function checkCell(id, key, cell) {
  const spec = BENCHMARKS[key];
  if (!spec) {
    err(id, `unknown benchmark key '${key}'`);
    return false;
  }
  if (cell == null) return false;

  if (typeof cell !== 'object' || Array.isArray(cell)) {
    err(id, `${key}: cell must be an object, got ${typeof cell}. Bare numbers are schema v1 and carry no provenance.`);
    return false;
  }

  const { value, source, url } = cell;
  if (value == null) {
    if (!cell.note) warn(id, `${key}: null value with no note explaining why`);
    return false;
  }
  if (typeof value !== 'number' || Number.isNaN(value)) {
    err(id, `${key}: value must be numeric, got ${JSON.stringify(value)}`);
    return false;
  }
  if (spec.scored !== undefined && (value < 0 || value > 100) && key !== 'aa_intelligence_index') {
    err(id, `${key}: ${value} outside 0-100`);
  }

  if (!source) {
    err(id, `${key}: has value ${value} but no source. Every number must be attributable.`);
    return false;
  }
  const src = SOURCES[source];
  if (!src) {
    err(id, `${key}: unknown source '${source}'`);
    return false;
  }
  if (source === 'unsourced_legacy') return false;

  if (src.redistributable === false) {
    err(id, `${key}: source '${source}' does not grant redistribution rights for a public site.`);
    return false;
  }

  if (src.kind === 'independent' || src.kind === 'vendor') {
    if (!url) {
      err(id, `${key}: source '${source}' requires a url pointing at the published figure`);
      return false;
    }
    let host = '';
    try {
      host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      err(id, `${key}: malformed url ${JSON.stringify(url)}`);
      return false;
    }
    if (BLOCKED.has(host)) {
      err(id, `${key}: url host '${host}' is a secondary aggregator, not a primary source.`);
      return false;
    }
  }

  if (!cell.measured) warn(id, `${key}: no 'measured' date`);
  if (key === 'aa_intelligence_index' && !cell.index_version) {
    err(id, `${key}: AA Index scores must carry 'index_version' — cross-version scores are not comparable`);
  }

  return Boolean(spec.scored) && Boolean(src.scoreable);
}

const seen = new Set();
let ranked = 0;

for (const m of data.models || []) {
  const id = m.id || '<missing id>';
  for (const f of REQUIRED_FIELDS) if (!m[f]) err(id, `missing required field '${f}'`);
  if (seen.has(id)) err(id, 'duplicate model id');
  seen.add(id);

  if (m.status && !STATUSES.has(m.status)) {
    err(id, `invalid status '${m.status}'; expected one of ${[...STATUSES].join(', ')}`);
  }
  if (m.status === 'unreleased' && m.pricing) {
    err(id, `status 'unreleased' but carries pricing — a model with no public API must not show a price`);
  }

  let scored = 0;
  for (const [key, cell] of Object.entries(m.benchmarks || {})) {
    if (checkCell(id, key, cell)) scored += 1;
  }
  if (RANKED.has(m.status)) {
    ranked += 1;
    if (scored < MIN_CELLS) {
      warn(id, `only ${scored} scoreable cell(s); below the floor of ${MIN_CELLS}, so it shows no ranking`);
    }
  }
}

console.log(`models: ${(data.models || []).length}   ranked: ${ranked}`);
console.log(`errors: ${errors.length}   warnings: ${warnings.length}`);

if (errors.length) {
  console.error('\n--- errors ---');
  for (const e of errors) console.error(`  x ${e}`);
  console.error('\nFAIL — build stopped. An unsourced figure must not reach the site.');
  process.exit(1);
}
console.log('PASS');

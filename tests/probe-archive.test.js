import test from 'node:test';
import assert from 'node:assert/strict';
import { probeLiveness } from '../lib/probe.js';
import { getClosestSnapshot, getSnapshotHistory } from '../lib/archive.js';

const okFetch = async () => ({ ok: true, json: async () => ({}) });
const netFailFetch = async () => { throw new TypeError('Failed to fetch'); };
const slowFetch = () => new Promise((_, rej) => { /* never resolves; AbortController fires */ });

test('probeLiveness: resolving fetch means alive', async () => {
  assert.equal(await probeLiveness('https://example.com/', 5000, okFetch), 'alive');
});

test('probeLiveness: network failure means dead', async () => {
  assert.equal(await probeLiveness('http://dead.example/', 5000, netFailFetch), 'dead');
});

test('probeLiveness: timeout means unknown, never dead', async () => {
  const hanging = (_url, { signal }) => new Promise((_res, rej) => {
    signal.addEventListener('abort', () => { const e = new Error('aborted'); e.name = 'AbortError'; rej(e); });
  });
  assert.equal(await probeLiveness('https://slow.example/', 50, hanging), 'unknown');
});

test('getClosestSnapshot parses availability payload', async () => {
  const fake = async () => ({
    ok: true,
    json: async () => ({ archived_snapshots: { closest: { status: '200', available: true, url: 'http://web.archive.org/web/20200101000000/https://example.com/', timestamp: '20200101000000' } } }),
  });
  const s = await getClosestSnapshot('https://example.com/', 5000, fake);
  assert.equal(s.available, true);
  assert.equal(s.timestamp, '20200101000000');
});

test('getClosestSnapshot with no snapshots', async () => {
  const fake = async () => ({ ok: true, json: async () => ({ archived_snapshots: {} }) });
  const s = await getClosestSnapshot('https://never-archived.example/', 5000, fake);
  assert.equal(s.available, false);
});

test('getSnapshotHistory summarizes CDX rows', async () => {
  const fake = async () => ({
    ok: true,
    json: async () => ([
      ['timestamp', 'statuscode'],
      ['20200101000000', '200'],
      ['20230615120000', '200'],
      ['20261118035140', '200'],
    ]),
  });
  const h = await getSnapshotHistory('https://example.com/', 5000, fake);
  assert.equal(h.count, 3);
  assert.equal(h.first, '20200101000000');
  assert.equal(h.last, '20261118035140');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, parseUrlList, extractLinksFromBookmarksHtml, waybackTimestampToDate, formatDate } from '../lib/urls.js';
import { formatMarkdownReport } from '../lib/cemetery.js';

test('normalizeUrl adds https and trims', () => {
  assert.equal(normalizeUrl('  example.com  '), 'https://example.com/');
  assert.equal(normalizeUrl('http://example.com/a'), 'http://example.com/a');
  assert.equal(normalizeUrl('not a url'), null);
  assert.equal(normalizeUrl(''), null);
  assert.equal(normalizeUrl('ftp://example.com'), null);
});

test('parseUrlList dedupes and skips junk', () => {
  // 'notaurl' is syntactically a valid URL (single-label host) — it stays in
  // the list and will fail at probe time with a 'dead' verdict, which is correct.
  const out = parseUrlList('example.com\nhttps://example.com/\nnotaurl\nfoo.org, bar.net');
  assert.deepEqual(out, ['https://example.com/', 'https://notaurl/', 'https://foo.org/', 'https://bar.net/']);
  assert.deepEqual(parseUrlList('not a url\n'), []);
});

test('extractLinksFromBookmarksHtml pulls hrefs + titles', () => {
  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><DT><A HREF="https://example.com" ADD_DATE="1">Example</A><DT><A HREF="http://dead.example/x">Dead</A><DT><A HREF="https://example.com">Dup</A></DL>`;
  const out = extractLinksFromBookmarksHtml(html);
  assert.equal(out.length, 2);
  assert.equal(out[0].title, 'Example');
  assert.equal(out[1].url, 'http://dead.example/x');
});

test('wayback timestamp parsing', () => {
  const d = waybackTimestampToDate('20261118035140');
  assert.equal(formatDate(d), '18 Nov 2026');
  assert.equal(waybackTimestampToDate('junk'), null);
});

test('formatMarkdownReport counts verdicts', () => {
  const md = formatMarkdownReport([
    { url: 'https://a.com/', verdict: 'alive' },
    { url: 'https://b.com/', verdict: 'dead', snapshotUrl: 'https://web.archive.org/web/2020/https://b.com/' },
    { url: 'https://c.com/', verdict: 'dead' },
  ]);
  assert.match(md, /Checked 3 links — 1 alive, 2 dead, 0 unknown\./);
  assert.match(md, /archived copy/);
});

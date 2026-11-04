import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { situations, readingPlan, categories } from '../data.js';

const categoryIds = new Set(categories.map(x => x.id));

test('коллекция содержит 19 жизненных ситуаций и уникальные идентификаторы', () => {
  assert.equal(situations.length, 19);
  assert.equal(new Set(situations.map(x => x.id)).size, 19);
  for (const s of situations) {
    for (const key of ['id','category','title','subtitle','references','reflection','prayer','action']) {
      assert.equal(typeof s[key], 'string');
      assert.ok(s[key].trim().length > 0);
    }
    assert.ok(categoryIds.has(s.category));
    assert.match(s.prayer, /Аминь\.$/);
  }
});

test('план содержит ровно 30 последовательных дней', () => {
  assert.equal(readingPlan.length, 30);
  assert.deepEqual(readingPlan.map(d => d.day), Array.from({length:30}, (_, i) => i + 1));
  for (const d of readingPlan) {
    for (const key of ['title','reference','reflection','prayer','action']) {
      assert.equal(typeof d[key], 'string');
      assert.ok(d[key].trim().length > 0);
    }
    assert.match(d.prayer, /Аминь\.$/);
  }
});

test('все ссылки на Писание имеют узнаваемые названия книг', () => {
  const known = /(Матфея|Марка|Луки|Иоанна|Филиппийцам|Ефесянам|Колоссянам|Коринфянам|Фессалоникийцам|Иакова|Псалом|Римлянам)/;
  for (const s of situations) assert.match(s.references, known);
  for (const d of readingPlan) assert.match(d.reference, known);
});

test('статические файлы присутствуют для офлайн-режима', () => {
  for (const f of ['index.html','main.js','data.js','styles.css','sw.js','manifest.webmanifest','assets/favicon.svg','assets/icon-192.png','assets/icon-512.png']) {
    assert.ok(existsSync(new URL('../' + f, import.meta.url)), f);
  }
});

test('нет внешних библиотек и встроенных трекеров', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url),'utf8');
  const js = readFileSync(new URL('../main.js', import.meta.url),'utf8');
  assert.doesNotMatch(html, /<script[^>]*src=["']https?:/i);
  assert.doesNotMatch(html, /<link[^>]*href=["']https?:/i);
  assert.doesNotMatch(js, /\b(fetch|XMLHttpRequest|sendBeacon)\s*\(/);
  assert.match(html, /lang="ru"/);
});

test('PWA manifest содержит относительный стартовый URL', () => {
  const m = JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));
  assert.equal(m.start_url,'./');
  assert.equal(m.scope,'./');
  assert.equal(m.display,'standalone');
});

test('социальная карточка доступна в PNG-формате', () => {
  const html = readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html, /property="og:image" content="https:\/\/fishand1982\.github\.io\/blizhe-ko-hristu\/assets\/og-cover\.png"/);
  assert.ok(existsSync(new URL('../assets/og-cover.png',import.meta.url)));
});

test('офлайн-кеш не собирает случайные запросы и не отдаёт HTML вместо JS', () => {
  const sw = readFileSync(new URL('../sw.js',import.meta.url),'utf8');
  assert.match(sw, /coreUrls\.has/);
  assert.match(sw, /request\.mode === 'navigate'/);
  assert.match(sw, /Response\.error\(\)/);
  assert.doesNotMatch(sw, /cache\.put\(event\.request,clone\)/);
});

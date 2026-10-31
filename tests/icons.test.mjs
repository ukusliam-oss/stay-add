import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { icon, iconNames } from '../src/lib/icons.ts';
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const scripts=await readdir(new URL('../src/scripts/',import.meta.url));
const app=(await Promise.all(scripts.filter(p=>p.endsWith('.ts')).map(p=>readFile(new URL('../src/scripts/'+p,import.meta.url),'utf8')))).join('\n');
test('navigation and transport icons cannot fall back to OS emoji glyphs',()=>{
  for(const [name,source] of [['initial page',html],['dynamic UI',app]])assert.doesNotMatch(source,/[↗↘↙↖↑↓↺↳▷Ⅱ\uFE0F]/,`${name} must use SVG icons`);
});
test('every initial and dynamic SVG icon resolves to a path and stays decorative',()=>{
  const symbols=[...html.matchAll(/<symbol id="([^"]+)"[^>]*>(.*?)<\/symbol>/g)];
  const names=new Set(symbols.map(m=>m[1]));
  for(const name of iconNames){assert.ok(names.has(`icon-${name}`));const markup=icon(name);assert.match(markup,/aria-hidden="true"/);assert.match(markup,/focusable="false"/);assert.ok(markup.includes(`href="#icon-${name}"`));}
  for(const [,name,body] of symbols)assert.match(body,/<path[^>]+d="[^\"]+"/,name);
  for(const match of html.matchAll(/<svg class="ui-icon"[^>]*>.*?<\/svg>/g)){assert.match(match[0],/aria-hidden="true"/);assert.match(match[0],/focusable="false"/);const target=match[0].match(/href="#([^"]+)"/)[1];assert.ok(names.has(target),target);}
  assert.throws(()=>icon('untrusted-name'),RangeError);
});

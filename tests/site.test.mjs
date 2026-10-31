import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { subjects, connections } from '../src/data/content.ts';
import { searchIndex, filterSearch } from '../src/data/search.ts';
import { subjectIds, lessonPath } from '../src/data/subjects.ts';
import { publicRoutes } from '../src/data/routes.ts';
import { href, canonical } from '../src/lib/paths.ts';
import { parse } from 'parse5';
const root=resolve(import.meta.dirname,'../dist');
async function page(path){const source=await readFile(resolve(root,path.slice(1),'index.html'),'utf8'),nodes=[];function visit(n){if(n.tagName)nodes.push({tag:n.tagName,attrs:Object.fromEntries(n.attrs.map(a=>[a.name,a.value])),node:n});for(const c of n.childNodes||[])visit(c);}visit(parse(source));return {source,nodes,text:JSON.stringify(nodes.map(n=>n.node.childNodes?.filter(c=>c.nodeName==='#text').map(c=>c.value).join(' ')))};}
test('all public routes are emitted as directly readable HTML under the project base',async()=>{
  for(const path of publicRoutes){const {source}=await page(path);assert.ok(source.includes(canonical(path)));}
  assert.equal(href('/subjects/chemistry/'),'/stay-add/subjects/chemistry/');
  assert.equal(href('/labs/reaction-rates#lab'),'/stay-add/labs/reaction-rates/#lab');
});
test('search and all cross-subject destinations exist, including case-insensitive and empty queries',async()=>{
  assert.equal(new Set(searchIndex.map(s=>s.id)).size,searchIndex.length);
  for(const item of searchIndex){assert.ok(publicRoutes.includes(item.path),item.path);await page(item.path);if(item.subject)assert.ok(subjects[item.subject]);}
  for(const group of Object.values(connections))for(const [id,item] of Object.entries(group)){assert.ok(subjects[id]);assert.ok(publicRoutes.includes(item.link),item.link);if(item.subject)assert.ok(subjects[item.subject]);}
  assert.equal(filterSearch(' ').length,searchIndex.length);
  assert.deepEqual(filterSearch(' ARRHENIUS '),filterSearch('arrhenius'));
  assert.ok(filterSearch('arrhenius').some(i=>i.id==='lab-rates'));
  assert.equal(filterSearch('<script>missing</script>').length,0);
});
test('every preview has its actual explanation, accessible native mathematics and review status before JavaScript',async()=>{
  for(const id of subjectIds){const {source,nodes,text}=await page(lessonPath(id));assert.ok(text.includes(subjects[id].definition));assert.ok(text.includes(subjects[id].deeper));assert.ok(source.includes(subjects[id].source));assert.ok(nodes.some(n=>n.tag==='math'&&n.attrs['aria-label']));assert.ok(text.includes('Draft'));assert.ok(source.includes('not the complete eight-part lesson'));}
});
test('the initial lab has a reference curve and unavailable controls are disabled until activation',async()=>{
  const {nodes}=await page('/labs/reaction-rates');
  assert.ok(nodes.find(n=>n.attrs.id==='graph-curve').attrs.d.length>100);
  for(const id of ['temperature','concentration','area','catalyst','run-lab','reset-lab','export-csv'])assert.ok(Object.hasOwn(nodes.find(n=>n.attrs.id===id).attrs,'disabled'),id);
});
test('the static connection and practice pages include native disclosure content without scripting',async()=>{
  const connection=await page('/connect/rates-of-change');
  for(const id of subjectIds)assert.ok(connection.nodes.some(n=>n.attrs.id===`perspective-${id}`));
  assert.ok(connection.nodes.some(n=>n.tag==='details'&&n.attrs.class==='all-perspectives'));
  const practice=await page('/practice/chemistry/reaction-rates');assert.ok(practice.nodes.some(n=>n.tag==='details'&&n.attrs.class==='static-answer'));
});
function luminance(hex){const c=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function contrast(a,b){const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (l[0]+.05)/(l[1]+.05);}
test('small text token pairs and manually reviewed canvas labels meet 4.5:1',()=>{
  for(const [fg,bg] of [['#f0f0e9','#111513'],['#c9ff61','#111513'],['#111513','#c9ff61'],['#5c635c','#f0f0e9'],['#5c635c','#e6e8de'],['#a5aea5','#191e19'],['#8b978a','#111513'],['#a5aea5','#151a16'],['#111513','#e9ebe2'],['#111513','#c1a6f6'],['#111513','#91e3b5'],['#111513','#9dc4ff'],['#111513','#ffc59d']])assert.ok(contrast(fg,bg)>=4.5,`${fg} on ${bg}: ${contrast(fg,bg)}`);
});

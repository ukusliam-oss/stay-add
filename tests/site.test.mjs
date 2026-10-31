import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { subjects, connections, searchIndex } from '../dist/content.js';
const root=resolve(import.meta.dirname,'../dist');
const html=await readFile(resolve(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
test('section anchors, dialog references and local assets resolve',async()=>{
  assert.equal(new Set(ids).size,ids.length,'IDs must be unique');
  for(const match of html.matchAll(/(?:href|aria-controls)="#?([^"]+)"/g))if(ids.includes(match[1])||html.includes(`href="#${match[1]}"`))assert.ok(ids.includes(match[1]),`Missing anchor ${match[1]}`);
  for(const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))await access(resolve(root,match[1]));
  for(const match of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of match[1].split(' '))assert.ok(ids.includes(id)||id==='lesson-title');
});
test('every searchable concept and cross-subject connection has a valid destination',()=>{
  for(const item of searchIndex){if(item.subject)assert.ok(subjects[item.subject]);if(item.connection)assert.ok(connections[item.connection]);if(item.target)assert.ok(ids.includes(item.target.slice(1)));}
  for(const group of Object.values(connections))for(const [id,item] of Object.entries(group)){assert.ok(subjects[id]);assert.ok(ids.includes(item.link.slice(1)));if(item.subject)assert.ok(subjects[item.subject]);}
});
function luminance(hex){const c=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function contrast(a,b){const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (l[0]+.05)/(l[1]+.05);}
test('small text token pairs and manually reviewed canvas labels meet 4.5:1',()=>{
  for(const [fg,bg] of [['#f0f0e9','#111513'],['#c9ff61','#111513'],['#111513','#c9ff61'],['#5c635c','#f0f0e9'],['#5c635c','#e6e8de'],['#a5aea5','#191e19'],['#8b978a','#111513'],['#a5aea5','#151a16'],['#111513','#e9ebe2'],['#111513','#c1a6f6'],['#111513','#91e3b5'],['#111513','#9dc4ff'],['#111513','#ffc59d']])assert.ok(contrast(fg,bg)>=4.5,`${fg} on ${bg}: ${contrast(fg,bg)}`);
});

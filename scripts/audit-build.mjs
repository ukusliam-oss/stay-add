import assert from 'node:assert/strict';
import {readFile,readdir,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve,relative,dirname,extname,sep} from 'node:path';
import {gzipSync} from 'node:zlib';
import {parse} from 'parse5';
import {BASE_PATH,SITE_ORIGIN} from '../src/config/site.ts';
import {publicRoutes} from '../src/data/routes.ts';
import {href} from '../src/lib/paths.ts';
const root=resolve(import.meta.dirname,'../dist');
async function walk(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,e.name);if(e.isDirectory())result.push(...await walk(p));else result.push(p);}return result;}
const files=await walk(root),htmlFiles=files.filter(p=>p.endsWith('.html')),cache=new Map();
async function document(file){if(cache.has(file))return cache.get(file);const source=await readFile(file,'utf8'),nodes=[],ids=new Set();function visit(node){if(node.tagName){const attrs=Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));nodes.push({tag:node.tagName,attrs,node});if(attrs.id){assert.ok(!ids.has(attrs.id),`Duplicate ID ${attrs.id} in ${relative(root,file)}`);ids.add(attrs.id);}}for(const child of node.childNodes||[])visit(child);}visit(parse(source));const doc={source,nodes,ids};cache.set(file,doc);return doc;}
function resolveUrl(value,from){const route='/'+relative(root,from).replace(/index\.html$/,'').split(sep).join('/');const url=new URL(value,SITE_ORIGIN+BASE_PATH+route);if(url.origin!==SITE_ORIGIN)return null;assert.ok(url.pathname===BASE_PATH||url.pathname.startsWith(BASE_PATH+'/'),`URL misses the project base: ${value}`);let path=decodeURIComponent(url.pathname.slice(BASE_PATH.length))||'/';const file=resolve(root,'.'+path+(extname(path)?'':path.endsWith('/')?'index.html':'/index.html'));assert.ok(file.startsWith(root+sep),`URL escapes build directory: ${value}`);return {file,hash:decodeURIComponent(url.hash.slice(1))};}
async function initialJs(file,visited=new Set()){if(visited.has(file))return 0;visited.add(file);const text=await readFile(file,'utf8');let bytes=gzipSync(text).length;for(const m of text.matchAll(/\b(?:import|export)\s*(?:[^'";]*?\bfrom\s*)?['"]([^'"]+)['"]/g)){const p=m[1];if(!p.endsWith('.js')||!p.startsWith('.'))continue;bytes+=await initialJs(resolve(dirname(file),p),visited);}return bytes;}
let links=0;const reports=[];
for(const route of publicRoutes){const file=resolve(root,route.slice(1),'index.html');await access(file);}
for(const file of htmlFiles){
  const doc=await document(file),h1=doc.nodes.filter(n=>n.tag==='h1');assert.equal(h1.length,1,`Expected one H1 in ${relative(root,file)}`);
  assert.ok(doc.nodes.some(n=>n.tag==='main'&&n.attrs.id==='main'),`Missing main landmark in ${file}`);
  const scripts=[];
  for(const {tag,attrs} of doc.nodes){
    for(const name of ['aria-controls','aria-labelledby','aria-describedby'])if(attrs[name])for(const id of attrs[name].split(/\s+/))assert.ok(doc.ids.has(id),`Missing ${name} target ${id} in ${relative(root,file)}`);
    if(tag==='svg'&&attrs.class?.split(' ').includes('ui-icon')){assert.equal(attrs['aria-hidden'],'true');assert.equal(attrs.focusable,'false');}
    for(const name of ['href','src','action'])if(attrs[name]){
      const value=attrs[name];assert.ok(!/^javascript:/i.test(value));if(/^(mailto:|tel:|data:)/.test(value))continue;
      const target=resolveUrl(value,file);if(!target)continue;await access(target.file);links++;
      if(target.hash&&target.file.endsWith('.html'))assert.ok((await document(target.file)).ids.has(target.hash),`Missing fragment ${value} in ${relative(root,file)}`);
      if((tag==='script'&&name==='src')||(tag==='link'&&attrs.rel==='modulepreload'&&name==='href'))scripts.push(target.file);
    }
  }
  let js=0;const visited=new Set();for(const script of scripts)js+=await initialJs(script,visited);
  assert.ok(js<=100000,`Initial JS budget exceeded in ${relative(root,file)}: ${js}`);
  reports.push({page:relative(root,file).split(sep).join('/'),initial_js_gzip:js,scripts:scripts.map(p=>relative(root,p))});
}
const fonts=files.filter(p=>/\.woff2?$/.test(p));let fontBytes=0;for(const file of fonts)fontBytes+=(await readFile(file)).length;assert.ok(fontBytes<=80000,`Font budget exceeded: ${fontBytes}`);
for(const file of files.filter(p=>p.endsWith('.css'))){const css=await readFile(file,'utf8');for(const m of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)){if(m[1].startsWith('data:'))continue;const target=resolveUrl(m[1],file);if(target){await access(target.file);links++;}}}
const report={status:'passed',base_path:BASE_PATH,html_pages:htmlFiles.length,required_routes:publicRoutes.length,internal_references_checked:links,font_bytes:fontBytes,max_initial_js_gzip:Math.max(...reports.map(p=>p.initial_js_gzip)),page_reports:reports};
await mkdir(resolve(root,'../artifacts'),{recursive:true});await writeFile(resolve(root,'../artifacts/p1-build-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,page_reports:undefined},null,2));

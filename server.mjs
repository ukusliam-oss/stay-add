import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import {BASE_PATH} from './src/config/site.ts';
const root=resolve(import.meta.dirname,'dist'),port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
async function notFound(res){try{res.writeHead(404,{'Content-Type':types['.html']});res.end(await readFile(resolve(root,'404.html')));}catch{res.writeHead(404).end('Not found');}}
createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost'),path=decodeURIComponent(url.pathname);
    if(path==='/__qa'||path==='/__qa/axe.min.js'){
      const file=path==='/__qa'?resolve(import.meta.dirname,'tests/audit.html'):resolve(import.meta.dirname,'node_modules/axe-core/axe.min.js');
      const body=await readFile(file);res.writeHead(200,{'Content-Type':path==='/__qa'?types['.html']:types['.js'],'Cache-Control':'no-store'});res.end(body);return;
    }
    if(path==='/'||path===BASE_PATH){res.writeHead(302,{Location:BASE_PATH+'/'+url.search}).end();return;}
    if(!path.startsWith(BASE_PATH+'/')){await notFound(res);return;}
    let file=resolve(root,'.'+path.slice(BASE_PATH.length));
    if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
    const info=await stat(file);
    if(info.isDirectory()){
      if(!path.endsWith('/')){res.writeHead(301,{Location:path+'/'+url.search}).end();return;}
      file=resolve(file,'index.html');
    }
    const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(body);
  }catch{await notFound(res);}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${BASE_PATH}/`));

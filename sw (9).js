const CACHE='medova-v36';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./track01.mp3','./track02.mp3','./track03.mp3','./track04.mp3','./track05.mp3','./track06.mp3','./track07.mp3','./track08.mp3','./track09.mp3','./track10.mp3','./track11.mp3','./track12.mp3','./track13.mp3','./molli.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
async function rangeResp(req,res){const h=req.headers.get('range');const m=/bytes=(\d+)-(\d*)/.exec(h);if(!m)return res;const b=await res.arrayBuffer();const st=+m[1],en=m[2]?+m[2]:b.byteLength-1;return new Response(b.slice(st,en+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':res.headers.get('Content-Type')||'audio/mpeg','Content-Range':'bytes '+st+'-'+en+'/'+b.byteLength,'Content-Length':String(en-st+1)}});}
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);if(u.origin!==location.origin)return;
e.respondWith((async()=>{const c=await caches.open(CACHE);let r=await c.match(q.url,{ignoreSearch:true});
if(!r){try{r=await fetch(q.headers.get('range')?q.url:q);if(r.ok&&!q.headers.get('range'))c.put(q,r.clone());}catch(_){r=await c.match('./index.html');}}
return q.headers.get('range')&&r&&r.status===200?rangeResp(q,r):r;})());});

// MIFIKA : fonctionnement hors connexion (met la page et les bibliothèques en mémoire)
const V='mifika-v22',P=['./','./index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(P).catch(()=>0)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(r.mode==='navigate'){
    e.respondWith((async()=>{const c=await caches.open(V);
      try{const x=await Promise.race([fetch(r),new Promise((_,j)=>setTimeout(j,4000))]);if(x&&x.ok)c.put('./index.html',x.clone());return x}
      catch(_){return (await c.match('./index.html'))||(await c.match('./'))||Response.error()}})());return}
  if(u.origin===location.origin||u.hostname==='www.gstatic.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='fonts.googleapis.com'){
    e.respondWith(caches.open(V).then(async c=>{const m=await c.match(r);
      const n=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>m||Response.error());
      return m||n}))}
});

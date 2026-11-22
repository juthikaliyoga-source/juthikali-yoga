// shared by quiz.html and progress.html
const SETS={1:'Set 1 · MCQ bank',2:'Set 2 · Exam papers',3:'Set 3 · Sample paper'};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
          set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
function myId(){let id=LS.get('yoga-id',null);if(!id){id=Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>(b%36).toString(36)).join('')+Date.now().toString(36);LS.set('yoga-id',id)}return id}
// local history: attempts [{s,d,sc,t,w:[n..],synced:bool}]
const hist=()=>LS.get('yoga-attempts',[]);
const saveHist=a=>LS.set('yoga-attempts',a);
async function flush(){ // send unsynced attempts, keep them if it fails
  const a=hist();let ok=true,changed=false;
  for(const x of a){if(x.synced)continue;
    try{const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:myId(),a:{s:x.s,d:x.d,sc:x.sc,t:x.t,w:x.w}})});
      if(r.ok){x.synced=true;changed=true}else{ok=false;break}}catch(e){ok=false;break}}
  if(changed)saveHist(a);return ok;
}

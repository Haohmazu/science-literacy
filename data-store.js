'use strict';
(() => {
 const KEY='science-literacy.workspace.v2',LEGACY='science-literacy.studio.v1';
 const clone=v=>JSON.parse(JSON.stringify(v));
 const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 function create(initial,validate){
  let state=clone(initial);const listeners=new Set();
  function check(v){const errors=validate(v);if(errors.length)throw Error(errors.join(' '));}
  check(state);
  return Object.freeze({get:()=>clone(state),set(next){check(next);state=clone(next);listeners.forEach(fn=>fn(clone(state)));},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
   save(){check(state);const existing=localStorage.getItem(KEY);if(existing)parse(existing);const payload={schema:2,savedAt:new Date().toISOString(),data:clone(state)};localStorage.setItem(KEY,JSON.stringify(payload));return payload.savedAt;},
   load(){const raw=localStorage.getItem(KEY);if(!raw)return null;return parse(raw).data;},clear(){localStorage.removeItem(KEY);},
   legacy(){const raw=localStorage.getItem(LEGACY);if(!raw)return null;if(raw.length>50000)throw Error('舊版草稿太大，未匯入。');const v=JSON.parse(raw);if(!object(v)||v.schema!==1||typeof v.savedAt!=='string'||!Number.isFinite(Date.parse(v.savedAt))||window.ScienceStudioCore.validate(v.settings).length)throw Error('舊版草稿格式無效，未匯入。');return clone(v.settings);}
  });
  function parse(raw){if(raw.length>200000)throw Error('草稿檔案過大，原資料保留。');let p;try{p=JSON.parse(raw);}catch{throw Error('V2 草稿損壞，未覆寫；請先保留資料或明確清除已存草稿。');}if(!object(p)||p.schema!==2||typeof p.savedAt!=='string'||!Number.isFinite(Date.parse(p.savedAt)))throw Error('V2 草稿版本或格式不相容，原資料保留。');check(p.data);return p;}
 }
 function validate(s){
  const errors=[];const fail=m=>errors.push(m),str=(v,max)=>typeof v==='string'&&v.length<=max;
  const flags=(v,n)=>Array.isArray(v)&&v.length===n&&v.every(x=>typeof x==='boolean');
  const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
  if(!object(s))return ['共用資料格式不正確。'];
  if(!object(s.task)||!str(s.task.title,120)||!str(s.task.objective,2000))fail('任務卡文字格式不正確。');
  const t=s.studio,catalog=window.SCIENCE_CONTENT.studioOptions,options={grade:catalog.grades,semester:catalog.semester,edition:catalog.edition,literacy:catalog.literacy,mode:catalog.mode},abilities=catalog.abilities;
  if(!object(t))fail('工作室資料格式不正確。');else{
   for(const [k,v] of Object.entries(options))if(!v.includes(t[k]))fail('工作室選項無效。');
   for(const [k,max] of Object.entries({book:100,unit:120,taught:3000,curriculum:2000,original:12000}))if(!str(t[k],max))fail('工作室文字過長或格式無效。');
   if(!Array.isArray(t.abilities)||t.abilities.length>5||new Set(t.abilities).size!==t.abilities.length||!t.abilities.every(a=>abilities.includes(a)))fail('能力選項無效。');
   if(!Array.isArray(t.rows)||t.rows.length<1||t.rows.length>20)fail('藍圖列數無效。');else for(const r of t.rows)if(!object(r)||!str(r.goal,200)||!str(r.content,300)||!abilities.includes(r.ability)||!catalog.types.includes(r.type)||!Number.isFinite(r.count)||Math.abs(r.count)>100000||!Number.isFinite(r.points)||Math.abs(r.points)>100000)fail('藍圖格式無效。');
  }
  const r=s.review;if(!object(r)||!['original','rewrite','new','custom'].includes(r.target)||!str(r.reviewer,60)||!str(r.notes,5000)||!flags(r.checks,10))fail('審題資料格式無效。');
  const b=s.basics;if(!object(b)||!integer(b.example,0,1)||!integer(b.step,0,5)||typeof b.revealed!=='boolean')fail('教學操作紀錄無效。');
  const d=s.demo;if(!object(d)||!integer(d.active,0,3)||!object(d.answers)||!Array.isArray(d.compare)||d.compare.length>3||new Set(d.compare).size!==d.compare.length||!d.compare.every(a=>['original','rewrite','new'].includes(a)))fail('示範資料無效。');else for(const [key,v] of Object.entries(d.answers))if(!['original','rewrite','new'].includes(key)||!object(v)||!integer(v.choice,0,3)||typeof v.submitted!=='boolean')fail('作答紀錄無效。');
  const l=s.learning;if(!object(l)||!['group','solo'].includes(l.route)||!flags(l.checks,5)||![null,'0','1','2'].includes(l.answer)||!str(l.feedback,1000)||!str(l.reflection,4000))fail('學習資料格式無效。');
  if(!['home','m01','m02','m03','m04','m05','m06','m07','m08'].includes(s.module))fail('頁籤紀錄無效。');
  return errors;
 }
 window.ScienceData=Object.freeze({content:window.SCIENCE_CONTENT,create,validate,keys:Object.freeze({workspace:KEY,legacy:LEGACY})});
})();

'use strict';
(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const KEY='science-literacy.studio.v1';
 const abilities=window.SCIENCE_CONTENT.studioOptions.abilities;
 const types=window.SCIENCE_CONTENT.studioOptions.types;
 const grades=window.SCIENCE_CONTENT.studioOptions.grades;
 const catalog=window.SCIENCE_CONTENT.studioOptions;
 const choices={grade:grades,semester:catalog.semester,edition:catalog.edition,literacy:catalog.literacy,mode:catalog.mode};
 const modes={analyze:['原題分析','分析原題的科學概念、預定與實際評量能力、作答證據、各選項迷思、答案解析及限制。不要直接重寫或新增題目；藍圖僅作為對齊參照，原題不足以達成的目標須明示。'],rewrite:['改寫原題','保留原題核心科學概念，依命題藍圖改寫成指定題型與題數。列出改寫前後的差異、保留內容及修改理由，不改成與原概念無關的主題。'],generate:['生成新題','依單元、已教內容與命題藍圖生成全新試題，精確遵守各列題型、題數與配分；避免僅替換人名或數字。'],review:['AI 審題','審查原題與解析，逐項檢核：科學正確、目標對齊、情境必要、證據充分、變因控制、數據單位、答案唯一、誘答品質、適齡公平、來源與模擬標示。列出證據、問題、嚴重程度、修訂建議及待確認資訊；不得只給總分或宣稱已認證品質。藍圖只供對照，不要求虛構不存在的題目。']};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // 選項由統一目錄建立；保留首頁原本的預設選取值。
 for(const [key,values] of Object.entries(choices)){const el=$(`#studio-${key}`),selected=el.value;el.innerHTML=values.map(value=>`<option value="${esc(value)}">${esc(key==='mode'?modes[value][0]:value)}</option>`).join('');el.value=values.includes(selected)?selected:values[0];}
 const checkedAbilities=$$('[data-studio-ability]:checked').map(c=>c.value);
 $('.ability-list').innerHTML='<legend>評量能力（至少一項）</legend>'+abilities.map(value=>`<label><input type="checkbox" data-studio-ability value="${esc(value)}" ${checkedAbilities.includes(value)?'checked':''}> ${esc(value)}</label>`).join('');
 function validate(s){
  const errors=[];if(!s||typeof s!=='object'||Array.isArray(s))return ['草稿資料格式不正確。'];
  for(const [key,values] of Object.entries(choices))if(!values.includes(s[key]))errors.push(`${key} 設定不在可用選項內。`);
  for(const [key,max] of Object.entries({book:100,unit:120,taught:3000,curriculum:2000,original:12000}))if(typeof s[key]!=='string'||s[key].length>max)errors.push(`${key} 文字格式或長度不正確。`);
  if(typeof s.unit==='string'&&!s.unit.trim())errors.push('請填寫單元。');
  if(typeof s.taught==='string'&&!s.taught.trim())errors.push('請填寫已教內容與先備能力。');
  if(!Array.isArray(s.abilities)||!s.abilities.length||s.abilities.length>5||new Set(s.abilities).size!==s.abilities.length||!s.abilities.every(a=>abilities.includes(a)))errors.push('請至少選擇一項有效評量能力。');
  if(s.mode!=='generate'&&(typeof s.original!=='string'||!s.original.trim()))errors.push('分析、改題或審題模式請填入原題。');
  if(!Array.isArray(s.rows)||s.rows.length<1||s.rows.length>20)errors.push('藍圖須有 1–20 列。');
  else s.rows.forEach((r,i)=>{
   if(!r||typeof r!=='object'){errors.push(`藍圖第 ${i+1} 列格式不正確。`);return;}
   for(const [key,label,max] of [['goal','目標',200],['content','內容',300]])if(typeof r[key]!=='string'||!r[key].trim()||r[key].length>max)errors.push(`藍圖第 ${i+1} 列請填寫有效${label}。`);
   if(!abilities.includes(r.ability)||!types.includes(r.type))errors.push(`藍圖第 ${i+1} 列能力或題型無效。`);
   else if(Array.isArray(s.abilities)&&!s.abilities.includes(r.ability))errors.push(`藍圖第 ${i+1} 列能力尚未列入上方評量能力，請勾選或調整該列。`);
   if(!Number.isInteger(r.count)||r.count<1||r.count>50)errors.push(`藍圖第 ${i+1} 列題數須為 1–50 的整數。`);
   if(!Number.isInteger(r.points)||r.points<1||r.points>100)errors.push(`藍圖第 ${i+1} 列每題配分須為 1–100 的整數。`);
  });
  return errors;
 }
 function totals(rows){return rows.reduce((a,r)=>({count:a.count+r.count,score:a.score+r.count*r.points}),{count:0,score:0});}
 function prompt(s){
  const errors=validate(s);if(errors.length)throw Error(errors.join('\n'));
  const total=totals(s.rows),task=modes[s.mode];
  return [`自然科學素養導向命題協作｜${task[0]}`,'請以繁體中文回覆。你是協助教師的評量設計者，所有輸出仍須由教師查核。',window.ScienceTaskContext?`【共用命題任務】\n${window.ScienceTaskContext()}`:'','',`【任務】\n${task[1]}`,'',`【教學條件】\n年級：${s.grade}\n學期：${s.semester}\n教材版本：${s.edition}\n學年度／教材名稱：${s.book.trim()||'未指定'}\n單元：${s.unit.trim()}\n素養命題模式：${s.literacy}\n評量能力：${s.abilities.join('、')}\n已教內容與先備能力：${s.taught.trim()}`,`課綱依據／學習重點：${s.curriculum.trim()||'未提供已查證原文。不得自行填造課綱代碼，請列待教師確認。'}`,'',`【命題藍圖】\n${s.rows.map((r,i)=>`${i+1}. 目標：${r.goal.trim()}；內容：${r.content.trim()}；能力：${r.ability}；題型：${r.type}；題數：${r.count}；每題 ${r.points} 分；小計 ${r.count*r.points} 分。`).join('\n')}\n總計 ${total.count} 題，${total.score} 分。題組的「一題」指一個計分小題；共同情境不另計分。`,s.original.trim()?`\n【教師提供的原題／待審資料】\n${s.original.trim()}${s.mode==='generate'?'\n本模式以上述原題作為參考，須生成新任務，避免只換數字。':''}`:'','',`【設計要求】\n1. 依已教內容與年級調整閱讀量，情境及資料必須參與解題。\n2. 整合學習內容、學習表現與跨科概念；未知資訊列待確認，不杜撰教材原文或課綱代碼。\n3. 科學概念、數據、單位、控制條件與推論範圍須一致。自編數據明示「模擬數據，非實測」。\n4. 單選題須有唯一最佳答案；多選題須交代選答數與計分方式；簡答題須有可接受表述與部分給分規準；題組須列各小題與配分。\n5. 若為出題或改題，逐題提供題幹、選項（適用時）、答案、解析、評量目標、誘答迷思或評分規準，以及限制。\n6. 無法確認的來源或科學敘述請明示；不得假裝已做實驗、檢索官方文件或完成教師審查。\n7. 若條件不足或互相衝突，先列問題與合理補充需求，不以猜測冒充確定結果。`].filter(x=>x!==undefined).join('\n');
 }
 // 純資料函式可供維護者測試，無網路或儲存副作用。
 window.ScienceStudioCore=Object.freeze({validate,totals,prompt});
 function collect(){const s={};for(const key of [...Object.keys(choices),'book','unit','taught','curriculum','original'])s[key]=$(`#studio-${key}`).value;s.abilities=$$('[data-studio-ability]:checked').map(a=>a.value);s.rows=$$('[data-blueprint-row]').map(row=>{const r={};for(const key of ['goal','content','ability','type','count','points']){const value=row.querySelector(`[data-field="${key}"]`).value;r[key]=['count','points'].includes(key)?Number(value):value;}return r;});return s;}
 function optionList(values,current){return values.map(v=>`<option ${v===current?'selected':''}>${esc(v)}</option>`).join('');}
 let rowId=0;
 function addRow(r={goal:'依據資料提出合理解釋',content:'水的蒸發',ability:'資料判讀',type:'單選題',count:1,points:5}){
  const id=++rowId,el=document.createElement('div');el.className='blueprint-row';el.dataset.blueprintRow=String(id);
  el.innerHTML=`<div class="row-header"><b>藍圖列</b><button type="button" class="outline" data-remove-row>刪除此列</button></div><div class="settings-grid"><label>評量目標<input data-field="goal" maxlength="200" value="${esc(r.goal)}"></label><label>評量內容<input data-field="content" maxlength="300" value="${esc(r.content)}"></label><label>主要能力<select data-field="ability">${optionList(abilities,r.ability)}</select></label><label>題型<select data-field="type">${optionList(types,r.type)}</select></label><label>題數<input data-field="count" type="number" min="1" max="50" step="1" value="${r.count}"></label><label>每題配分<input data-field="points" type="number" min="1" max="100" step="1" value="${r.points}"></label></div><output data-subtotal></output>`;
  el.querySelector('[data-remove-row]').addEventListener('click',()=>{if($$('[data-blueprint-row]').length===1){$('#studio-status').textContent='至少保留一列藍圖。';return;}el.remove();refresh();});$('#blueprint-rows').append(el);
 }
 function refresh(){
  const s=collect(),errors=validate(s),valid=!errors.length;
  $$('[data-blueprint-row]').forEach((row,i)=>{const r=s.rows[i];row.querySelector('.row-header b').textContent=`藍圖列 ${i+1}`;row.querySelector('[data-subtotal]').textContent=Number.isInteger(r.count)&&r.count>0&&r.count<=50&&Number.isInteger(r.points)&&r.points>0&&r.points<=100?`小計：${r.count} 題 × ${r.points} 分 = ${r.count*r.points} 分`:'小計：請先修正題數及配分。';});
  const numeric=s.rows.every(r=>Number.isInteger(r.count)&&r.count>=1&&r.count<=50&&Number.isInteger(r.points)&&r.points>=1&&r.points<=100),total=totals(s.rows);
  $('#blueprint-total').textContent=numeric?`總計 ${total.count} 題 · ${total.score} 分`:'總計暫停：請先修正各列題數或配分。';
  $('#studio-mode-hint').textContent=modes[s.mode][1];$('#studio-preview').value=valid?prompt(s):'';$('#copy-studio').disabled=!valid;$('#download-studio').disabled=!valid;$('#add-blueprint').disabled=s.rows.length>=20;
  $('#studio-status').textContent=valid?'設定有效，提示詞已更新。尚未自動儲存或執行 AI。':errors.join(' ');$('#studio-copy-manual').hidden=true;$('#studio-copy-text').value='';$('#studio-copy-status').textContent='';return valid;
 }
 function apply(s){for(const key of [...Object.keys(choices),'book','unit','taught','curriculum','original'])$(`#studio-${key}`).value=s[key];$$('[data-studio-ability]').forEach(a=>a.checked=s.abilities.includes(a.value));$('#blueprint-rows').replaceChildren();s.rows.forEach(addRow);refresh();}
 function storageFailure(action){$('#studio-status').textContent=`無法${action}本機草稿：瀏覽器可能禁止儲存、空間不足或使用檔案／無痕模式。目前畫面仍保留，請下載 TXT 備份。`;}
 $('#studio-form').addEventListener('submit',e=>{e.preventDefault();refresh();});$('#studio-form').addEventListener('input',refresh);$('#studio-form').addEventListener('change',refresh);
 $('#add-blueprint').addEventListener('click',()=>{if($$('[data-blueprint-row]').length>=20)return;addRow();refresh();});
 $('#save-studio').addEventListener('click',()=>{if(window.SciencePersistence){window.SciencePersistence.save();return;}if(!refresh())return;try{const payload={schema:1,savedAt:new Date().toISOString(),settings:collect()};localStorage.setItem(KEY,JSON.stringify(payload));$('#studio-status').textContent='本機草稿已儲存。僅此瀏覽器與網址可讀取，未傳送資料。';}catch{storageFailure('儲存');}});
 $('#load-studio').addEventListener('click',()=>{
  if(window.SciencePersistence){window.SciencePersistence.load();return;}
  let raw;try{raw=localStorage.getItem(KEY);}catch{storageFailure('讀取');return;}
  if(!raw){$('#studio-status').textContent='目前沒有已儲存的本機草稿。';return;}
  try{if(raw.length>50000)throw Error('too large');const p=JSON.parse(raw);if(!p||p.schema!==1||typeof p.savedAt!=='string'||!Number.isFinite(Date.parse(p.savedAt))||validate(p.settings).length)throw Error('invalid');apply(p.settings);$('#studio-status').textContent='已讀取本機草稿，提示詞已更新。';}
  catch{$('#studio-status').textContent='草稿格式損壞、版本不相容或設定無效，未套用也未刪除；目前畫面保留。';}
 });
 $('#clear-studio').addEventListener('click',()=>{if(window.SciencePersistence){window.SciencePersistence.clear();return;}try{localStorage.removeItem(KEY);$('#studio-status').textContent='已清除已存草稿，目前畫面設定保留。其他網站資料未刪除。';}catch{storageFailure('清除');}});
 $('#copy-studio').addEventListener('click',async()=>{
  if(!refresh())return;const text=$('#studio-preview').value;
  try{if(!window.isSecureContext||!navigator.clipboard)throw Error('unavailable');await navigator.clipboard.writeText(text);$('#studio-copy-status').textContent='提示詞已複製，請貼入外部 AI 工具。';}
  catch{$('#studio-copy-manual').hidden=false;const area=$('#studio-copy-text');area.value=text;area.focus();area.select();$('#studio-copy-status').textContent='自動複製不可用，已提供手動複製文字。';}
 });
 $('#download-studio').addEventListener('click',()=>{
  if(!refresh())return;let url,a;
  try{const blob=new Blob(['\uFEFF'+$('#studio-preview').value],{type:'text/plain;charset=utf-8'});url=URL.createObjectURL(blob);a=document.createElement('a');a.href=url;a.download='自然科學命題提示詞.txt';document.body.append(a);a.click();$('#studio-copy-status').textContent='已提出 TXT 下載請求；請查看瀏覽器下載清單。若被限制，可改用複製。';}
  catch{$('#studio-copy-status').textContent='瀏覽器無法啟動下載，請使用複製提示詞備份。';}
  finally{a?.remove();if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}
 });
 window.ScienceStudio={snapshot:collect,restore:apply,refresh};
 addRow({goal:'比較資料並選擇有證據的結論',content:'水的蒸發與風的條件',ability:'資料判讀',type:'單選題',count:3,points:5});
 addRow({goal:'引用資料解釋並限制推論',content:'蒸發量與控制變因',ability:'證據推理',type:'簡答題',count:1,points:10});refresh();
})();

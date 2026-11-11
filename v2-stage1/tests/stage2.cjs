const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const root=path.resolve(__dirname,'..');let n=0;const logs=[],errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
function ok(v,s){assert.ok(v,s);logs.push(`通過 ${++n}：${s}`)}
const w=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'file://'+root+'/index.html',runScripts:'outside-only',virtualConsole:vc}).window,d=w.document;
for(const f of ['content.js','app.js','stage2.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
const $=s=>d.querySelector(s),all=s=>[...d.querySelectorAll(s)],click=s=>$(s).click(),tick=()=>new Promise(r=>setTimeout(r,10));
function select(q,i){const el=$(`[data-quiz="${q}"] input[value="${i}"]`);el.checked=true;el.dispatchEvent(new w.Event('change',{bubbles:true}));}
function submit(q){$(`[data-quiz="${q}"]`).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));}
(async()=>{
ok(all('[data-demo]').length===4,'四階段示範按鈕');
for(let i=0;i<4;i++){click(`[data-demo="${i}"]`);ok(all('[data-demo][aria-pressed="true"]').length===1,`階段 ${i+1} 唯一選取`);ok($('#demo-prompt-text').textContent===w.SCIENCE_CONTENT.evaporation.prompts[i].text,`階段 ${i+1} 提示詞對應`);}
for(const q of w.SCIENCE_CONTENT.evaporation.questions){
 if(q.id!=='original')click(`[data-demo="${q.id==='rewrite'?1:2}"]`);
 submit(q.id);ok($(`#feedback-${q.id}`).textContent.includes('請先選擇'),'未作答送出提示');
 for(let i=0;i<4;i++){select(q.id,i);submit(q.id);ok($(`#feedback-${q.id}`).textContent.includes(i===q.answer?'答對了':'再想一想'),`${q.id} 選項 ${i+1} 判定`);ok($(`#feedback-${q.id}`).textContent.includes(q.explanation),`${q.id} 選項 ${i+1} 完整解析`);}
 select(q.id,q.answer);submit(q.id);
 if(q.id!=='original'){click('[data-demo="0"]');click(`[data-demo="${q.id==='rewrite'?1:2}"]`);ok($(`[data-quiz="${q.id}"] input:checked`).value===String(q.answer),'跨階段保留答案');ok($(`#feedback-${q.id}`).textContent.includes('答對了'),'跨階段保留解析');}
 click(`[data-retry="${q.id}"]`);ok(!$(`[data-quiz="${q.id}"] input:checked`),'重新作答清空選項');ok(!$(`#feedback-${q.id}`).textContent.includes(q.explanation),'重新作答移除解析');
}
ok(all('[data-compare]:checked').length===3,'比較表預設三題');ok(all('#evap-comparison thead th').length===4,'比較表三題加面向欄');
for(const c of all('[data-compare]'))c.click();ok($('#evap-comparison').textContent.includes('至少勾選'),'比較全不選顯示提示');click('[data-compare="rewrite"]');ok(all('#evap-comparison thead th').length===2,'單題比較可用');ok($('#evap-comparison').textContent.includes('8 g 與 3 g'),'比較內容數字正確');
ok(all('#pitfalls details').length===10,'十大命題地雷');ok(all('[data-review]').length===10,'十項檢核');
ok($('#review-output').value.includes('已查核：0 / 10'),'初始不預先認定通過');
all('[data-review]').forEach(c=>c.click());ok($('#review-count').textContent.includes('已查核 10 / 10'),'十項可全部勾選');ok($('#review-output').value.includes('不代表試題自動合格'),'全勾仍無品質認證');
$('#reviewer').value='<img src=x onerror=alert(1)>';$('#reviewer').dispatchEvent(new w.Event('input',{bubbles:true}));$('#review-notes').value='需補充重複測量。\n保留限制。';$('#review-notes').dispatchEvent(new w.Event('input',{bubbles:true}));$('#review-target').value='new';$('#review-target').dispatchEvent(new w.Event('change',{bubbles:true}));click('#export-review');
ok($('#review-output').value.includes('水的蒸發・新題'),'匯出對象');ok($('#review-output').value.includes('需補充重複測量。\n保留限制。'),'匯出保留多行備註');ok($('#review-output').value.includes('<img src=x onerror=alert(1)>'),'使用者文字以純文字匯出');ok(!d.querySelector('img'),'使用者內容未注入 HTML');ok(($('#review-output').value.match(/\[已查核\]/g)||[]).length===10,'匯出列出十個已查核項目');click('[data-review="4"]');ok($('#review-output').value.includes('[待檢核] 5.'),'取消單項後紀錄同步');
click('#copy-review');await tick();ok(!$('#review-copy-manual').hidden,'審題複製備援顯示');ok($('#review-copy-text').value===$('#review-output').value,'審題備援全文一致');
for(let i=0;i<4;i++){click(`[data-demo="${i}"]`);click('#copy-demo-prompt');await tick();ok(!$('#demo-copy-manual').hidden,`階段 ${i+1} 提示詞備援`);ok($('#demo-copy-text').value===w.SCIENCE_CONTENT.evaporation.prompts[i].text,'提示詞備援內容正確');}
let copied='';Object.defineProperty(w,'isSecureContext',{value:true,configurable:true});Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async t=>{copied=t}}});
for(let i=0;i<4;i++){click(`[data-demo="${i}"]`);click('#copy-demo-prompt');await tick();ok(copied===w.SCIENCE_CONTENT.evaporation.prompts[i].text,`階段 ${i+1} 模擬 API 複製全文`);}
click('#copy-review');await tick();ok(copied===$('#review-output').value,'審題模擬 API 複製全文');
Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}},configurable:true});click('#copy-review');await tick();ok(!$('#review-copy-manual').hidden,'審題權限拒絕備援');click('#copy-demo-prompt');await tick();ok(!$('#demo-copy-manual').hidden,'提示詞權限拒絕備援');
$('#review-form').reset();await tick();ok(!all('[data-review]').some(c=>c.checked),'重設清空全部勾選');ok($('#reviewer').value===''&&$('#review-notes').value==='','重設清空名字與備註');ok($('#review-target').value==='rewrite','重設回預設對象');ok($('#review-output').value.includes('已查核：0 / 10'),'重設更新匯出');ok($('#review-copy-manual').hidden&&$('#review-copy-text').value==='','重設移除舊備援紀錄');
// 同頁載入第二階段後，再檢查第一階段互動。
click('[data-example="1"]');ok($('#compare-content').textContent.includes('材料導熱'),'M01 回歸比較切換');click('#reveal');ok(!$('#compare-analysis').hidden,'M01 回歸解析');
for(let i=0;i<6;i++){click(`[data-step="${i}"]`);ok($('#step-panel').textContent.includes(w.SCIENCE_CONTENT.steps[i][0]),`M03 回歸步驟 ${i+1}`);}
for(let i=0;i<3;i++){click(`[data-copy="${i}"]`);await tick();ok($('#copy-text').value===w.SCIENCE_CONTENT.prompts[i].text,`M07 回歸提示詞 ${i+1}`);}
const ids=all('[id]').map(e=>e.id);ok(new Set(ids).size===ids.length,'動態載入後無重複 ID');for(const a of all('a[href^="#"]'))ok(d.getElementById(a.hash.slice(1)),'所有內部錨點存在');
ok(JSON.stringify(w.SCIENCE_CONTENT)===JSON.stringify(JSON.parse(fs.readFileSync(path.join(root,'content.json'),'utf8'))),'整合 JSON 與 JS 同步');
const q=w.SCIENCE_CONTENT.evaporation.questions[1];ok(q.table.rows[0][2]-q.table.rows[0][3]===8&&q.table.rows[1][2]-q.table.rows[1][3]===3,'蒸發減少量計算');ok(q.table.caption.includes('模擬'),'數據表標示模擬');ok(errors.length===0,'整合 DOM 無 JavaScript 例外');
console.log(logs.join('\n'));console.log(`總計 ${n} 項斷言通過。DOM 與模擬剪貼簿測試，非真實瀏覽器或系統剪貼簿驗證。`);
})().catch(e=>{console.error(e);process.exitCode=1});

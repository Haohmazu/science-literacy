const {JSDOM, VirtualConsole}=require('jsdom');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');let checks=0;const log=[];
function ok(v,name){assert.ok(v,name);checks++;log.push(`通過 ${checks}：${name}`)}
const vc=new VirtualConsole();const errors=[];vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{runScripts:'outside-only',url:'file://'+root+'/index.html',virtualConsole:vc});
const w=dom.window,d=w.document;
w.eval(fs.readFileSync(path.join(root,'content.js'),'utf8'));w.eval(fs.readFileSync(path.join(root,'app.js'),'utf8'));
(async()=>{
ok(d.documentElement.lang==='zh-Hant','繁體中文語言標記');
for(const a of d.querySelectorAll('a[href^="#"]'))ok(d.getElementById(a.getAttribute('href').slice(1)),`內部導覽 ${a.getAttribute('href')} 存在`);
ok(d.querySelectorAll('#steps button').length===6,'六個實際步驟');
for(let i=0;i<6;i++){d.querySelector(`[data-step="${i}"]`).click();ok(d.querySelector('#step-panel').textContent.includes(w.SCIENCE_CONTENT.steps[i][0]),`步驟 ${i+1} 切換內容`);ok(d.querySelectorAll('[data-step][aria-pressed="true"]').length===1,`步驟 ${i+1} 唯一選取`)}
for(let i=0;i<2;i++){d.querySelector(`[data-example="${i}"]`).click();ok(d.querySelector('#compare-content').textContent.includes(i?'材料導熱':'植物生長'),`比較主題 ${i+1}`);ok(d.querySelector('#compare-analysis').hidden,'切換時收起解析');d.querySelector('#reveal').click();ok(!d.querySelector('#compare-analysis').hidden&&d.querySelector('#reveal').getAttribute('aria-expanded')==='true','展開解析同步無障礙狀態');d.querySelector('#reveal').click();ok(d.querySelector('#compare-analysis').hidden,'收起解析');}
for(let i=0;i<3;i++){d.querySelector(`[data-copy="${i}"]`).click();await Promise.resolve();ok(!d.querySelector('#manual-copy').hidden,'file 模式手動複製備援');ok(d.querySelector('#copy-text').value===w.SCIENCE_CONTENT.prompts[i].text,`提示詞 ${i+1} 手動文字完全一致`)}
let copied='';Object.defineProperty(w,'isSecureContext',{value:true,configurable:true});Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async t=>{copied=t}},configurable:true});
for(let i=0;i<3;i++){d.querySelector(`[data-copy="${i}"]`).click();await new Promise(r=>setImmediate(r));ok(copied===w.SCIENCE_CONTENT.prompts[i].text,`提示詞 ${i+1} Clipboard API 文字一致（模擬 API）`);ok(d.querySelector('#manual-copy').hidden,'成功時隱藏手動備援');}
Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}},configurable:true});d.querySelector('[data-copy="0"]').click();await new Promise(r=>setImmediate(r));ok(!d.querySelector('#manual-copy').hidden,'剪貼簿權限拒絕後提供備援');
ok(JSON.stringify(w.SCIENCE_CONTENT)===JSON.stringify(JSON.parse(fs.readFileSync(path.join(root,'content.json'),'utf8'))),'JSON 與直接開啟使用的 JS 資料完全一致');
const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);ok(new Set(ids).size===ids.length,'無重複 HTML ID');
for(const a of d.querySelectorAll('a[href^="https:"]'))ok(new URL(a.href).hostname==='www.naer.edu.tw'&&a.rel.includes('noopener'),'官方來源與新視窗安全屬性');
for(const file of ['app.js','content.js','styles.css'])ok(fs.existsSync(path.join(root,file)),`本機資源 ${file} 存在`);
ok(!fs.readFileSync(path.join(root,'app.js'),'utf8').includes('fetch('),'網站無 API 或本機 JSON fetch 依賴');ok(errors.length===0,'DOM 執行無 JavaScript 例外');
console.log(log.join('\n'));console.log(`總計 ${checks} 項斷言通過。注意：DOM 模擬並非真實瀏覽器、渲染或系統剪貼簿測試。`);
})().catch(e=>{console.error(e);process.exitCode=1});

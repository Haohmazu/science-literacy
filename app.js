'use strict';
const data = window.SCIENCE_CONTENT;
const examples = [
 {title:'植物生長',basic:'植物製造養分需要哪一種能量？',answer:'光能。這類提問可檢查概念記憶，尚未要求使用觀察資料。',applied:'同種、初始大小相近的幼苗各 10 株，分成兩組；土壤、水分、溫度與觀察時間相同，只有光照條件不同。兩週後，有光組平均增加 4 片葉，無光組平均增加 1 片葉。這些紀錄支持「在本實驗條件下，光照會影響葉片增加數」嗎？請引用資料說明。',analysis:'支持。兩組平均增加數分別為 4 與 1 片，且其他列明條件相同，因此資料支持本實驗條件下光照與葉片增加的差異。不能把葉片數直接當作光合作用速率，也不能推論所有植物在所有環境都相同。',difference:'記憶題辨識光能；情境題要求比較資料、辨識控制條件，並限制推論範圍。若刪去觀察數據仍能作答，便應再檢查資料是否真的參與推理。'},
 {title:'材料導熱',basic:'金屬通常是熱的良導體，還是不良導體？',answer:'良導體。這類提問檢查材料導熱性概念，不直接評量實驗資料判讀。',applied:'在相同環境中，將長度、粗細相同的金屬棒與木棒，一端接觸相同溫度的熱源。在距離熱源相同的位置測溫：起始皆為 25°C，3 分鐘後金屬棒為 42°C，木棒為 28°C。哪一種材料在這次實驗中傳熱較快？請以溫度變化支持判斷。',analysis:'金屬棒。相同時間內測點溫度上升 17°C，木棒上升 3°C，在題目所列控制條件下支持金屬傳熱較快。這些數據不足以計算導熱係數，也不能推出金屬本身會產生熱。',difference:'記憶題判斷材料性質；情境題需計算溫度變化並比較證據。應交代測點與熱源條件，避免單看最終溫度而忽略起始條件。'}
];
let currentExample = 0;
function renderComparison(index) {
 currentExample = index;
 const e = examples[index];
 document.querySelectorAll('[data-example]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.example) === index)));
 document.querySelector('#compare-content').innerHTML = `<div class="compare-grid"><article class="question"><span class="label">A / 概念記憶</span><h3>${e.title}・知道概念</h3><p>${e.basic}</p><p class="caption">參考答案：${e.answer}</p></article><article class="question"><span class="label">B / 證據推理</span><h3>${e.title}・運用概念</h3><p>${e.applied}</p><p class="caption">資料為本站自編模擬，僅供命題教學。</p></article></div>`;
 document.querySelector('#compare-analysis').hidden = true;
 document.querySelector('#compare-analysis').innerHTML = `<b>參考解析</b><p>${e.analysis}</p><b>設計差異</b><p>${e.difference}</p>`;
 document.querySelector('#reveal').setAttribute('aria-expanded','false');
 document.querySelector('#reveal').textContent = '查看命題差異 ＋';
}
function renderStep(index) {
 document.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.step) === index)));
 const s=data.steps[index];
 document.querySelector('#step-panel').innerHTML=`<div class="big">0${index+1}</div><h3>${s[0]}</h3><b>${s[1]}</b><p>${s[2]}</p><div class="output">${s[3]}</div>`;
}
async function copyPrompt(index) {
 const text=data.prompts[index].text;
 const status=document.querySelector('#copy-status');
 const manual=document.querySelector('#manual-copy');
 manual.hidden=true;
 try {
  if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
  await navigator.clipboard.writeText(text);
  status.textContent=`已複製「${data.prompts[index].title}」提示詞。請貼到外部 AI 工具並填入條件。`;
 } catch {
  manual.hidden=false;
  const area=document.querySelector('#copy-text');area.value=text;area.focus();area.select();
  status.textContent='瀏覽器未允許自動複製，已提供手動複製文字。';
 }
}
document.querySelector('#steps').innerHTML=data.steps.map((s,i)=>`<button data-step="${i}" aria-pressed="${i===0}" aria-controls="step-panel"><span>0${i+1}</span>${s[0]}</button>`).join('');
document.querySelector('#prompts').innerHTML=data.prompts.map((p,i)=>`<article><span class="tag">${p.tag}</span><h3>${p.title}</h3><pre>${p.text}</pre><button class="outline" data-copy="${i}">複製提示詞 ↗</button></article>`).join('');
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>renderStep(Number(b.dataset.step))));
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>renderComparison(Number(b.dataset.example))));
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyPrompt(Number(b.dataset.copy))));
document.querySelector('#reveal').addEventListener('click',()=>{
 const panel=document.querySelector('#compare-analysis');panel.hidden=!panel.hidden;
 document.querySelector('#reveal').setAttribute('aria-expanded',String(!panel.hidden));
 document.querySelector('#reveal').textContent=panel.hidden?'查看命題差異 ＋':'收起命題差異 −';
});
renderComparison(0);renderStep(0);

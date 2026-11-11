'use strict';
const data = window.ScienceData?.content || window.SCIENCE_CONTENT;
const examples = data.comparisons;
let currentExample = 0, currentStep = 0;
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
 currentStep = index;
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

window.ScienceBasics={snapshot:()=>({example:currentExample,step:currentStep,revealed:!document.querySelector('#compare-analysis').hidden}),restore:s=>{renderComparison(s.example);renderStep(s.step);document.querySelector('#compare-analysis').hidden=!s.revealed;document.querySelector('#reveal').setAttribute('aria-expanded',String(s.revealed));document.querySelector('#reveal').textContent=s.revealed?'收起命題差異 −':'查看命題差異 ＋';}};

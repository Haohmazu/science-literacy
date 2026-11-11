'use strict';
(() => {
 const content=window.ScienceData?.content || window.SCIENCE_CONTENT, demo=content.evaporation;
 const answers={};let active=0;
 const $=s=>document.querySelector(s);
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const letters=['A','B','C','D'];
 function table(t){return `<div class="table-scroll" tabindex="0" role="region" aria-label="模擬資料表，可左右捲動"><table><caption>${escape(t.caption)}</caption><thead><tr>${t.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(v=>`<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
 function question(q){
  const a=answers[q.id];
  return `<article class="quiz" data-question="${q.id}"><span class="eyebrow">本站自編教學試題</span><h3>${escape(q.title)}</h3><p>${escape(q.stem)}</p>${q.table?table(q.table):''}<form data-quiz="${q.id}"><fieldset><legend>選擇一個答案，再按「送出答案」</legend>${q.options.map((o,i)=>`<label class="option"><input type="radio" name="answer-${q.id}" value="${i}" ${a?.choice===i?'checked':''}> <span>${letters[i]}　${escape(o)}</span></label>`).join('')}</fieldset><button class="outline" type="submit">送出答案</button><button class="outline" type="button" data-retry="${q.id}">重新作答</button><div class="quiz-feedback" id="feedback-${q.id}" role="status">${a?.submitted?feedback(q,a.choice):''}</div></form></article>`;
 }
 function feedback(q,choice){return `<b>${choice===q.answer?'答對了':'再想一想'}：你選擇 ${letters[choice]}。</b><p>${escape(q.explanation)}</p>`;}
 function bindQuiz(container){
  container.querySelectorAll('[data-quiz]').forEach(form=>{
   const id=form.dataset.quiz,q=demo.questions.find(q=>q.id===id);
   form.addEventListener('change',()=>{const selected=form.querySelector('input:checked');answers[id]={choice:Number(selected.value),submitted:false};$(`#feedback-${id}`).textContent='已變更選項，請送出答案查看解析。';});
   form.addEventListener('submit',e=>{e.preventDefault();const selected=form.querySelector('input:checked');if(!selected){$(`#feedback-${id}`).textContent='請先選擇一個答案，再送出。';return;}answers[id]={choice:Number(selected.value),submitted:true};$(`#feedback-${id}`).innerHTML=feedback(q,Number(selected.value));});
   form.querySelector('[data-retry]').addEventListener('click',()=>{delete answers[id];form.reset();form.querySelectorAll('input').forEach(i=>{i.checked=false;i.defaultChecked=false;});$(`#feedback-${id}`).textContent='已重設，請重新選擇答案。';});
  });
 }
 function cards(rows){return rows.map(([title,text])=>`<article class="analysis-card"><h3>${escape(title)}</h3><p>${escape(text)}</p></article>`).join('');}
 function renderDemo(index){
  active=index;document.querySelectorAll('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.demo)===index)));
  const panel=$('#demo-panel');
  panel.innerHTML=index===0?`<h3>AI 分析｜看清原題測到什麼</h3>${cards(demo.analysis)}`:index===3?`<h3>AI 審題｜預寫審查示例</h3>${cards(demo.review)}<a href="#m05" class="textlink">前往可操作的審題檢核表 ↓</a>`:question(demo.questions[index]);
  bindQuiz(panel);$('#demo-prompt-title').textContent=`帶走提示詞：${demo.prompts[index].title}`;$('#demo-prompt-text').textContent=demo.prompts[index].text;
  $('#demo-copy-status').textContent='';$('#demo-copy-manual').hidden=true;$('#demo-copy-text').value='';
 }
 async function copy(text,prefix){
  const status=$(`#${prefix}-status`),manual=$(`#${prefix}-manual`);manual.hidden=true;
  try{if(!window.isSecureContext||!navigator.clipboard)throw Error('unavailable');await navigator.clipboard.writeText(text);status.textContent='已複製，請貼到記事本或外部工具檢查。';}
  catch{manual.hidden=false;const area=$(`#${prefix}-text`);area.value=text;area.focus();area.select();status.textContent='無法自動複製，已提供完整文字供手動複製。';}
 }
 function renderCompare(){
  const selected=[...document.querySelectorAll('[data-compare]:checked')].map(i=>i.dataset.compare),qs=demo.questions.filter(q=>selected.includes(q.id));
  if(!qs.length){$('#evap-comparison').innerHTML='<p>請至少勾選一種題目，才能顯示比較。</p>';return;}
  const rows=[['評量目標','goal'],['作答證據','evidence'],['推論限制','limit']];
  $('#evap-comparison').innerHTML=`<div class="table-scroll" tabindex="0" role="region" aria-label="試題比較表，可左右捲動"><table><caption>三種題目的目標、證據與限制</caption><thead><tr><th scope="col">比較面向</th>${qs.map(q=>`<th scope="col">${escape(q.title)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,key])=>`<tr><th scope="row">${label}</th>${qs.map(q=>`<td>${escape(q[key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 }
 function reviewText(){
  const target=$('#review-target').selectedOptions[0].textContent,name=$('#reviewer').value.trim()||'未填寫';
  const checks=[...document.querySelectorAll('[data-review]')];
  return ['自然科學命題審查紀錄',...(window.ScienceTaskContext?[window.ScienceTaskContext()]:[]),'本站教學檢核；非 AI 自動審查或品質認證',`審查對象：${target}`,`審查者：${name}`,`已查核：${checks.filter(c=>c.checked).length} / ${checks.length}；勾選不代表試題自動合格。`,'',...content.reviewChecklist.map((r,i)=>`${checks[i].checked?'[已查核]':'[待檢核]'} ${i+1}. ${r[0]}\n判斷重點：${r[2]}`),'',`證據與修訂建議：\n${$('#review-notes').value.trim()||'尚未填寫'}`,'','限制：示例為預寫，數據如有標示為模擬則非實測；課綱、科學正確性及適齡性仍須教師查核。'].join('\n');
 }
 function updateReview(){const n=document.querySelectorAll('[data-review]:checked').length;$('#review-count').textContent=`已查核 ${n} / 10 項；尚有 ${10-n} 項待檢核。`;$('#review-output').value=reviewText();$('#review-copy-status').textContent='';$('#review-copy-manual').hidden=true;$('#review-copy-text').value='';}
 $('#original-question').innerHTML=question(demo.questions[0]);bindQuiz($('#original-question'));
 document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>renderDemo(Number(b.dataset.demo))));
 $('#copy-demo-prompt').addEventListener('click',()=>copy(demo.prompts[active].text,'demo-copy'));
 document.querySelectorAll('[data-compare]').forEach(i=>i.addEventListener('change',renderCompare));
 $('#pitfalls').innerHTML=content.reviewChecklist.map((r,i)=>`<details><summary>${String(i+1).padStart(2,'0')}　${escape(r[1])}</summary><p>${escape(r[2])}</p></details>`).join('');
 $('#review-items').innerHTML=content.reviewChecklist.map((r,i)=>`<label class="review-item"><input type="checkbox" data-review="${i}"><span><b>${i+1}. ${escape(r[0])}</b><small>${escape(r[2])}</small></span></label>`).join('');
 $('#review-form').addEventListener('input',updateReview);$('#review-form').addEventListener('change',updateReview);
 $('#review-form').addEventListener('submit',e=>e.preventDefault());
 $('#review-form').addEventListener('reset',()=>{setTimeout(()=>{updateReview();$('#review-copy-status').textContent='已重設檢核與備註。';},0);});
 $('#export-review').addEventListener('click',()=>{updateReview();$('#review-output').focus();$('#review-output').select();$('#review-copy-status').textContent='已匯出完整審題文字至預覽框，可選取後複製留存。';});
 $('#copy-review').addEventListener('click',()=>copy(reviewText(),'review-copy'));
 renderDemo(0);renderCompare();updateReview();

 window.ScienceDemo={snapshot:()=>({active,answers:JSON.parse(JSON.stringify(answers)),compare:[...document.querySelectorAll('[data-compare]:checked')].map(c=>c.dataset.compare)}),restore:s=>{Object.keys(answers).forEach(k=>delete answers[k]);Object.assign(answers,JSON.parse(JSON.stringify(s.answers)));$('#original-question').innerHTML=question(demo.questions[0]);bindQuiz($('#original-question'));renderDemo(s.active);document.querySelectorAll('[data-compare]').forEach(c=>c.checked=s.compare.includes(c.dataset.compare));renderCompare();}};
 window.ScienceReview={snapshot:()=>({target:$('#review-target').value,reviewer:$('#reviewer').value,notes:$('#review-notes').value,checks:[...document.querySelectorAll('[data-review]')].map(c=>c.checked)}),restore:s=>{$('#review-target').value=s.target;$('#reviewer').value=s.reviewer;$('#review-notes').value=s.notes;document.querySelectorAll('[data-review]').forEach((c,i)=>c.checked=s.checks[i]);updateReview();}};
})();

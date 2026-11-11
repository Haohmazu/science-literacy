'use strict';
(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const tasks=[['閱讀好試題與課綱','m01','辨認目標、證據與推理，並到 M02 核對課綱對齊。'],['拆解蒸發示範','m04','作答原題、改寫題與新題，說出三題能力焦點的差異。'],['完成自己的藍圖','m06','用任教單元編輯至少兩列目標、能力與配分，取得提示詞。'],['同儕審題與修訂','m05','以十項檢核檢查試題，記錄證據與一項具體修訂。'],['回顧與帶回教室','m08','回答自我檢核，寫下要查證的資訊與下一次教學調整。']];
 const durations={group:[15,20,25,20,10],solo:[8,10,12,10,5]};
 function renderPlan(){const route=$('#workshop-route').value;$('#workshop-plan').innerHTML=`<ol class="workshop-plan">${tasks.map((t,i)=>`<li><span>${durations[route][i]} 分鐘</span><div><a href="#${t[1]}">${t[0]} ↗</a><p>${t[2]}${route==='group'&&i===3?'兩人交換題目獨立試答，再討論分歧。':''}</p></div></li>`).join('')}</ol>`;$('#learning-output').value='';$('#learning-status').textContent='已更新路徑；活動勾選與反思保留，可繼續完成。';}
 function progress(){const n=$$('[data-learning]:checked').length;$('#learning-progress').textContent=`已完成 ${n} / ${tasks.length} 項活動。此為自我紀錄，非研習時數認證。`;$('#learning-output').value='';}
 $('#learning-checks').innerHTML=tasks.map((t,i)=>`<label class="learning-check"><input type="checkbox" data-learning="${i}"> ${t[0]}</label>`).join('');
 $$('[data-learning]').forEach(c=>c.addEventListener('change',progress));$('#workshop-route').addEventListener('change',renderPlan);
 $$('input[name="learning-answer"]').forEach(i=>i.addEventListener('change',()=>{$('#learning-feedback').textContent='已變更答案，請重新檢查。';$('#learning-output').value='';}));
 $('#learning-reflection').addEventListener('input',()=>{$('#learning-output').value='';});
 $('#check-learning').addEventListener('click',()=>{const a=$('input[name="learning-answer"]:checked');$('#learning-feedback').textContent=!a?'請先選擇一個答案。':a.value==='1'?'答對了。資料必須參與推理，並確認條件支持結論；長題幹或課綱標籤本身不是證據。':'再想一想。題幹長度與貼代碼都不能證明學生使用資料；應要求以比較數據支持結論。';});
 $('#export-learning').addEventListener('click',()=>{$('#learning-output').value=['教師研習與自主學習紀錄',`路徑：${$('#workshop-route').selectedOptions[0].textContent}`,...tasks.map((t,i)=>`${$$('[data-learning]')[i].checked?'[已完成]':'[待完成]'} ${t[0]}`),`自我檢核：${$('#learning-feedback').textContent||'尚未檢查'}`,`反思：${$('#learning-reflection').value.trim()||'尚未填寫'}`,'此為自我學習紀錄，非研習時數或證書。'].join('\n');$('#learning-output').focus();$('#learning-output').select();$('#learning-status').textContent='已匯出文字，請選取後按 Ctrl+C，手機可長按複製。';});
 $('#reset-learning').addEventListener('click',()=>{$$('[data-learning],input[name="learning-answer"]').forEach(c=>c.checked=false);$('#learning-reflection').value='';$('#learning-feedback').textContent='';$('#learning-output').value='';progress();$('#learning-status').textContent='已重設本頁學習紀錄，保留目前路徑。';});
 renderPlan();progress();
})();

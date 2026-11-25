/* Prompt-by-target cells. Never average channels or use their shared round number. */
window.VIEWS.prompts = function () {
  const wc=D.wordCounts;
  return `<div class="section-head"><h2>测量词库</h2><span class="sub">${D.promptTotal} 条词 · 按平台与访问通道分别记录</span></div>
    <div class="grid g3" style="margin-bottom:18px">${kpi('正式词库',num(D.promptTotal),'候选词不进入测量分母')}${kpi('门店可答',num(wc.store_answerable),'M1 分母来源')}${kpi('核验与知识',num(wc.verification+wc.knowledge),'D1 分母来源')}</div>
    ${card('词条 × 通道',`<div class="filters"><input aria-label="搜索词句" type="search" id="q" placeholder="搜索词句 / 项目 / 意图"><select aria-label="分母层" id="layer"><option value="">全部分母层</option>${Object.entries(wc).map(([k,v])=>`<option value="${k}">${esc(D.prompts.find(p=>p.denom===k)?.denomLabel||k)}（${v}）</option>`).join('')}</select><select aria-label="优先级" id="prio"><option value="">全部优先级</option><option>P0</option><option>P1</option><option>P2</option></select><select aria-label="观测通道" id="prompt-channel"><option value="">全部通道 · 分行展示</option>${D.platforms.map(p=>`<option value="${esc(p.key)}">${esc(p.label)}</option>`).join('')}</select><span class="count" id="count"></span></div><div class="table-wrap"><table><thead><tr><th>词句</th><th>分母层 / 意图</th><th>独立通道</th><th>有效观测</th><th>出现</th><th>样本出现率</th><th>重复轮次</th></tr></thead><tbody id="tbody"></tbody></table></div>`,'少于 3 轮标为不足轮次；不把网页一轮叫作漂移，也不把跨平台命中当稳定')}`;
};
window.VIEW_MOUNTS.prompts = function () {
  const els=['q','layer','prio','prompt-channel'].map(id=>document.getElementById(id));
  function draw(){
    const [q,layer,prio,target]=els;
    const rows=D.prompts.filter(p=>(!layer.value||p.denom===layer.value)&&(!prio.value||p.priority===prio.value)&&(!q.value.trim()||(p.text+p.project+p.intentLabel).includes(q.value.trim())));
    const ps=D.platforms.filter(p=>!target.value||p.key===target.value);
    document.getElementById('tbody').innerHTML=rows.flatMap(p=>ps.map(t=>{const s=p.channels[t.key]||{n:0,hit:0,rate:null,rounds:0,stable:null};return `<tr><td>${esc(p.text)}</td><td>${esc(p.denomLabel)} · ${esc(p.intentLabel)}</td><td>${esc(t.label)}</td><td>${s.n}</td><td>${s.hit}</td><td>${pct(s.rate)}${s.n&&s.n<20?' · 轶事':''}</td><td>${s.rounds} 轮 · ${s.stable===null?'不足 3 轮':s.stable?'多数轮出现':'未达多数轮'}</td></tr>`;})).join('')||'<tr><td colspan="7">没有匹配的词条</td></tr>';
    document.getElementById('count').textContent=`${rows.length} 条词 · ${ps.length} 个独立通道`;
  }
  els.forEach(el=>el.addEventListener('input',draw));draw();
};

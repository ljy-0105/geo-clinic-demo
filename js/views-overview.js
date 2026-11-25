/* Independent channels are peers; never promote by observation volume. */
window.VIEWS.overview = function () {
  const pending=D.facts.filter(f=>f.status!=="arbitrated"), cov=D.m2Coverage, k=D.kpi;
  return `<div class="section-head"><h2>效果总览</h2><span class="sub">历史基线 · ${D.platforms.length} 个独立通道 · ${num(D.obsTotal)} 次记录</span></div>
    <p class="note" style="margin-bottom:16px">消费网页与 API 分别展示，以下通道并列，不合并排名、不按样本量指定主指标。</p>
    <div class="grid g3" style="margin-bottom:20px">${D.platforms.map(p=>kpi(`${esc(p.label)} · 样本 M1`,p.total?pct(p.rate):'—',`${p.hit}/${p.total} 次有效回答 · ${p.rounds} 轮<br>95% 区间 ${p.total?pct(p.ciLow)+'–'+pct(p.ciHigh):'—'} · deff ${fixed(p.deff)}${p.lowN?' · 暂作轶事':''}`)).join('')}</div>
    <div class="grid g3" style="margin-bottom:20px">${kpi('M2 事实观测覆盖',`${cov.nItems}/8<small> 项可评</small>`,`${cov.arbitrated}/8 项已裁定；样本与逐项结果见下表`)}${kpi('M3 红线事件',num(k.m3.total),k.m3.total?`自源 ${k.m3.selfOpen} 未关闭；他源 ${k.m3.otherTotal}`:'本窗口无红线事件记录')}${kpi('D1 资质引用',D.platforms.some(p=>p.d1.n)?'按通道查看':'—',D.platforms.some(p=>p.d1.n)?D.platforms.map(p=>`${esc(p.label)} ${p.d1.n?pct(p.d1.rate):'—'}`).join('<br>'):'本词集无核验/知识层有效观测')}</div>
    ${pending.length?`<div class="banner"><span class="dot"></span><div>${pending.length} 项未裁定：${esc(pending.map(f=>f.label).join('、'))}。未裁定事实不作为准确率真值。</div></div>`:''}
    ${card('M2 逐通道样本与规则比对',m2Evidence(),'没有跨平台或全八项总体准确率')}
    <section class="grid g3" style="margin-top:20px">${D.platforms.map(p=>card(esc(p.label),`<p>${esc(channelConclusion(p))}</p><div class="kv"><span class="k">名单出现率 p</span><span class="v">${pct(p.ceiling.p)}（${p.ceiling.listN}/${p.ceiling.n}）</span></div><div class="kv"><span class="k">条件出现率 q</span><span class="v">${pct(p.ceiling.q)}</span></div><div class="kv"><span class="k">名单平均长度 L</span><span class="v">${fixed(p.ceiling.L)}</span></div><p class="note">${p.rounds<3?'不足 3 轮，不能评价词级重复出现。':'词级重复出现仅描述本次采样，不证明稳定推荐。'}</p>`)).join('')}</section>
    ${card('同词集逐通道对照',`<div class="table-wrap"><table><thead><tr><th>提问</th>${D.platforms.map(p=>`<th>${esc(p.label)}</th>`).join('')}</tr></thead><tbody>${D.commonPrompts.map(r=>`<tr><td>${esc(r.text)}</td>${D.platforms.map(p=>`<td>${r[p.key]?.n?`${r[p.key].hit}/${r[p.key].n}`:'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,'分子为命中回答，分母为该词在该通道的有效回答')}
    <p class="note" style="margin-top:20px">${esc(D.meta.dataNote)}</p>`;
};

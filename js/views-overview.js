/* Independent channels are peers; never promote by observation volume. */
function overviewDetails() {
  const pending=D.facts.filter(f=>f.status!=="arbitrated"), cov=D.m2Coverage, k=D.kpi;
  return `<div class="section-head"><h2>数据依据</h2><span class="sub">历史基线 · ${D.platforms.length} 个独立通道 · ${num(D.obsTotal)} 次记录</span></div>
    <p class="note" style="margin-bottom:16px">消费网页与 API 分别展示，以下通道并列，不合并排名、不按样本量指定主指标。</p>
    <div class="grid g3" style="margin-bottom:20px">${D.platforms.map(p=>kpi(`${esc(p.label)} · 样本 M1`,p.total?pct(p.rate):'—',`${p.hit}/${p.total} 次有效回答 · ${p.rounds} 轮<br>95% 区间 ${p.total?pct(p.ciLow)+'–'+pct(p.ciHigh):'—'} · deff ${fixed(p.deff)}${p.lowN?' · 暂作轶事':''}`)).join('')}</div>
    <div class="grid g3" style="margin-bottom:20px">${kpi('M2 事实观测覆盖',`${cov.nItems}/8<small> 项可评</small>`,`${cov.arbitrated}/8 项已裁定；样本与逐项结果见下表`)}${kpi('M3 红线事件',num(k.m3.total),k.m3.total?`自源 ${k.m3.selfOpen} 未关闭；他源 ${k.m3.otherTotal}`:'本窗口无红线事件记录')}${kpi('D1 资质引用',D.platforms.some(p=>p.d1.n)?'按通道查看':'—',D.platforms.some(p=>p.d1.n)?D.platforms.map(p=>`${esc(p.label)} ${p.d1.n?pct(p.d1.rate):'—'}`).join('<br>'):'本词集无核验/知识层有效观测')}</div>
    ${pending.length?`<div class="banner"><span class="dot"></span><div>${pending.length} 项未裁定：${esc(pending.map(f=>f.label).join('、'))}。未裁定事实不作为准确率真值。</div></div>`:''}
    ${card('M2 逐通道样本与规则比对',m2Evidence(),'没有跨平台或全八项总体准确率')}
    <section class="grid g3" style="margin-top:20px">${D.platforms.map(p=>card(esc(p.label),`<p>${esc(channelConclusion(p))}</p><div class="kv"><span class="k">名单出现率 p</span><span class="v">${pct(p.ceiling.p)}（${p.ceiling.listN}/${p.ceiling.n}）</span></div><div class="kv"><span class="k">条件出现率 q</span><span class="v">${pct(p.ceiling.q)}</span></div><div class="kv"><span class="k">名单平均长度 L</span><span class="v">${fixed(p.ceiling.L)}</span></div><p class="note">${p.rounds<3?'不足 3 轮，不能评价词级重复出现。':'词级重复出现仅描述本次采样，不证明稳定推荐。'}</p>`)).join('')}</section>
    ${card('同词集逐通道对照',`<div class="table-wrap"><table><thead><tr><th>提问</th>${D.platforms.map(p=>`<th>${esc(p.label)}</th>`).join('')}</tr></thead><tbody>${D.commonPrompts.map(r=>`<tr><td>${esc(r.text)}</td>${D.platforms.map(p=>`<td>${r[p.key]?.n?`${r[p.key].hit}/${r[p.key].n}`:'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,'分子为命中回答，分母为该词在该通道的有效回答')}
    <p class="note" style="margin-top:20px">${esc(D.meta.dataNote)}</p>`;
};

/* Business reading order: finding, channel difference, action, then evidence. */
(() => {
  let generation = 0;
  window.VIEWS.overview = () => {
    const pending = D.facts.filter(f => f.status !== "arbitrated");
    const observed = D.platforms.filter(p => p.total > 0);
    const found = observed.some(p => p.hit > 0);
    const conclusion = !observed.length ? "先取得回答，再判断机构有没有被看见。" : found ? "AI 已经提到这家机构，但不同渠道的表现有差异。" : "这组回答里，还没有观察到本店被提到。";
    return `<section class="brief" aria-label="机构诊断概览">
      <header class="brief-hero"><div><span class="brief-eyebrow">机构诊断 · 先看结果</span><h1>AI 会提到这家机构吗？</h1><p class="brief-conclusion">${esc(conclusion)}</p><p class="brief-store">${esc(D.store.display_name)} · 已有历史样本</p><div class="brief-actions"><button class="brief-button primary" data-go="siteaudit">体验一次官网诊断 ${uiIcon('arrow-up-right')}</button><a class="brief-button" href="#brief-difference">看整改前后有什么变化 ↓</a></div></div><aside><span>这份诊断帮你看清</span><strong>有没有被看见<br>信息哪里要补<br>改完有什么变化</strong></aside></header>
      <section class="brief-section"><div class="brief-heading"><div><span class="brief-step">01 / 发现差异</span><h2>同一家机构，看看各渠道怎么回答。</h2></div><button class="brief-text-button" data-go="collect">查看采集记录 ${uiIcon('arrow-right')}</button></div>
      <div class="brief-channels">${D.platforms.map(p => `<article class="brief-channel"><div class="brief-channel-top"><h3>${esc(p.label.split(' · ')[0])}</h3><span>${p.endpoint === 'api' ? 'API 接口' : '消费网页端'}</span></div><p class="brief-answer">${p.total ? `问了 ${num(p.total)} 次，<br><strong>${p.hit ? `提到本店 ${num(p.hit)} 次` : '暂未提到本店'}</strong>` : '<strong>尚无有效回答</strong>'}</p><div class="brief-meter" aria-hidden="true"><i style="width:${p.total ? Math.min(100,Math.max(0,p.hit/p.total*100)) : 0}%"></i></div><p class="brief-channel-foot">${p.total ? `${p.rounds} 轮历史样本 · ${p.hit}/${p.total}` : '等待采集后再判断'}</p></article>`).join('')}</div>
      <p class="brief-caption">这是本次样本中的差异。网页端与 API 分开记录，不能用它们直接证明哪个模型更好。</p></section>
      <section class="brief-action-card"><div class="brief-action-icon">${uiIcon('scan-search')}</div><div><span>接下来做什么</span><h2>${pending.length ? `先确认 ${pending.length} 项机构资料，再按同一组问题复测。` : '资料确认后，按同一组问题持续复测。'}</h2><p>${pending.length ? esc(pending.map(f => f.label).join('、')) + '尚待确认。' : '保存每次回答与来源，持续观察变化。'}工具把要核对、要整改的事项列出来，方便业务人员继续跟进。</p></div><button class="brief-button" data-go="store">查看待确认资料 ${uiIcon('arrow-right')}</button></section>
      <section class="brief-section" id="brief-difference"><div class="brief-heading"><div><span class="brief-step">02 / 看见变化</span><h2>网页改了什么，修复前后放在一起看。</h2></div><span class="brief-sample-tag">虚构页面修复演示</span></div><p class="brief-caption">下面用同一个示例门店，实际检查问题页面和修复页面。展示页面信息的变化，尚无真实机构的 AI 推荐提升对照。</p><div id="brief-comparison" role="status" aria-live="polite"><p class="brief-loading">正在检查两份示例页面…</p></div><div class="brief-comparison-actions"><button class="brief-text-button" id="brief-rerun" disabled>重新运行修复对比 ${uiIcon('refresh-cw')}</button><button class="brief-button" data-go="siteaudit">进入诊断与整改 ${uiIcon('arrow-right')}</button></div></section>
      <section class="brief-bottom"><div><span class="brief-step">03 / 推进业务</span><h2>把一次诊断，接上后续整改。</h2><p>查看差异 → 确认问题 → 安排整改 → 复检留档。下一步用一家授权机构，与现有外部报告逐项对照，确认覆盖和成本。</p></div><button class="brief-button" data-go="workbench">打开运营工作台 ${uiIcon('arrow-right')}</button></section>
      <details class="brief-details"><summary>查看数据来源、样本范围与专业指标 ${uiIcon('chevron-right')}</summary><p class="brief-caption">${esc(D.meta.dataNote)} ${window.GEO_DEPLOYMENT?.mode === 'static' ? '本在线站点的每日采集尚未连接本机后台，草稿与整改仅保存在当前浏览器。' : ''}</p>${overviewDetails()}</details>
    </section>`;
  };
  window.VIEW_UNMOUNTS.overview = () => { generation++; };
  window.VIEW_MOUNTS.overview = () => {
    const ticket = ++generation;
    const button = document.getElementById('brief-rerun');
    async function compare() {
      button.disabled = true;
      const root = document.getElementById('brief-comparison');
      try {
        const fixture = window.SiteAuditExamples, engine = window.SiteAuditEngine;
        if (!fixture || !engine) throw new Error('校验组件未加载，请刷新后重试。');
        const options = {store: fixture.store, facts: fixture.facts, url: fixture.url, mode: 'sample', sourceLabel: '虚构页面修复演示'};
        const before = await engine.inspect({...options, html: fixture.before});
        const after = await engine.inspect({...options, html: fixture.after});
        if (ticket !== generation || !root.isConnected) return;
        const diff = engine.compare(after, before);
        const fixed = diff?.resolved || [];
        root.innerHTML = `<div class="brief-compare-pair"><article class="brief-before"><span>修复前 / 问题页面</span><strong>${before.summary.issues}<small>项需处理</small></strong><p>标题、页面描述、索引指令或联系方式等存在问题。</p></article><div class="brief-compare-arrow" aria-hidden="true">→</div><article class="brief-after"><span>修复后 / 同页复检</span><strong>${after.summary.issues}<small>项需处理</small></strong><p>${fixed.length} 项原有问题本次通过；仍有 ${after.summary.notChecked} 项未检查。</p></article></div><p class="brief-comparison-result">${fixed.length ? `变化看得见：${fixed.length} 项问题，从发现到修复都能回查。` : '本次没有可确认的已修复项目，请查看检查证据。'}</p><details class="brief-changes"><summary>展开逐项变化与检查证据</summary><div class="table-wrap"><table><thead><tr><th>检查什么</th><th>修复前</th><th>修复后</th></tr></thead><tbody>${fixed.map(id => {const old=before.checks.find(c=>c.id===id), now=after.checks.find(c=>c.id===id);return `<tr><td>${esc(now.title)}</td><td>${esc(old.evidence)}</td><td><span class="tag ok">本次通过</span><br>${esc(now.evidence)}</td></tr>`;}).join('') || '<tr><td colspan="3">暂无已确认修复的项目</td></tr>'}</tbody></table></div><p class="brief-caption">来源：虚构示例页面；规则 ${esc(after.ruleVersion)}。这是局部页面检查，不代表 AI 推荐率、医疗质量或完整合规审查。</p></details>`;
      } catch (error) {
        if (ticket === generation && root.isConnected) root.textContent = `本次未完成校验：${error.message}。没有生成修复结论。`;
      } finally { if (ticket === generation) button.disabled = false; }
    }
    button.addEventListener('click', compare);
    compare();
  };
})();

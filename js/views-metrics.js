/* Definitions always name the channel; empty conditional denominators stay unavailable. */
window.VIEWS.metrics=function(){
 const p=D.platforms.find(p=>p.key===D.meta.primary), k=D.kpi,c=p.ceiling;
 return `<div class="section-head"><h2>指标口径</h2><span class="sub">详情参考通道：${esc(p.label)}；总览与报告按全部通道并列</span></div>
 ${card('M1：按回答去重',`<div class="formula">出现本店的有效回答数 ÷ 门店可答层全部有效回答数</div><p class="note">拒答与只给方法仍在分母。失败、空答不计有效回答。每个平台 × 访问方式分别计算，不用网页回答替代 API。</p><div class="kv"><span>当前详情通道</span><b>${esc(p.label)}</b></div><div class="kv"><span>样本 M1</span><b>${pct(p.rate)}（${p.hit}/${p.total}）</b></div><div class="kv"><span>95% 描述区间</span><b>${p.total?pct(p.ciLow)+'–'+pct(p.ciHigh):'—'} · deff ${fixed(p.deff)}</b></div><p class="note">重复采样使用保守设计效应下限 2，单轮使用 1；这是区间假设，不是独立性或稳定性证明。</p>`)}
 ${card('名单与出现是两个问题',`<div class="kv"><span>名单出现率 p</span><b>${pct(c.p)}（${c.listN}/${c.n}）</b></div><div class="kv"><span>名单中本店出现率 q</span><b>${pct(c.q)}（${c.selfListN}/${c.listN}）</b></div><div class="kv"><span>名单平均长度 L</span><b>${fixed(c.L)}</b></div><p>${esc(channelConclusion(p))}</p><p class="note">p 为零时，M1 在有效回答分母上仍可为零；q 的条件分母为空，不能计算。M1 也可来自正文提及，因此不普遍等于 p×q。均分情景不构成排名或优化目标承诺。</p>`)}
 ${card('M2：裁定、观测与规则判定分别记录',m2Evidence(),'按通道、按事实项披露')}
 ${card('M3 与 D1',`<p>红线事件只描述已记录事件；无事件不证明完成合规审核。他源事件总数与已响应数分别计算。</p><p>D1 仅用核验/知识层有效观测，每个通道单独算；n=0 显示 —，不能报 0%。</p><p>样本量小于 20 标为轶事；少于 3 轮的词不能判多数轮出现，更不能证明稳定推荐。</p>`)}
 <p class="note">规则版本 ${esc(D.meta.metricsVersion)} · ${esc(D.meta.channelNote)}</p>`;
};

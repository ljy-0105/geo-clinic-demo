/* 合规事件 + 报告 */
window.VIEWS.incidents = function () {
  const k = D.kpi.m3;
  const types = new Set(D.incidents.map((i) => i.typeLabel)).size;
  const NOW = new Date("2026-11-25T10:00:00");
  const hours = (t) => Math.round((new Date(t) - NOW) / 36e5);

  const cardOf = (i) => {
    const h = hours(i.dueAt);
    const late = h <= 0;
    const sla = i.severity === "P0"
      ? (i.source === "self" ? "P0 24h 复核 / 48h 改完" : "P0 48h 内响应")
      : "P1 72h 内响应";
    return `<div class="inc ${i.severity === "P0" ? "p0" : "p1"}">
      <div class="i-head">
        <span class="i-title">${esc(i.typeLabel)}</span>
        <span class="tag ${i.source === "self" ? "self" : "warn"}">${SOURCE_LABEL[i.source]}</span>
        <span class="tag ghost">${esc(i.severity)}</span>
        <span class="tag ${i.status === "open" ? "danger" : "ok"}">${INC_STATUS[i.status] || i.status}</span>
      </div>
      <div class="i-body">${esc(i.evidence)}</div>
      <div class="i-exp">应为：${esc(i.expected)}</div>
      <div class="i-foot">
        <span class="note">${sla} · 截止 ${esc((i.dueAt || "").slice(5, 16).replace("T", " "))}</span>
        <span class="tag ${late ? "danger" : "ghost"}">${late ? `超期 ${Math.abs(h)}h` : `剩余 ${h}h`}</span>
      </div></div>`;
  };

  const self = D.incidents.filter((i) => i.source === "self");
  const other = D.incidents.filter((i) => i.source === "other");

  return `
  <div class="section-head"><h2>合规事件</h2>
    <span class="sub">自源可清零 · 他源只承诺响应，不承诺清零</span></div>

  <div class="grid g4" style="margin-bottom:16px">
    ${kpi("自源事件（可清零）", num(k.selfOpen), "本店自有发布物导致，能改就改完", "danger")}
    ${kpi("他源事件（不清零）", num(k.otherTotal), `48h 确认+说明+申诉 · 响应率 ${pct(k.otherResp, 0)}`, "warn")}
    ${kpi("红线类型数", num(types), "超科目 / 过期证 / 效果承诺")}
    ${kpi("平均响应时效", "—", "尚未记录可计算的响应时间；48h 是目标而非实测")}
  </div>

  <div class="grid g2">
    ${card("自源 · 48h 内可清零", self.map(cardOf).join("") ||
      '<p class="note">无自源事件</p>', "责任在门店，能自己改完")}
    ${card("他源 · 承诺响应不承诺清零", other.map(cardOf).join("") ||
      '<p class="note">无他源事件</p>', "AI 生成 / 平台归类 / 第三方")}
  </div>

  <div style="margin-top:16px">${card("为什么必须拆开", `
    <ul class="list">
      <li><b>自源</b>：可追溯到本店自有发布物 —— 过期证号、错地址、旧电话。这类<b>清零</b>写进合同。</li>
      <li><b>他源</b>：AI 自己编的、平台归类的、第三方转载的。修复权不在任何一方手上，写进合同就是给未来埋争议。</li>
      <li>判据：能不能追溯到门店页面 → 能则记自源，不能则记他源；两可时按<b>他源</b>记，宁松不严。</li>
      <li>他源事件仍要 48h 确认、给事实说明、提申诉，响应率 100% —— 但不清零、不担责。</li>
    </ul>`)}</div>`;
};

window.VIEWS.report = function () {
  const k = D.kpi, s = D.store;
  const pending = D.facts.filter(f => f.status !== "arbitrated");
  const cov = D.m2Coverage;
  const unobserved = D.facts.filter(f => f.status === "arbitrated" && !D.platforms.some(p => p.m2.some(v => v.key === f.key && v.status === "ok")));
  return `<div class="section-head"><h2>报告</h2><span class="sub">观测基线 · 证据与样本限制随报告展示</span></div><div class="report">
    <h1>门店 GEO 观测基线报告</h1><div class="r-meta">${esc(s.display_name)} · ${esc(s.city)}${esc(s.district)} · ${num(D.obsTotal)} 次记录 · ${D.platforms.length} 个独立通道</div>
    <h2>一、结论摘要</h2><p>三个通道分别呈现消费网页与 API 回答。观测次数、轮次和模型环境不同，不合成一个可发现率，不按样本量选取对外主指标。以下为历史窗口样本，不代表今日自动采集已完成。</p>
    ${D.platforms.map(p => `<h2>${esc(p.label)} · 样本 M1</h2><p><b>${p.total ? pct(p.rate) : '—'}</b>（${p.hit}/${p.total}；95% 区间 ${p.total ? pct(p.ciLow)+'–'+pct(p.ciHigh) : '—'}；deff=${fixed(p.deff)}；${p.rounds} 轮${p.lowN ? '；n&lt;20，暂作轶事' : ''}）。${esc(channelConclusion(p))}</p><p>名单出现率 p=${pct(p.ceiling.p)}；名单平均长度 L=${fixed(p.ceiling.L)}；条件出现率 q=${pct(p.ceiling.q)}。${p.ceiling.ratio == null ? '均分比较无有效分母，未计算倍数。' : `条件份额与均分情景的比值 ${fixed(p.ceiling.ratio)}，仅作描述，不作为稳定性结论。`}</p>`).join('')}
    <h2>二、M2 事实观测覆盖</h2><p><b>${cov.nItems}/8 项可评</b>，${cov.arbitrated}/8 项已裁定。各通道的参与回答 n 与逐项结果如下；没有展示全八项总体准确率。</p>${m2Evidence()}
    <p>未裁定项 ${pending.length} 个：${esc(pending.map(f=>f.label).join('、') || '无')}。已裁定但未观测/未形成可评结果 ${unobserved.length} 个：${esc(unobserved.map(f=>f.label).join('、') || '无')}。</p>
    <h2>三、D1 资质引用</h2>${D.platforms.map(p => `<p>${esc(p.label)}：${p.d1.n ? `${pct(p.d1.rate)}（${p.d1.hit}/${p.d1.n}）` : '—（无核验/知识层有效观测，0/0 不计算引用率）'}。</p>`).join('')}
    <h2>四、M3 红线事件</h2><p>${D.incidents.length ? D.incidents.map(i=>`${esc(i.typeLabel)}（${esc(SOURCE_LABEL[i.source])}/${esc(i.severity)}，${esc(INC_STATUS[i.status] || i.status)}）`).join('；')+'。' : '本窗口无红线事件记录。未记录事件不等于已完成全部合规审查。'}</p>${k.m3.otherTotal ? `<p>他源事件 ${k.m3.otherTotal} 条，已响应 ${k.m3.otherResponded} 条，响应率 ${pct(k.m3.otherResp)}。</p>` : ''}
    <h2>五、后续验证</h2><p>先补齐未裁定事实、核验原始回答与时间来源；连接网页账号并进行每家一题试采后，按相同词集、单通道增加轮次。尚无充分依据时，不承诺稳定排名、推荐概率或整改效果。</p>
    <p class="note" style="margin-top:24px">${esc(D.meta.dataNote)} 历史提问时间未核验，旧库时间仅作为原记录保留。生成时间 ${esc(D.meta.generatedAt)}；规则 ${esc(D.meta.metricsVersion)}。</p></div>`;
};

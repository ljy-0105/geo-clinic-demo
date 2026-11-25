/* Stakeholder preview: use the exported snapshot as-is; never synthesize metrics. */
(() => {
  "use strict";
  const root = document.getElementById("demo-results"), data = window.GEO_DATA;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const pct = n => n == null ? "—" : (100 * n).toFixed(1) + "%";
  if (!data?.platforms || !data.store) {
    root.textContent = "未能读取随包样本，请保留 data.js 并从解压后的文件夹打开 demo.html。";
    return;
  }
  const pending = data.facts.filter(f => f.status !== "arbitrated");
  const cov = data.m2Coverage;
  root.innerHTML = `<div class="demo-store"><div><h3>${esc(data.store.display_name)}</h3><p>${esc(data.store.city)} · ${esc(data.store.district)} · ${data.promptTotal} 条测量词</p></div><span>${data.obsTotal} 次历史记录 / ${data.platforms.length} 条独立通道</span></div>
    <div class="demo-channel-grid">${data.platforms.map(p => `<article><div><h3>${esc(p.label)}</h3><span>${p.rounds} 轮 · ${p.total} 次有效回答</span></div><p class="demo-number">${p.total ? pct(p.rate) : "—"}</p><p>样本中提及本店的回答占比</p><small>${p.hit}/${p.total} · 95% 区间 ${p.total ? pct(p.ciLow) + "–" + pct(p.ciHigh) : "—"}</small></article>`).join("")}</div>
    <div class="demo-findings"><article><span>信息覆盖</span><h3>${cov.nItems}/8 项可评</h3><p>${cov.arbitrated}/8 项事实已确认；其余项目分别标记未裁定、未观测，保留判断边界。</p></article><article><span>当前可执行动作</span><h3>先补齐 ${pending.length} 项事实</h3><p>${esc(pending.map(f=>f.label).join("、") || "当前裁定已齐全，进一步补充同词集复测")}。</p></article><article><span>下一步验证</span><h3>区分渠道，增加轮次</h3><p>网页样本仅一轮，可说明本次回答的差异；后续按相同词集复测，积累连续记录。</p></article></div>
    <p class="demo-evidence-note">本次示例展示 AI 观测与事实覆盖，不构成机构医疗质量评分、全网负面排查或关键词搜索热度结论。原始报告中保留通道、样本数和未核验时间说明。</p>`;
})();

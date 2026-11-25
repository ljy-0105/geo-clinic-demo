/* 采集观测 */
window.VIEWS.collect = function () {
  const P = D.platforms;
  const cols = [["mention", "提及"], ["no_mention", "未提及"], ["method_only", "只给方法"], ["refusal", "拒答"]];
  const maxCell = Math.max(...P.map((p) => Math.max(...cols.map(([k]) => p.forms[k]))), 1);

  const matrix = `<div class="table-wrap"><table>
    <thead><tr><th>通道</th>${cols.map(([, l]) => `<th class="num">${l}</th>`).join("")}
      <th class="num">合计</th><th class="num">拒答率</th><th>水位</th></tr></thead>
    <tbody>${P.map((p) => {
      const r = p.refusal, over = r > 0.3;
      return `<tr><td>${esc(p.label)} <span class="tag ghost">${p.endpoint}</span></td>
      ${cols.map(([k]) => {
        const v = p.forms[k], a = 0.03 + 0.16 * (v / maxCell);
        return `<td class="num" style="background:rgba(13,122,111,${a.toFixed(2)})">${v}</td>`;
      }).join("")}
      <td class="num"><b>${p.forms.total}</b></td>
      <td class="num" style="color:${over ? "#a8322b" : "inherit"}">${pct(r)}</td>
      <td>${over ? '<span class="tag danger">超水位</span>' : '<span class="tag ok">正常</span>'}</td></tr>`;
    }).join("")}</tbody></table></div>`;

  const waterline = `<div class="bars">${P.map((p) => `<div class="bar-row" style="grid-template-columns:96px 1fr 92px">
    <span class="name">${esc(p.label)}</span>
    <div class="bar-track" style="height:9px">
      <div class="bar-fill" style="width:${Math.min(100, (p.refusal / 0.3) * 100).toFixed(1)}%;
        background:${p.refusal > 0.3 ? "linear-gradient(90deg,#d98d86,#a8322b)" : "linear-gradient(90deg,#14b8a6,#0d7a6f)"}"></div>
    </div><span class="val">${pct(p.refusal)}</span></div>`).join("")}</div>
    <p class="note" style="margin-top:10px">满格 = 30% 安全水位。超过即告警并暂停该平台的目标承诺：
    拒答仍计入有效分母，不能通过排除拒答抬高 M1。</p>`;

  const recent = `<div class="table-wrap"><table>
    <thead><tr><th>提问时间 / 记录依据</th><th>通道</th><th>轮次</th><th>词句</th><th>形态</th><th>引用本店</th></tr></thead>
    <tbody>${D.recent.map((r) => `<tr>
      <td style="white-space:nowrap;color:#68758a">${r.askedAt ? esc(r.askedAt) : "— · 未核验"}<small style="display:block;white-space:normal">${r.recordedAt ? "入库 "+esc(r.recordedAt) : "原记录 "+esc(r.legacyAt || "未记录")+"（未核验）"}</small></td>
      <td>${esc(r.platform)} · ${esc(r.endpoint)}</td><td class="num">${r.round}</td>
      <td style="max-width:340px">${esc(r.text)}</td>
      <td><span class="tag ${r.form === "mention" ? "ok" : r.form === "refusal" ? "danger" : "ghost"}">${esc(r.formLabel)}</span></td>
      <td>${r.citation ? '<span class="tag ok">有</span>' : '<span class="tag ghost">无</span>'}</td>
    </tr>`).join("")}</tbody></table></div>`;

  return `
  <section class="collect-page"><div class="section-head"><h2>采集观测</h2>
    <span class="sub">${D.platforms.map((p) => `${p.label} ${p.rounds} 轮`).join(" · ")} · ${num(D.obsTotal)} 次观测</span></div>

  <div class="grid g2" style="margin-bottom:16px">
    ${card("形态矩阵", matrix, "单元格深浅 = 次数")}
    ${card("拒答率与安全水位", waterline, "超过 30% 即告警")}
  </div>

  ${card("观测流水（最近 40 条）", recent,
    "一行 = 一次提问；形态四分类，不把「没点名」当「拒答」")}

  <p class="note" style="margin-top:16px;padding:12px 14px;background:#fff;border:1px solid var(--line);
    border-radius:10px">采集口径：每词每通道至少 3 轮，同一词重复提问才有稳定性可言。
    主样本走 API 便于批量复盘，但引用源与用户端差异很大；网页端单独采一组做对照，
    两边的次数和轮次都写在表格里，不混算。历史旧库时间未核验，不能称真实提问时间。</p></section>`;
};

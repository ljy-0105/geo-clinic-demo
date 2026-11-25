/* 门店建档 */
window.VIEWS.store = function () {
  const s = D.store;
  const F = [
    ["机构第一名称", s.license_name], ["品牌名", s.brand_name], ["对外展示名", s.display_name],
    ["别名", s.alias_names], ["城市", s.city], ["区/镇街", s.district], ["商圈地标", s.landmark],
    ["标准地址", s.address], ["经纬度", `${s.lng} / ${s.lat}`], ["坐标系", s.coord_system],
    ["联系电话", s.phone], ["营业时间", s.open_hours], ["机构类别", s.org_type],
    ["经营状态", s.business_status], ["许可证号", s.license_no], ["许可证有效期", s.license_expiry],
    ["核准科目", s.subjects], ["科目代码", s.subject_codes], ["可开展项目", s.services],
    ["预约方式", s.booking_entry], ["POI 映射", s.poi_ids],
  ];
  const fieldHtml = `<div class="fact-grid">${F.map(([k, v]) => `<div class="fact">
      <div class="f-head"><span class="f-key">${esc(k)}</span></div>
      <div class="f-val">${esc(v || "—")}</div></div>`).join("")}</div>`;

  const factHtml = `<div class="fact-grid">${D.facts.map((f) => {
    const cls = f.status === "arbitrated" ? "ok" : "warn";
    return `<div class="fact">
      <div class="f-head"><span class="f-key">${esc(f.label)}</span>
        <span class="tag ${cls}">${STATUS_LABEL[f.status] || f.status}</span></div>
      <div class="f-val">${esc(f.expected || "—")}</div>
      ${f.by ? `<div class="f-key" style="margin-top:6px">签字：${esc(f.by)} · ${esc((f.at || "").slice(0, 10))}</div>` : ""}
    </div>`;
  }).join("")}</div>`;

  const judged = D.facts.filter((f) => f.status === "arbitrated").length;

  return `
  <div class="section-head"><h2>门店建档</h2>
    <span class="sub">26 列实体卡 · 八项核心信息决定 M2 分母</span></div>

  <div class="grid g2">
    ${card("实体卡字段", fieldHtml, "地址/电话/账号口径以此为准")}
    ${card("八项核心信息的裁定状态",
      `<div class="kv"><span class="k">已裁定项</span><span class="v">${judged}/${D.facts.length}</span></div>
       <div class="kv"><span class="k">未裁定项</span><span class="v" style="color:#a8620a">${D.facts.length - judged}</span></div>
       <div class="divider"></div>
       ${factHtml}
       <p class="note" style="margin-top:12px">未裁定 = 客户没有书面确认标准值。此时 M2 该项不进分母 ——
       不签字就没法出准确率，这也是第一周必须把裁定单签掉的原因。</p>
       <div class="divider"></div>
       <p class="note" style="margin-bottom:8px">扩展四项：不进核心八项，但决定「被说对」之后能不能承接</p>
       <div class="fact-grid">
         <div class="fact"><div class="f-head"><span class="f-key">品牌名</span><span class="tag ok">已登记</span></div>
           <div class="f-val">${esc(s.brand_name)}</div></div>
         <div class="fact"><div class="f-head"><span class="f-key">医疗广告审查证明</span><span class="tag warn">未登记</span></div>
           <div class="f-val">—</div></div>
         <div class="fact"><div class="f-head"><span class="f-key">坐诊医师</span><span class="tag warn">未登记</span></div>
           <div class="f-val">—</div></div>
         <div class="fact"><div class="f-head"><span class="f-key">可开展项目</span><span class="tag ok">已登记</span></div>
           <div class="f-val">${esc(s.services)}</div></div>
       </div>`,
      "谁签字、哪天签，都要留痕")}
  </div>

  <div style="margin-top:16px">${card("数据来源与更新规则", `
    <ul class="list">
      <li>实体卡字段来自许可证、备案凭证与门店自述；两个来源冲突时以许可证为准。</li>
      <li>八项核心信息只认「客户书面指定人签字」的标准值，不接受口头确认。</li>
      <li>许可证到期日、经营状态需按月复核 —— 过期证号一旦被 AI 引用，就是自源红线。</li>
      <li>本页展示当前源库门店；未裁定字段仅为待核验资料，不应当作事实真值。</li>
    </ul>`)}</div>`;
};

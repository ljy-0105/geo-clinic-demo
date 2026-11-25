/* Website diagnostics and rectification: static snapshot workflow. */
(() => {
  "use strict";
  const statusLabels = { pass: "已检查", fail: "需处理", not_checked: "未检查", info: "提示" };
  const severityLabels = { Critical: "紧急", High: "优先", Medium: "一般", Low: "建议", Info: "信息" };
  const moduleLabels = { page_metadata: "页面信息", schema: "结构化数据", store_facts: "门店事实", coverage: "检查边界" };
  const taskLabels = { open: "待处理", in_progress: "处理中", awaiting_recheck: "待复检", review_closed: "人工复核关闭", verified: "已验证" };
  const isOpen = task => !["verified", "review_closed"].includes(task.status);
  const state = {
    db: { runs: [], tasks: [] }, selected: null, report: null, mode: "imported",
    url: "", html: "", sourceLabel: "粘贴源码", busy: false, message: "", error: "", filter: "all",
  };
  function read() {
    try { state.db = SiteAuditStore.load(); } catch (e) { state.error = e.message; }
  }
  function currentId() { return state.mode === "sample" ? SiteAuditExamples.store.id : D.store.id; }
  function scoped(list) { return list.filter(r => r.storeId === currentId() && r.mode === state.mode); }
  function date(value) { return new Date(value).toLocaleString("zh-CN", { hour12: false }); }
  function report() {
    if (state.report?.id === state.selected) return state.report;
    return scoped(state.db.runs).find(r => r.id === state.selected) || null;
  }
  function refresh() {
    if (!document.getElementById("audit-workspace")) return;
    document.getElementById("page").innerHTML = window.VIEWS.siteaudit();
    mount();
  }
  function download(value, name) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function empty(title, text) { return `<div class="audit-empty"><strong>${title}</strong><p>${text}</p></div>`; }
  function resultHtml(r) {
    if (!r) return empty("从一个真实页面开始", "保存门店官网页面的 HTML，上传快照或粘贴源码，即可查看问题、证据和整改建议。也可以先在示例沙盒体验。");
    const saved = state.db.runs.some(v => v.id === r.id);
    const previous = scoped(state.db.runs).find(v => v.id !== r.id && v.url === r.url && v.ruleVersion === r.ruleVersion && v.capturedAt < r.capturedAt);
    const diff = SiteAuditEngine.compare(r, previous);
    const checks = r.checks.filter(c => state.filter === "all" || c.status === state.filter);
    const rows = checks.map(c => {
      const task = scoped(state.db.tasks).find(t => t.ruleId === c.id && t.url === r.url && t.ruleVersion === r.ruleVersion && (c.module !== "store_facts" || t.factBaselineHash === r.factBaselineHash) && isOpen(t));
      return `<article class="audit-check audit-check-${c.status}">
        <div class="audit-check-head"><div><span class="tag ${c.status === "fail" ? (["High", "Critical"].includes(c.severity) ? "danger" : "warn") : c.status === "pass" ? "ok" : "ghost"}">${statusLabels[c.status]}</span>
        <strong>${esc(c.title)}</strong></div><span class="note">${esc(moduleLabels[c.module])} · ${severityLabels[c.severity]}</span></div>
        <p class="audit-evidence">${esc(c.evidence)}</p>
        ${c.status === "fail" ? `<div class="audit-recommendation">${esc(c.recommendation)}</div>
          <div class="audit-check-foot"><code>${esc(c.id)}</code><button type="button" class="audit-btn subtle" data-create-task="${esc(c.id)}" ${!saved || task ? "disabled" : ""}>${task ? "已加入整改" : "加入整改任务"}</button></div>` : ""}
      </article>`;
    }).join("");
    const changeLabels = { title: "标题", description: "描述", headings: "H1", canonical: "规范地址", robots: "索引指令", types: "Schema 类型" };
    const diffHtml = diff ? `<div class="audit-diff"><strong>与 ${esc(date(diff.previousAt))} 的同页快照比较</strong>
      <p>${diff.sameSource ? "HTML 校验值相同。" : "HTML 快照已发生变化。"} ${diff.resolved.length} 项原有问题本次通过，${diff.introduced.length} 项原本通过的检查出现问题。</p>
      ${diff.baselineChanged ? '<p class="note">门店裁定标准已变更，事实项不计入自动修复数。</p>' : ""}
      ${diff.changes.map(c => `<div class="audit-change"><b>${changeLabels[c.key]}</b><span>${esc(Array.isArray(c.before) ? c.before.join(" / ") : c.before || "未声明")}</span><span>→ ${esc(Array.isArray(c.after) ? c.after.join(" / ") : c.after || "未声明")}</span></div>`).join("")}
      </div>` : '<p class="note audit-baseline">这是本规则版本下的首个同页快照，后续导入可查看变化。</p>';
    return `<div class="audit-result-meta"><div><strong>${esc(r.facts.title || "页面未设置标题")}</strong>
      <p class="audit-url-text">${esc(r.url)}</p><p class="note">${esc(date(r.capturedAt))} · ${esc(r.sourceLabel)} · ${(r.bytes / 1024).toFixed(1)} KB · ${r.mode === "sample" ? "虚构示例" : "用户导入快照"}</p></div>
      <div class="audit-result-actions">${r.status === "partial" ? '<span class="tag warn">部分完成</span>' : ""}<button type="button" class="audit-btn" data-export-run="${esc(r.id)}">导出证据</button></div></div>
      ${!saved ? '<div class="banner danger">本次诊断尚未保存。请先导出证据；保存成功后才能建立整改任务。</div>' : ""}
      <div class="audit-stat-grid">
        <div><span>需处理</span><b>${r.summary.issues}</b></div><div><span>优先处理</span><b>${r.summary.high}</b></div>
        <div><span>检查通过</span><b>${r.summary.passed}</b></div><div><span>未检查</span><b>${r.summary.notChecked}</b></div>
      </div>${diffHtml}
      <div class="audit-filters" role="group" aria-label="筛选检查项">${[["all", "全部检查"], ["fail", "需处理"], ["pass", "已通过"], ["not_checked", "未检查"]].map(([key, label]) => `<button type="button" class="audit-filter ${state.filter === key ? "active" : ""}" data-audit-filter="${key}" aria-pressed="${state.filter === key}">${label}</button>`).join("")}</div>
      <div class="audit-checks">${rows || empty("此筛选下没有检查项", "切换其他状态查看。")}</div>
      <details class="audit-details"><summary>证据与检查范围</summary>
        <dl><dt>SHA-256</dt><dd><code>${esc(r.sourceHash || "当前浏览器环境未提供校验能力")}</code></dd>
        <dt>规则版本</dt><dd>${esc(r.ruleVersion)} · 来源 claude-seo 2.6.2</dd></dl>
        <ul class="list">${r.limitations.map(v => `<li>${esc(v)}</li>`).join("")}</ul>
        <p class="note">导入时使用的门店标准以报告中的事实比对记录为准。源 HTML 随导出的 JSON 留档。</p>
      </details>`;
  }
  function taskHtml() {
    const tasks = scoped(state.db.tasks);
    if (!tasks.length) return empty("把发现变成整改动作", "在诊断结果中点击“加入整改任务”，填写负责人和处理记录。改完后设为待复检，再导入同一页面的新快照。");
    return `<div class="audit-tasks">${tasks.map(t => `<form class="audit-task" data-task-form="${esc(t.id)}">
      <div class="audit-check-head"><strong>${esc(t.title)}</strong><span class="tag ${t.status === "verified" ? "ok" : "warn"}">${taskLabels[t.status]}</span></div>
      <p class="audit-url-text">${esc(t.url)}</p><p class="note">${esc(t.recommendation)}</p>
      <details class="audit-details"><summary>建单证据与验证记录</summary><p class="audit-evidence">${esc(t.evidence)}</p>
        <p class="note">创建于 ${esc(date(t.createdAt))}${t.verifiedAt ? ` · 同页复检通过 ${esc(date(t.verifiedAt))}` : " · 尚未通过复检"}</p></details>
      <div class="audit-task-fields"><label>负责人<input name="owner" maxlength="60" value="${esc(t.owner)}" placeholder="待分配"></label>
      <label>处理状态<select name="status">${Object.entries(taskLabels).filter(([key]) => !isOpen(t) ? ["open", t.status].includes(key) : key !== "verified").map(([key, label]) => `<option value="${key}" ${key === t.status ? "selected" : ""}>${label}</option>`).join("")}</select></label></div>
      <label>处理记录<textarea name="note" rows="2" maxlength="500" placeholder="记录改动与待核实内容">${esc(t.note)}</textarea></label>
      <div class="audit-task-footer"><span class="note">“已验证”由后续同页复检产生</span><button class="audit-btn" type="submit">保存任务</button></div>
      </form>`).join("")}</div>`;
  }

  window.VIEWS.siteaudit = function () {
    read();
    const runs = scoped(state.db.runs), tasks = scoped(state.db.tasks);
    const selected = report();
    return `<div id="audit-workspace" data-audit-view>
      <div class="section-head"><h2>官网诊断与整改</h2><span class="sub">页面证据 → 整改任务 → 同页复检</span></div>
      <div class="audit-hero"><div><span class="audit-eyebrow">网站优化工作台</span><h3>让门店官网的信息可读、可核实</h3><p>检查页面信息、结构化数据和已裁定的门店事实，把问题逐项落实。</p></div>
        <div class="audit-hero-meta"><b>${runs.length}</b><span>份已存快照</span><b>${tasks.filter(isOpen).length}</b><span>项待处理整改</span></div></div>
      <div class="audit-toolbar"><div class="audit-mode" role="group" aria-label="诊断数据范围">
        <button type="button" class="audit-filter ${state.mode === "imported" ? "active" : ""}" data-audit-mode="imported" aria-pressed="${state.mode === "imported"}">本店快照</button>
        <button type="button" class="audit-filter ${state.mode === "sample" ? "active" : ""}" data-audit-mode="sample" aria-pressed="${state.mode === "sample"}">示例沙盒</button></div>
        <span class="note">诊断与整改保存在当前浏览器，可导出留档</span></div>
      ${state.mode === "sample" ? '<div class="banner"><span class="dot"></span><div><b>虚构示例沙盒</b> · 用于体验修复前后的变化，与客户门店和真实观测分开保存。</div></div>' : ""}
      <div id="audit-feedback" role="status" aria-live="polite">${state.error ? `<div class="banner danger">${esc(state.error)}</div>` : state.message ? `<div class="audit-success">${esc(state.message)}</div>` : ""}</div>
      <div class="audit-layout"><div class="audit-main">
        ${card("导入页面快照", `<form id="audit-form" class="audit-form">
          <label for="audit-url">原页面地址<input id="audit-url" name="url" type="url" required maxlength="2048" placeholder="https://你的官网/门店页面" value="${esc(state.url)}"></label>
          <div class="audit-upload-row"><label class="audit-btn" for="audit-file">上传 HTML 文件<input id="audit-file" type="file" accept=".html,.htm,text/html" class="audit-file"></label><span id="audit-file-label" class="note">${esc(state.sourceLabel)} · 最大 512 KB</span></div>
          <label for="audit-html">网页源码<textarea id="audit-html" name="html" rows="7" spellcheck="false" placeholder="也可以直接粘贴网页 HTML 源码"></textarea></label>
          <div class="audit-submit-row"><p class="note">只分析导入的静态 HTML，不在线抓取。需要检查 JS 渲染内容时，请先在浏览器保存对应页面快照。</p>
          <button class="audit-btn primary" type="submit" ${state.busy ? "disabled" : ""}>${state.busy ? "正在诊断…" : "开始诊断并保存"}</button></div>
          ${state.mode === "sample" ? '<div class="audit-examples"><button type="button" class="audit-btn subtle" data-example="before">载入问题示例</button><button type="button" class="audit-btn subtle" data-example="after">载入修复示例</button><span class="note">载入后点击“开始诊断并保存”</span></div>' : ""}
        </form>`, state.mode === "sample" ? "示例星河门诊部" : esc(D.store.display_name))}
        <div class="audit-result">${card("诊断结果", resultHtml(selected), "检查结果与原始证据一并保留")}</div>
      </div><aside class="audit-side">
        ${card("快照历史", runs.length ? `<div class="audit-history">${runs.map(r => `<div class="audit-history-row"><button class="audit-history-item ${r.id === selected?.id ? "selected" : ""}" type="button" data-select-run="${esc(r.id)}"><b>${esc(r.facts.title || "无标题页面")}</b><span>${esc(r.url)}</span><small>${esc(date(r.capturedAt))} · ${r.summary.issues} 项需处理</small></button><button type="button" class="audit-history-delete" data-remove-run="${esc(r.id)}" aria-label="清理该快照">清理</button></div>`).join("")}</div>` : empty("还没有快照", "导入并保存一次诊断后，会在这里保留历史。"))}
        <div class="audit-side-note">${card("本轮检查范围", '<ul class="list"><li>页面标题、描述、H1、canonical、索引指令与图片 alt</li><li>JSON-LD 语法及本店实体定位</li><li>已裁定门店标准与页面事实比对</li><li>同页快照变化与整改复检</li></ul><div class="divider"></div><p class="note">官网诊断不产生 AI 回答样本，也不计入 M1 / M2 / M3 / D1。诊断项通过，仍需用真实观测验证优化效果。</p>')}</div>
      </aside></div>
      <section class="audit-task-section">${card("整改任务", taskHtml(), `${tasks.filter(t => t.status === "verified").length} 项已通过复检`)}</section>
    </div>`;
  };

  function mount() {
    const workspace = document.getElementById("audit-workspace");
    if (!workspace) return;
    const form = document.getElementById("audit-form");
    document.getElementById("audit-html").value = state.html;
    document.getElementById("audit-url").value = state.url;
    form.addEventListener("input", e => {
      if (e.target.id === "audit-url") state.url = e.target.value;
      if (e.target.id === "audit-html") { state.html = e.target.value; state.sourceLabel = "粘贴源码"; }
    });
    document.getElementById("audit-file").addEventListener("change", async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (file.size > SiteAuditEngine.MAX_BYTES) throw new Error("文件超过 512 KB，请选择单页 HTML 快照。");
        const bytes = new Uint8Array(await file.arrayBuffer());
        let text;
        try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
        catch {
          const prefix = new TextDecoder("ascii").decode(bytes.slice(0, 4096));
          const charset = /charset\s*=\s*["']?([\w-]+)/i.exec(prefix)?.[1];
          if (!charset || !/^(gbk|gb2312|gb18030|big5)$/i.test(charset)) throw new Error("无法识别文件编码，请保存为 UTF-8 HTML 后重试。");
          text = new TextDecoder(charset, { fatal: true }).decode(bytes);
        }
        state.html = text; state.sourceLabel = file.name; state.error = "";
        document.getElementById("audit-html").value = text;
        document.getElementById("audit-file-label").textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`;
      } catch (error) { state.error = error.message; refresh(); }
    });
    workspace.addEventListener("submit", async e => {
      e.preventDefault();
      if (e.target.id !== "audit-form") {
        const id = e.target.dataset.taskForm;
        if (!id) return;
        try {
          const values = new FormData(e.target);
          state.db = SiteAuditStore.updateTask(id, { owner: values.get("owner"), status: values.get("status"), note: values.get("note") });
          state.error = ""; state.message = "整改任务已保存。";
        } catch (error) { state.error = error.message; }
        refresh(); return;
      }
      if (state.busy) return;
      state.url = document.getElementById("audit-url").value;
      state.html = document.getElementById("audit-html").value;
      state.error = ""; state.message = ""; state.busy = true; refresh();
      try {
        const sample = state.mode === "sample";
        const result = await SiteAuditEngine.inspect({ html: state.html, url: state.url,
          store: sample ? SiteAuditExamples.store : D.store, facts: sample ? SiteAuditExamples.facts : D.facts,
          mode: state.mode, sourceLabel: state.sourceLabel });
        state.report = result; state.selected = result.id; state.filter = "all";
        state.db = SiteAuditStore.addRun(result);
        state.message = "诊断已保存。可将需处理项加入整改任务，修改后导入同页快照复检。";
      } catch (error) { state.error = error.message; }
      finally { state.busy = false; refresh(); }
    });
    workspace.addEventListener("click", e => {
      const button = e.target.closest("button");
      if (!button || state.busy) return;
      try {
        const data = button.dataset;
        if (data.auditMode) {
          state.mode = data.auditMode; state.selected = null; state.report = null;
          state.url = ""; state.html = ""; state.sourceLabel = "粘贴源码"; state.error = ""; state.message = "";
          if (state.mode === "sample") { state.url = SiteAuditExamples.url; state.html = SiteAuditExamples.before; state.sourceLabel = "虚构问题示例"; }
        } else if (data.example) {
          state.url = SiteAuditExamples.url; state.html = SiteAuditExamples[data.example];
          state.sourceLabel = data.example === "after" ? "虚构修复示例" : "虚构问题示例";
        } else if (data.auditFilter) state.filter = data.auditFilter;
        else if (data.selectRun) { state.selected = data.selectRun; state.report = null; }
        else if (data.exportRun) {
          const r = report();
          if (r) download({ format: "geomon-site-audit-evidence-v1", report: r, tasks: scoped(state.db.tasks).filter(t => t.url === r.url) }, `site-audit-${r.id}.json`);
          return;
        } else if (data.createTask) {
          state.db = SiteAuditStore.createTask(state.selected, data.createTask);
          state.message = "已加入整改任务，请在下方填写负责人和处理记录。"; state.error = "";
        } else if (data.removeRun) {
          if (!window.confirm("清理此快照前，请先导出证据。确定清理这份未关联整改任务的快照吗？")) return;
          state.db = SiteAuditStore.removeRun(data.removeRun);
          if (state.selected === data.removeRun) { state.selected = null; state.report = null; }
          state.message = "快照已清理。"; state.error = "";
        } else return;
        refresh();
      } catch (error) { state.error = error.message; refresh(); }
    });
  }
  window.VIEW_MOUNTS.siteaudit = mount;
})();

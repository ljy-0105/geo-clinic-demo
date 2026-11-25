/* 通用工具与图表原语（无第三方依赖，file:// 直接可跑） */
const D = window.GEO_DATA;
const pct = (v, d = 1) => (v === null || v === undefined ? "—" : (v * 100).toFixed(d) + "%");
const num = (v, d = 0) => (v === null || v === undefined ? "—" :
  Number(v).toLocaleString("zh-CN", { minimumFractionDigits: d, maximumFractionDigits: d }));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/* Local Lucide SVGs, pinned source and license in THIRD_PARTY_NOTICES.md. */
function uiIcon(name, cls = "") {
  const safe = String(name).replace(/[^a-z0-9-]/g, "");
  return `<span class="ui-icon ${cls}" aria-hidden="true" style="mask-image:url('assets/icons/${safe}.svg');-webkit-mask-image:url('assets/icons/${safe}.svg')"></span>`;
}
const pp = (v) => (v >= 0 ? "+" : "") + Number(v).toFixed(1);
const fixed = (v, n = 2) => v == null || !Number.isFinite(v) ? "—" : v.toFixed(n);
function channelConclusion(p) {
  const c = p.ceiling;
  if (!p.total || c.p == null) return "暂无有效门店可答样本，不能判断提及或名单表现。";
  if (!c.listN) return "本通道样本未观察到机构名单，条件出现率 q、名单平均长度 L 与均分份额均不可计算；不能据此判断排名。";
  if (c.p < .15) return "名单出现率低于 15%，仅保留样本记录，不作稳定排名或优化效果承诺。";
  if (!c.selfListN) return "样本中存在机构名单，但未观察到本店进入名单；本店名单命中为零。";
  return "样本中观察到本店进入部分名单；这组结果仅描述本次采样，不能证明稳定推荐或因果效果。";
}
function m2Evidence(data = D) {
  return `<div class="table-wrap"><table><thead><tr><th>独立通道</th><th>可评项 / 八项</th><th>参与回答</th><th>逐项规则比对与区间</th></tr></thead><tbody>${data.platforms.map(p => {
    const s = p.m2Summary;
    return `<tr><td>${esc(p.label)}</td><td>${s.nItems}/8 项可评</td><td>n=${s.answerN}${s.answerN && s.lowN ? ' · 暂作轶事' : ''}</td><td>${p.m2.filter(v => v.status === 'ok').map(v => `${esc(v.label)} ${pct(v.rate)}（${v.correct}/${v.n}；n=${v.n}；95% Wilson ${pct(v.ciLow)}–${pct(v.ciHigh)}${v.lowN ? '；轶事' : ''}）`).join('<br>') || '— · 未取得可判定的事实观测'}</td></tr>`;
  }).join('')}</tbody></table></div><p class="note">只评已裁定且已提及、规则可判定的事实；未观测与未裁定分别列出。区间为逐项重复观测的描述性 Wilson 区间，未做独立性校正；规则比对不等于人工准确率验收，不合并平台宏平均。</p>`;
}

const STATUS_LABEL = { arbitrated: "已裁定", pending: "未裁定", disputed: "有争议" };
const SOURCE_LABEL = { self: "自源", other: "他源" };
const INC_STATUS = { open: "待处理", confirmed: "已确认", fixed: "已修复", closed: "已关闭" };

/* ---------- 条形对比（带置信区间） ---------- */
function barRows(items, opts = {}) {
  const max = Math.max(0.01, ...items.map((i) => Math.max(i.high ?? i.rate, i.rate))) * 1.08;
  return `<div class="bars">${items.map((i) => {
    const fill = (i.rate / max) * 100;
    const lo = (i.low / max) * 100;
    const w = Math.max(1.5, ((i.high - i.low) / max) * 100);
    return `<div class="bar-row">
      <span class="name" title="${esc(i.label)}">${esc(i.label)}</span>
      <div class="bar-track">
        <div class="bar-ci" style="left:${lo}%;width:${w}%"></div>
        <div class="bar-fill" style="width:${fill}%"></div>
      </div>
      <span class="val"><b>${pct(i.rate)}</b> ${i.note ? `<span style="color:#94a3b8">${i.note}</span>` : ""}</span>
    </div>`;
  }).join("")}</div>`;
}

/* ---------- 环形图 ---------- */
function donut(segments, size = 132) {
  const r = size / 2 - 10, C = 2 * Math.PI * r, total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const arcs = segments.map((s) => {
    const len = (s.value / total) * C, off = acc;
    acc += len;
    return `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${s.color}"
      stroke-width="15" stroke-dasharray="${Math.max(0, len - 2)} ${C}"
      stroke-dashoffset="${-off}" transform="rotate(-90 ${size / 2} ${size / 2})"
      stroke-linecap="butt"></circle>`;
  }).join("");
  return `<div class="donut"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#f1f4f8" stroke-width="15"></circle>
    ${arcs}</svg></div>`;
}

/* ---------- 折线 ---------- */
function lineChart(points, w = 420, h = 132) {
  const pad = { l: 34, r: 14, t: 14, b: 26 };
  const xs = points.map((_, i) => pad.l + (i * (w - pad.l - pad.r)) / Math.max(1, points.length - 1));
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals) * 0.92, max = Math.max(...vals) * 1.06 || 0.1;
  const ys = vals.map((v) => pad.t + (h - pad.t - pad.b) * (1 - (v - min) / (max - min || 1)));
  const path = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const dots = xs.map((x, i) => `<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="3.5"
      fill="#fff" stroke="#0d7a6f" stroke-width="2"></circle>`).join("");
  const labels = xs.map((x, i) => `<text x="${x.toFixed(1)}" y="${h - 8}" font-size="10.5"
      fill="#68758a" text-anchor="middle">${esc(points[i].label)}</text>`).join("");
  const valText = xs.map((x, i) => `<text x="${x.toFixed(1)}" y="${ys[i].toFixed(1) - 10}"
      font-size="10.5" fill="#0f172a" text-anchor="middle">${pct(vals[i])}</text>`).join("");
  return `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <line x1="${pad.l}" y1="${h - pad.b}" x2="${w - pad.r}" y2="${h - pad.b}" stroke="#e4e8ee"></line>
    <path d="${path}" fill="none" stroke="#0d7a6f" stroke-width="2" stroke-linejoin="round"></path>
    ${dots}${labels}${valText}</svg>`;
}

/* ---------- 卡片 ---------- */
const card = (title, body, hint = "") => `<div class="card">
  <div class="card-title"><h3>${title}</h3>${hint ? `<span class="hint">${hint}</span>` : ""}</div>
  ${body}</div>`;

const kpi = (label, value, foot, tone = "") => `<div class="card kpi ${tone}">
  <div class="k-accent"></div><div class="k-label">${label}</div>
  <div class="k-value">${value}</div><div class="k-foot">${foot}</div></div>`;

/* ---------- 视图注册 ---------- */
window.VIEWS = {};
window.VIEW_MOUNTS = {};
window.VIEW_UNMOUNTS = {};
let activeView = null;
const TABS = [
  ["dashboard", "每日数据大屏"],
  ["workbench", "运营工作台"], ["discovery", "提问拓展"], ["content", "内容工作室"], ["sources", "信源台账"],
  ["overview", "效果总览"], ["store", "门店建档"], ["prompts", "测量词库"],
  ["collect", "采集观测"], ["metrics", "指标口径"], ["siteaudit", "官网诊断"], ["incidents", "合规事件"], ["report", "报告"],
];

function go(tab) {
  if (!window.VIEWS[tab]) tab = window.VIEWS.dashboard ? "dashboard" : "workbench";
  if (activeView && window.VIEW_UNMOUNTS[activeView]) window.VIEW_UNMOUNTS[activeView]();
  activeView = tab;
  document.querySelectorAll(".tab").forEach((b) =>
    { b.classList.toggle("active", b.dataset.tab === tab); if (b.dataset.tab === tab) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  const page = document.getElementById("page");
  const hostedNote = window.GEO_DEPLOYMENT?.mode === "static" && tab !== "overview" ? '<div class="banner" role="note">完整前端在线版 · 当前展示历史样本。每日采集与账号登录需在本机后台运行；草稿与整改记录仅保存在当前浏览器。</div>' : "";
  page.innerHTML = hostedNote + (window.VIEWS[tab] ? window.VIEWS[tab]() : "");
  if (window.VIEW_MOUNTS[tab]) window.VIEW_MOUNTS[tab]();
  document.title = `${TABS.find(([id]) => id === tab)?.[1] || "GEO"} · 门店 GEO 运营`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderShell() {
  const s = D.store, k = D.kpi;
  const groups = [["监测中心", ["dashboard", "overview", "collect", "prompts"]], ["内容运营", ["workbench", "discovery", "content", "sources"]], ["管理与交付", ["store", "siteaudit", "incidents", "metrics", "report"]]];
  const icons = { dashboard: "layout-dashboard", workbench: "panels-top-left", discovery: "search", content: "square-pen", sources: "link", overview: "chart-no-axes-combined", store: "store", prompts: "list-filter", collect: "messages-square", metrics: "ruler", siteaudit: "scan-search", incidents: "shield-check", report: "file-chart-column" };
  document.getElementById("root").innerHTML = `
  <a class="skip-link" href="#page">跳到主要内容</a><header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <span class="brand-mark">${uiIcon("radio")}</span>
        <span class="brand-text"><strong>GEO 观测台</strong>
          <em>品牌的 AI 可见性工作台</em></span>
      </div>
      <div class="topbar-right">
        <div class="store-chip">${uiIcon("store")}<span><strong>${esc(s.display_name)}</strong><small>${esc(s.city)}${esc(s.district)} · 门店工作区</small></span></div>
      </div>
    </div>
    <nav class="tabs" id="tabs" aria-label="主导航">${groups.map(([title, ids]) => `<div class="nav-group"><span class="nav-group-label">${title}</span>${ids.map(id => `<button class="tab" data-tab="${id}">${uiIcon(icons[id])}<span>${TABS.find(t => t[0] === id)[1]}</span>${id === "dashboard" ? '<span class="nav-current-dot" aria-hidden="true"></span>' : ""}</button>`).join("")}</div>`).join("")}</nav>
    <div class="nav-foot">${uiIcon("shield-check")}<span>${window.GEO_DEPLOYMENT?.mode === "static" ? "在线工作区" : "本地工作区"}<small>每一次观测，都有据可查</small></span></div>
  </header>
  <div class="workspace-bar"><span class="workspace-breadcrumb">工作空间 ${uiIcon("chevron-right")}<b>${esc(s.display_name)}</b></span><div class="workspace-account"><span class="workspace-snapshot">历史基线 · ${esc(D.meta.generatedAt.split("T")[0])}</span><span class="workspace-avatar" aria-label="当前门店">${esc(s.display_name.slice(0, 1))}</span></div></div>
  <main class="page" id="page" tabindex="-1"></main>`;
  document.getElementById("root").addEventListener("click", e => {
    const target = e.target.closest("[data-go], .tab[data-tab]");
    if (target) go(target.dataset.go || target.dataset.tab);
  });
}

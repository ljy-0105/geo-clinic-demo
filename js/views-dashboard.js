/* Daily dashboard reads only the same-origin loopback backend. No credentials in UI. */
(() => {
  "use strict";
  let selectedDay = "", timer = null, generation = 0;
  const STATES = { pending: "排队", running: "执行中", succeeded: "已记录", failed: "失败", blocked: "已暂停", uncertain: "结果不确定", missed: "当日未执行", waiting_import: "待网页采集/导入" };
  const DENOMS = { store_answerable: "门店可答", verification: "事实核验", knowledge: "知识问题" };
  const ERRORS = { session_setup_required: "请先完成独立网页账号登录配置", browser_dependency_missing: "浏览器依赖尚未安装", login_required: "登录已过期，请重新登录", captcha_required: "需人工处理网页验证，本平台队列已暂停", profile_busy: "独立浏览器会话正在使用", browser_launch_failed: "独立 Edge 启动失败", completion_unverified: "未确认生成结束，未计入有效回答", fresh_conversation_unverified: "未确认新建对话，未发送问题", input_selector_missing: "输入框未识别，请更新适配", send_selector_missing: "发送按钮未识别，请更新适配", browser_interrupted: "浏览器中断，请查看尝试记录", worker_interrupted: "进程中断，需核验原调用", day_expired: "当日未执行，未伪造补采日期", empty_answer: "返回空回答", collector_interrupted: "采集器中断", invalid_api_payload: "响应格式未识别", worker_error: "后台出错，请检查日任务库" };
  const localDay = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const localTime = s => s ? new Date(s).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false }) : "—";
  const serviceOrigin = () => location.protocol === "http:" && location.hostname === "127.0.0.1";
  const hosted = () => window.GEO_DEPLOYMENT?.mode === "static";
  const stateText = (text, cls = "") => `<span class="db-state ${cls}">${esc(text)}</span>`;
  const stat = (label, val, foot, cls = "", icon = "database") => `<div class="db-stat ${cls}"><div class="db-stat-label"><span>${label}</span>${uiIcon(icon)}</div><strong>${val}</strong><small>${foot}</small></div>`;
  const skeleton = () => `<div class="db-empty">${uiIcon("radio")}<h3>每日观测等待连接</h3><p>${hosted() ? "在线版未连接本机采集后台，今日状态未知。可查看下方历史基线，或进入效果总览与样本报告。" : "日采集数据尚未连接，已有历史基线可在下方查看。"}</p>${hosted() ? '<p><button class="db-btn" data-go="overview">查看效果总览</button> <button class="db-btn" data-go="report">查看样本报告</button></p>' : ""}</div>`;
  const engineMark = platform => `<span class="db-engine-mark ${esc(platform)}" aria-hidden="true">${{ deepseek: "D", doubao: "豆", yuanbao: "元" }[platform] || "AI"}</span>`;
  const history = () => `<section class="db-panel db-history"><div class="db-panel-head"><div><h3>历史观测基线 <span class="db-subtle-tag">独立快照</span></h3><p>原有 ${num(D.obsTotal)} 次观测 · 与每日采集分别统计</p></div><span>${esc(D.meta.generatedAt.split("T")[0])}</span></div><div class="db-history-grid">${D.platforms.map(p => `<div><span>${esc(p.label)}<small>${p.endpoint === "api" ? "API" : "网页端"}</small></span><strong>${pct(p.rate)}</strong><small>样本 M1 · ${p.total} 次 · ${p.rounds} 轮</small></div>`).join("")}</div><details class="db-history-note"><summary>关于这组数据 ${uiIcon("chevron-right")}</summary><p>${esc(D.meta.dataNote)}</p><p>此处为导入前已有的历史快照，不作为今日完成量或每日趋势。${D.platforms.some(p => p.primary && p.p < .15) ? "名单出现率低的通道，M1 仅作记录，不能承诺排名。" : ""}</p></details></section>`;
  const errorLabel = code => ERRORS[code] || (/^http_\d+$/.test(code || "") ? `接口返回 ${code.slice(5)}` : code ? "采集异常（详见证据）" : "");
  const toolButton = (id, label, primary = false, icon = "") => `<button class="db-btn ${primary ? "primary" : ""}" type="button" id="${id}">${icon ? uiIcon(icon) : ""}${label}</button>`;
  function spark(points, target, key, label) {
    const w = 360, h = 138, top = 16, base = 108, left = 33, dx = (w - left - 20) / Math.max(1, points.length - 1);
    let path = "", last = false, previousSignature = null;
    const dots = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i].targets[target], value = p[key];
      if (value === null || !p.planned) { last = false; continue; }
      if (previousSignature && p.sampleSignature !== previousSignature) last = false;
      const x = left + dx * i, y = base - (base - top) * value;
      path += `${last ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)} `; last = true;
      previousSignature = p.sampleSignature;
      dots.push(`<circle cx="${x}" cy="${y}" r="3.3"><title>${esc(points[i].day)} · ${pct(value)} · ${p.m1Hit}/${p.m1N} 个有效门店可答样本</title></circle>`);
    }
    return `<div class="db-chart-wrap ${dots.length ? "" : "is-empty"}"><svg class="db-chart" role="img" aria-label="${esc(label)}；缺测断开连线" viewBox="0 0 ${w} ${h}"><line x1="33" y1="16" x2="340" y2="16"/><line x1="33" y1="62" x2="340" y2="62"/><line x1="33" y1="108" x2="340" y2="108"/><text x="0" y="20">100%</text><text x="12" y="112">0%</text><path d="${path}"/>${dots.join("")}<text x="33" y="133">${esc(points[0].day.slice(5))}</text><text x="310" y="133">${esc(points[points.length - 1].day.slice(5))}</text></svg>${dots.length ? "" : '<div class="db-chart-empty"><span>暂无趋势数据</span><small>完成采集后，展示近 14 日变化</small></div>'}</div>`;
  }
  async function requestAPI(path, value) {
    if (!serviceOrigin()) throw new Error(hosted() ? "在线静态版无法执行本机采集。请在运行后台的电脑打开 http://127.0.0.1:8878。" : "当前为离线文件。请运行 daily_server.py，再从 http://127.0.0.1:8878 打开。");
    const response = await fetch(path, { cache: "no-store", ...(value === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json", "X-GEO-Local": "1" }, body: JSON.stringify(value) }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "后台请求失败");
    return data;
  }
  const notice = (text, bad = false) => { const el = document.getElementById("db-notice"); if (el) { el.textContent = text; el.classList.toggle("bad", bad); } };
  function download(name, data) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })), a = document.createElement("a");
    a.download = name; a.href = url; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  window.VIEWS.dashboard = () => `<section class="daily-screen" id="daily-screen"><header class="db-top"><div><span class="db-eyebrow">DAILY MONITORING</span><h1>每日 AI 观测<span class="db-title-tag">3 个引擎</span></h1><p>追踪品牌在 AI 回答中的出现，留住每一次真实反馈。</p></div><div class="db-date"><label for="db-day" class="db-date-field">${uiIcon("calendar-days")}<span class="sr-only">观测日期</span><input type="date" id="db-day" value="${esc(selectedDay || localDay())}"></label>${toolButton("db-refresh", "刷新", false, "refresh-cw")}${toolButton("db-fullscreen", "全屏", false, "maximize")}${toolButton("db-configure", "采集设置", true, "settings-2")}</div></header>
    <p id="db-connection" class="db-connection" role="status">${serviceOrigin() ? "正在连接本机日采集后台…" : hosted() ? "在线展示模式 · 未连接本机后台；日采集状态未知" : "离线模式 · 尚未连接后台；日采集状态未知"}</p><p id="db-notice" class="db-notice" role="status" aria-live="polite"></p>
    <div id="db-live">${skeleton()}</div>${history()}<footer class="db-footer"><span>${uiIcon("shield-check")}原始回答留档 · 按平台分别统计 · 北京时间</span><button class="db-btn db-btn-quiet" data-go="workbench">进入运营工作台 ${uiIcon("arrow-right")}</button></footer></section>`;
  window.VIEW_UNMOUNTS = window.VIEW_UNMOUNTS || {};
  window.VIEW_UNMOUNTS.dashboard = () => { generation++; clearInterval(timer); timer = null; };
  window.VIEW_MOUNTS.dashboard = () => {
    const gen = ++generation;
    const dayInput = document.getElementById("db-day");
    let activeRequest = 0, settingsDirty = false, importDirty = false, settingsRevision = 0, importRevision = 0, settingsOpen = false;
    const dirty = () => settingsDirty || importDirty;
    const api = async (path, value) => {
      const data = await requestAPI(path, value);
      if (gen !== generation) throw new Error("视图已切换");
      return data;
    };
    async function renderBoard(silent = false) {
      if (gen !== generation) return;
      if (dirty()) {
        dayInput.value = selectedDay;
        if (!silent) notice("有未保存的设置或导入内容，请先保存设置、导入或清空输入；自动刷新已暂停。");
        return;
      }
      const request = ++activeRequest;
      const date = dayInput.value || localDay(); selectedDay = date;
      try {
        const data = await api(`/api/daily?day=${encodeURIComponent(date)}`);
        if (gen !== generation || request !== activeRequest || dirty()) return;
        const el = document.getElementById("db-connection");
        el.textContent = `${data.scheduler.alive ? "后台在线" : "后台心跳缺失"} · ${data.settings.enabled ? "日计划已启用" : "自动采集已暂停"} · 最近读取 ${localTime(data.generatedAt)}${data.scheduler.errorCode ? " · " + errorLabel(data.scheduler.errorCode) : ""}`;
        el.classList.toggle("bad", !data.scheduler.alive || Boolean(data.scheduler.errorCode));
        draw(data);
      } catch (e) {
        if (gen !== generation || request !== activeRequest) return;
        const el = document.getElementById("db-connection");
        el.textContent = `${e.message} 若下方已有结果，请视为上次读取快照，当前状态未确认。`; el.classList.add("bad");
      }
    }
    function handle(fn) { return async e => { e.preventDefault(); try { await fn(e); } catch (err) { if (gen === generation) notice(err.message, true); } }; }
    function draw(data) {
      const total = data.totals, planned = total.planned;
      const emptyDay = !planned;
      document.getElementById("db-live").innerHTML = `
      ${emptyDay ? `<section class="db-welcome"><div class="db-welcome-icon">${uiIcon("radio")}</div><div class="db-welcome-copy"><h2>${data.targets.some(t=>!t.ready) ? "先连接账号，再开始每日观测" : "账号已做登录配置，下一步每家一题试采"}</h2><p>当前未建立采集计划，尚未完成三站真实采样验收。请点击各引擎“去登录”，在独立窗口本人登录后，再配置时间和题数。</p><div class="db-start-steps"><span><b>01</b> 本人登录</span><i></i><span><b>02</b> 每家一题试采</span><i></i><span><b>03</b> 启用每日计划</span></div></div><button class="db-btn" type="button" data-open-settings>配置采集计划 ${uiIcon("arrow-up-right")}</button></section>` : ""}
      <div class="db-stats">
        ${stat("当日提问计划", planned ? num(planned) : "—", planned ? "已冻结当日正式词库" : "今日尚未建立采集计划", "", "messages-square")}
        ${stat("已记录回答", planned ? num(total.succeeded) : "—", planned ? `计划完成率 ${pct(total.succeeded / planned)}` : "尚未开始，不能当作零提及", "cyan", "circle-check")}
        ${stat("待完成", planned ? num(total.waiting) : "—", "排队中与正在执行的任务", "", "clock-3")}
        ${stat("需要关注", planned ? num(total.failed) : "—", "失败、缺配置、结果未知与漏执行", total.failed ? "amber" : "", "circle-exclamation-point")}
      </div>
      <div class="db-section-title"><div><h2>引擎表现</h2><p>每个平台独立观测，不混合计算提及率</p></div><span>${uiIcon("chart-no-axes-combined")}近 14 日趋势</span></div>
      <div class="db-engines">${data.targets.map(t => `<section class="db-panel db-engine" data-platform="${esc(t.platform)}">
        <div class="db-panel-head"><div class="db-engine-identity">${engineMark(t.platform)}<div><h2>${esc(t.label)}</h2><p>${t.channel === "api" ? "API 回答" : "网页真实回答"}</p></div></div>${stateText(t.ready ? "已配置" : "待连接", t.ready ? "ok" : "")}</div>
        <p class="db-adapter" title="${esc(t.collectorStatus)}">${t.ready ? "已做登录配置 · 仍需试采验证" : "账号未连接 · 尚未采集"}</p><button type="button" class="db-btn db-login" data-login="${esc(t.platform)}">${uiIcon("plug")}${t.ready ? "重新登录" : "去登录"}</button>
        <div class="db-engine-value"><div><span class="db-metric-label">本店提及率 <span>M1</span></span><strong>${pct(t.m1)}</strong></div><span>${t.m1Hit}/${t.m1N}<small>有效门店可答样本</small></span></div>
        ${spark(data.trends, t.id, "m1", t.label + "近14日样本M1")}
        <div class="db-engine-foot"><span>采集进度</span><strong>${t.succeeded}<small> / ${t.planned}</small></strong></div>
        <div class="db-progress"><i style="width:${t.planned ? (100 * t.succeeded / t.planned).toFixed(2) : 0}%"></i></div>
        <p class="db-engine-status">${Object.entries(t.states).filter(([s]) => s !== "succeeded").map(([s, n]) => `${STATES[s] || s} ${n}`).join(" · ") || (t.planned ? "当日任务已记录" : "当日尚无采集任务")}</p>
      </section>`).join("")}</div>
      <div class="db-grid"><section class="db-panel db-activity"><div class="db-panel-head"><div><h3>采集记录</h3><p>逐条查看执行状态与原始回答</p></div><span class="db-subtle-tag">${planned} 条任务</span></div>
      <div class="db-table-wrap"><table class="db-table"><thead><tr><th>提问 / 平台</th><th>执行状态</th><th>提问 / 入库时间</th><th>证据</th></tr></thead><tbody>${data.jobs.map(j => `<tr><td><strong>${esc(j.prompt)}</strong><small>${esc(data.targets.find(t => t.id === j.target)?.label || j.platform)} · ${j.channel === "web" ? "网页端" : esc(j.channel)} · ${esc(DENOMS[j.denom] || "其他题型")}</small></td><td>${stateText(STATES[j.status] || j.status, ["failed", "blocked", "uncertain", "missed"].includes(j.status) ? "warn" : j.status === "succeeded" ? "ok" : "")}<small>${esc(errorLabel(j.error_code))}</small></td><td>${esc(localTime(j.asked_at))}<small>入库/结束 ${esc(localTime(j.finished_at))} · ${j.attempts} 次尝试</small></td><td><button class="db-btn db-btn-quiet" data-evidence="${esc(j.id)}">查看 ${uiIcon("arrow-up-right")}</button></td></tr>`).join("") || `<tr><td colspan="4"><div class="db-table-empty">${uiIcon("inbox")}<h4>今天的观测，从第一条提问开始</h4><p>完成账号连接并启用计划，回答将自动记录在这里。</p><button class="db-btn" type="button" data-open-settings>设置每日采集 ${uiIcon("arrow-right")}</button></div></td></tr>`}</tbody></table></div>
      <details class="db-method"><summary>${uiIcon("circle-question-mark")}指标如何计算？ ${uiIcon("chevron-right")}</summary><p>M1 分母只含有效门店可答回答。拒答计有效回答；空回答、网络失败及未采集均不记为“未提及”。收录、M2 与 D1 未在此推断。${esc(data.day)}</p></details></section>
      <aside class="db-panel db-schedule"><div class="db-panel-head"><h3>采集计划</h3>${stateText(data.settings.enabled ? "已启用" : "已暂停", data.settings.enabled ? "ok" : "")}</div>
      <div class="db-schedule-clock">${uiIcon("clock-3")}<strong>${esc(data.settings.dailyTime)}</strong><span>每天开始<small>北京时间 · UTC+08</small></span></div>
      <div class="db-schedule-platforms">${data.targets.map(t => `<div>${engineMark(t.platform)}<span>${esc(t.label)}</span><strong>${data.settings.promptLimits[t.platform]}<small> 题 / 天</small></strong></div>`).join("")}</div>
      <p class="db-next-run">${uiIcon("calendar-days")}<span>${data.nextRun ? `下一次 ${esc(localTime(data.nextRun))}` : "计划已暂停，等待启用"}</span></p>
      <details class="db-settings-panel" id="db-settings-panel" ${settingsOpen ? "open" : ""}><summary>${uiIcon("settings-2")}编辑采集设置 ${uiIcon("chevron-right")}</summary><div class="db-settings-body"><form class="db-settings" id="db-settings"><label>每日开始时间（北京时间）<input type="time" id="db-time" value="${esc(data.settings.dailyTime)}" required></label><div class="db-count-fields">${data.targets.map(t => `<label>${esc(t.label)}<input aria-label="${esc(t.label)} 每日提问数" type="number" id="db-limit-${t.platform}" min="1" max="100" value="${data.settings.promptLimits[t.platform]}" required></label>`).join("")}</div><label class="db-checkbox"><input type="checkbox" id="db-enabled" ${data.settings.enabled ? "checked" : ""}><span>启用每日自动采集<small>后台运行时，到点开始执行</small></span></label><button class="db-btn primary">保存设置</button></form>
      <div class="db-controls">${toolButton("db-plan", "建立今日计划", false, "play")}${toolButton("db-retry", "重试明确失败的任务", false, "refresh-cw")}${toolButton("db-template", "导出待采集任务", false, "download")}</div>
      <details class="db-guide"><summary>首次使用与运行说明 ${uiIcon("chevron-right")}</summary><p>先取消自动采集并保存，待独立窗口关闭后，在项目 impl 文件夹双击 login-web.cmd，依次连接三个账号。建议每家 1 题试采。</p><p>题数不足时采用正式词库全部已有词。已建立的当天计划冻结，设置修改影响后续新计划。电脑需开机、不休眠，后台程序保持运行。</p><p>逐题新对话；登录过期、验证码或生成结束未确认时，暂停该平台任务。只补建当天计划，不回造过往观测。</p></details>
      <details class="db-import"><summary>手动导入网页回答 ${uiIcon("chevron-right")}</summary><p>按任务 JSON 填入原始回答、带时区的真实 askedAt 和来源凭据，每次导入一条。</p><textarea id="db-import-text" rows="6" aria-label="网页回答 JSON" placeholder="粘贴一条已完成的任务 JSON"></textarea>${toolButton("db-import", "校验并导入")}</details></div></details></aside></div>
      <section id="db-evidence" class="db-panel db-evidence" hidden></section>`;
      const settingsPanel = document.getElementById("db-settings-panel");
      settingsPanel.addEventListener("toggle", () => {
        if (gen !== generation || !settingsPanel.isConnected) return;
        settingsOpen = settingsPanel.hasAttribute("open");
        document.getElementById("db-configure").setAttribute("aria-expanded", String(settingsOpen));
      });
      document.getElementById("db-configure").setAttribute("aria-expanded", String(settingsOpen));
      document.querySelectorAll("[data-open-settings]").forEach(el => el.addEventListener("click", openSettings));
      document.querySelectorAll("[data-login]").forEach(el => el.addEventListener("click", handle(async () => {
        const r = await api("/api/daily/login", { platform: el.dataset.login });
        notice(r.status === "already_open" ? "登录窗口已打开，请在独立 Edge 窗口完成登录，再回到登录终端按 Enter 检查。" : "已启动独立 Edge 登录工具。请本人登录，看到输入框后回到新终端按 Enter 完成检查；此操作未发送问题。若被系统拦截，可使用 login-web.cmd。");
      })));
      document.getElementById("db-settings").addEventListener("submit", handle(async () => {
        const revision = settingsRevision;
        await api("/api/daily/settings", { dailyTime: document.getElementById("db-time").value, promptLimits: Object.fromEntries(data.targets.map(t => [t.platform, Number(document.getElementById(`db-limit-${t.platform}`).value)])), enabled: document.getElementById("db-enabled").checked });
        if (revision === settingsRevision) settingsDirty = false;
        notice("设置已保存。已冻结的当日词集保持不变；暂停不取消已经发出的调用。"); await renderBoard(true);
      }));
      const markSettings = () => { settingsDirty = true; settingsRevision++; notice("设置尚未保存，自动刷新已暂停。"); };
      document.getElementById("db-settings").addEventListener("input", markSettings);
      document.getElementById("db-settings").addEventListener("change", markSettings);
      document.getElementById("db-import-text").addEventListener("input", e => { importDirty = Boolean(e.target.value); importRevision++; });
      document.getElementById("db-plan").addEventListener("click", handle(async () => { await api("/api/daily/plan", {}); notice("今日计划已建立；重复操作不会重复建立。自动采集须启用后台且到达执行时间。"); await renderBoard(); }));
      document.getElementById("db-retry").addEventListener("click", handle(async () => { const r = await api("/api/daily/retry", {}); notice(`${r.retried} 条明确失败的 网页任务重新排队。结果未知的调用不自动重发。`); await renderBoard(); }));
      document.getElementById("db-template").addEventListener("click", handle(() => {
        const pending = data.jobs.filter(j => ["waiting_import", "pending", "blocked", "failed"].includes(j.status)).map(j => ({ jobId: j.id, platform: j.platform, channel: j.channel, prompt: j.prompt, answer: "", askedAt: "", evidence: "" }));
        download(`geo-pending-${data.day}.json`, pending); notice("已发起待采集任务下载；导入时每次提交一条对象。");
      }));
      document.getElementById("db-import").addEventListener("click", handle(async () => {
        const revision = importRevision;
        const raw = document.getElementById("db-import-text").value; if (raw.length > 1024 * 1024) throw new Error("JSON 超过 1 MB");
        const r = await api("/api/daily/import", JSON.parse(raw));
        if (revision === importRevision) { importDirty = false; document.getElementById("db-import-text").value = ""; }
        notice(r.status === "duplicate" ? "该回答已留档，本次未重复计数。" : "已按真实提问日期记录原始回答。收录/引用状态仍未核验。"); await renderBoard(true);
      }));
      document.querySelectorAll("[data-evidence]").forEach(el => el.addEventListener("click", handle(async () => {
        const r = await api(`/api/daily/answer?id=${encodeURIComponent(el.dataset.evidence)}`);
        if (gen !== generation) return;
        const panel = document.getElementById("db-evidence"); panel.hidden = false;
        panel.innerHTML = `<div class="db-panel-head"><h3>原始回答与任务证据</h3>${stateText(STATES[r.status] || r.status)}</div><p>${esc(r.prompt)} · ${esc(r.platform)} / ${esc(r.channel)}</p><p class="db-small">模型 ${esc(r.model || "未记录")} · 提问 ${esc(localTime(r.asked_at))} · SHA-256 ${esc(r.answer_hash || "无回答")}<br>规则 ${esc(r.snapshot.ruleVersion)} · 解析器 ${esc(r.snapshot.parserHash)}</p><pre>${esc(r.answer || "尚未取得有效回答；不会把此任务计为未提及。")}</pre><details><summary>尝试历史和原始载荷</summary><pre>${esc(JSON.stringify(r.attemptHistory, null, 2))}</pre></details>`;
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      })));
    }
    function openSettings() {
      const panel = document.getElementById("db-settings-panel");
      if (!panel) { notice("请先连接本机后台后配置采集。", true); return; }
      settingsOpen = true; panel.setAttribute("open", "");
      document.getElementById("db-configure").setAttribute("aria-expanded", "true");
      panel.scrollIntoView?.({ behavior: "smooth", block: "center" });
    }
    const configure = document.getElementById("db-configure");
    configure.setAttribute("aria-controls", "db-settings-panel"); configure.setAttribute("aria-expanded", "false");
    configure.addEventListener("click", openSettings);
    document.getElementById("db-refresh").addEventListener("click", () => renderBoard());
    dayInput.addEventListener("change", () => renderBoard());
    document.getElementById("db-fullscreen").addEventListener("click", handle(async () => {
      if (!document.fullscreenElement) { if (!document.getElementById("daily-screen").requestFullscreen) throw new Error("当前浏览器不支持网页全屏，可使用浏览器全屏模式。"); await document.getElementById("daily-screen").requestFullscreen(); }
      else await document.exitFullscreen();
    }));
    if (serviceOrigin()) { renderBoard(); timer = setInterval(() => { if (!document.hidden && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) renderBoard(true); }, 30000); }
  };
})();

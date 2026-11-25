/* Operational views. Local records are separate from measured observations. */
(() => {
  "use strict";
  const ops = window.GeoOperations;
  const btn = (label, to, cls = "") => `<button type="button" class="op-btn ${cls}" data-go="${to}">${label}</button>`;
  const empty = s => `<div class="op-empty">${s}</div>`;
  const stamp = s => esc(s ? s.replace("T", " ").replace(/\.\d+Z$/, " UTC") : "未记录");
  const feedback = () => '<p class="op-feedback" id="op-feedback" role="status" aria-live="polite"></p>';
  const header = (name, desc) => `<div class="section-head"><div><span class="op-eyebrow">GEO OPERATIONS</span><h2>${name}</h2><p class="note">${desc}</p></div></div>`;
  const db = () => ops.load(D.store.id);
  function safeView(fn) { try { return fn(db()); } catch (e) { return `<div class="banner danger">${esc(e.message)}</div><p class="note">已有监测数据仍可从导航查看。</p>`; } }
  function download(name, value, type) {
    const url = URL.createObjectURL(new Blob([value], { type })), a = document.createElement("a");
    a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function message(value, error = false) { const el = document.getElementById("op-feedback"); if (el) { el.textContent = value; el.classList.toggle("error", error); } }
  const guard = fn => event => { try { fn(event); } catch (e) { message(e.message, true); } };
  const draftLabel = d => !ops.current(D, d) ? "事实变化 · 需重建" : d.status === "reviewed" ? "人工已审核" : "编辑草稿";
  window.VIEWS.workbench = () => safeView(data => {
    const pending = D.facts.filter(f => f.status !== "arbitrated");
    let auditCount = null;
    try { auditCount = window.SiteAuditStore.load().tasks.filter(t => t.storeId === D.store.id && !["verified", "review_closed"].includes(t.status)).length; } catch { /* Unavailable stays unknown. */ }
    return `${header("运营工作台", `${esc(D.store.display_name)} · 数据快照 ${esc(D.meta.generatedAt)} · 本地运营记录`)}
      <section class="op-hero"><div><span class="op-eyebrow">从用户提问，到可核验的品牌内容</span><h1>让每一步运营，都有依据。</h1><p>围绕门店事实规划提问、整理内容、记录信源，再回到真实 AI 回答验证效果。</p><div class="op-actions">${btn("开始拓展提问 →", "discovery", "primary")}${btn("查看效果观测", "overview")}</div></div><div class="op-hero-aside"><span>当前观测样本</span><strong>${num(D.obsTotal)}<small> 次</small></strong><p>${D.platforms.length} 个平台 · ${num(D.promptTotal)} 条测量词</p><span class="tag">${ops.factSnapshot(D).length} / ${D.facts.length} 项事实已裁定</span></div></section>
      <div class="op-flow">${[["01", "提问洞察", "测量词库与模板候选", "discovery"], ["02", "内容工作室", "事实入稿 · 人工审核", "content"], ["03", "信源台账", "发布计划与人工凭据", "sources"], ["04", "效果验证", "按平台与通道核对回答", "overview"]].map(([n, title, desc, to]) => `<button class="op-flow-step" data-go="${to}"><span>${n}</span><strong>${title}</strong><small>${desc}</small><b aria-hidden="true">↗</b></button>`).join("")}</div>
      <div class="grid g4 op-metrics">${kpi("候选提问", num(data.candidates.length), "模板生成 · 未加入测量词集")}${kpi("内容草稿", num(data.drafts.length), `${data.drafts.filter(d => d.status === "reviewed" && ops.current(D, d)).length} 篇已人工审核`)}${kpi("发布记录", num(data.publications.length), `${data.publications.filter(p => p.status === "manual_published").length} 条人工登记已发布 · 收录未检测`)}${kpi("官网待整改", auditCount === null ? "—" : num(auditCount), auditCount === null ? "诊断历史暂不可读" : "来自官网快照整改任务")}</div>
      <div class="grid g2">${card("平台观测快照", `<div class="op-platforms">${D.platforms.map(p => `<div><span class="op-platform-icon">${esc(p.label.slice(0, 1))}</span><div><strong>${esc(p.label)}</strong><small>${p.endpoint === "api" ? "API" : "网页端"} · ${p.rounds} 轮 · ${p.total} 次</small></div><b>${pct(p.rate)}</b></div>`).join("")}</div><p class="note">各通道分别显示样本 M1；轮次不同，不合并排名。${esc(D.meta.channelNote)}</p>`, "M1 可发现率")}
      ${card("下一步行动", `<div class="op-todos"><div><span class="tag warn">事实</span><p>${pending.length ? `${pending.length} 项待裁定：${esc(pending.map(f => f.label).join("、"))}` : "当前事实已全部裁定"}</p>${btn("查看", "store")}</div><div><span class="tag">内容</span><p>${data.drafts.length ? "继续编辑内容，补齐原始来源并登记审核人。" : "从一条提问开始，创建可编辑的事实简报。"}</p>${btn("创建", "content")}</div><div><span class="tag">官网</span><p>导入官网 HTML 快照，检查页面与已裁定事实。</p>${btn("诊断", "siteaudit")}</div></div>`)}</div>
      <section class="card op-capabilities"><h3>当前能力</h3><p>模板拓词、内容编辑、人工审核和发布台账可本地使用。AI 自动写稿、媒体自动分发、收录检测及云端多账户尚未接入。</p><div class="op-actions"><button class="op-btn" id="op-backup">导出运营备份 JSON</button><label class="op-btn">恢复运营备份<input type="file" accept="application/json,.json" id="op-restore" aria-label="恢复运营备份" style="max-width:190px"></label>${btn("查看观测证据", "collect")}</div><p class="note">存储范围：仅当前浏览器，无云端同步；换电脑、清缓存前必须导出 JSON。可在新电脑空白工作区恢复，现有记录不覆盖；导入草稿需重新审核。</p></section>${feedback()}`;
  });
  window.VIEW_MOUNTS.workbench = () => {
    document.getElementById("op-backup")?.addEventListener("click", guard(() => {
    download(`geo-operations-${D.store.id}.json`, JSON.stringify({ ...db(), exportedAt: new Date().toISOString(), ruleVersion: ops.VERSION }, null, 2), "application/json"); message("已发起下载，请在浏览器下载列表确认。备份包含草稿与发布证据。");
    }));
    document.getElementById("op-restore")?.addEventListener("change", async e => {
      try {
        const file=e.target.files?.[0]; if(!file) return;
        if(file.size>2*1024*1024) throw new Error("备份超过 2 MB。");
        ops.restore(D,await file.text()); go("workbench");
        message("备份已恢复到当前浏览器。导入草稿须重新人工审核，发布记录仅作为历史证据。");
      } catch(err) { message(err.message,true); }
    });
  };
  window.VIEWS.discovery = () => safeView(data => `${header("提问拓展", "按门店项目与意图生成候选问题，审核后另行加入正式采集计划。")}
    <div class="op-split"><section class="card"><h3>拓词范围</h3><form id="op-discover" class="op-form"><label>已建档项目<select id="op-project"><option value="">全部项目</option>${ops.projects(D).map(p => `<option>${esc(p)}</option>`).join("")}</select></label><div class="op-context"><p>城市：${esc(D.store.city)}</p><p>商圈：${esc(D.store.landmark || "未填")}</p></div><label class="op-check"><input id="op-brand" type="checkbox" checked> 包含品牌核验问题</label><p class="note">复用现有中文句式和地域校验。候选问题没有搜索量、热度或推荐概率数据；项目来自建档，仍需人工确认适用范围。</p><button class="op-btn primary">生成候选问题</button></form>${feedback()}</section><section class="card"><div class="card-title"><h3>本轮候选预览</h3><span class="hint" id="op-preview-count">尚未生成</span></div><div id="op-preview">${empty("选择项目并生成候选问题，已存在词条会自动标记。")}</div><button id="op-save-candidates" class="op-btn primary" type="button" hidden>保存本轮新增候选</button></section></div>
    <section class="card op-section"><div class="card-title"><h3>候选问题库</h3><span class="hint">${data.candidates.length} 条 · 独立于 ${D.promptTotal} 条测量词</span></div>${data.candidates.length ? `<div class="table-wrap"><table><thead><tr><th>候选提问</th><th>意图</th><th>建议分母层</th><th>状态</th></tr></thead><tbody>${data.candidates.map(r => `<tr><td>${esc(r.text)}</td><td>${esc(r.intentLabel)}</td><td>${esc(r.denom)}</td><td><span class="tag">待人工选用</span></td></tr>`).join("")}</tbody></table></div>` : empty("尚未保存候选问题。")}<div class="op-actions">${btn("进入内容工作室 →", "content")}${btn("查看正式测量词库", "prompts")}</div></section>`);
  window.VIEW_MOUNTS.discovery = () => {
    const form = document.getElementById("op-discover"); if (!form) return;
    let candidates = [];
    form.addEventListener("submit", guard(e => {
      e.preventDefault(); candidates = ops.generate(D, document.getElementById("op-project").value, document.getElementById("op-brand").checked);
      const known = new Set([...D.prompts, ...db().candidates].map(r => r.text));
      document.getElementById("op-preview-count").textContent = `${candidates.length} 条 · ${candidates.filter(r => !known.has(r.text)).length} 条新增`;
      document.getElementById("op-preview").innerHTML = `<div class="op-preview-list">${candidates.map(r => `<div><span>${esc(r.text)}</span><span class="tag ${known.has(r.text) ? "ghost" : "ok"}">${known.has(r.text) ? "已存在" : esc(r.intentLabel)}</span></div>`).join("")}</div>`;
      document.getElementById("op-save-candidates").hidden = !candidates.some(r => !known.has(r.text)); message("生成完成。新增候选尚未保存，不会改变测量词集。");
    }));
    document.getElementById("op-save-candidates").addEventListener("click", guard(() => {
      ops.addCandidates(D, candidates); go("discovery"); message("候选已保存。可进入内容工作室创建草稿；现有观测分母保持原口径。");
    }));
  };
  window.VIEWS.content = () => safeView(data => {
    const topics = [...D.prompts.map(p => ({ id: `measured:${p.id}`, text: p.text, kind: "测量" })), ...data.candidates.map(p => ({ id: `candidate:${p.id}`, text: p.text, kind: "候选" }))];
    return `${header("内容工作室", "从提问出发，用已裁定事实生成编辑框架；补充来源与回答后由人工审核。")}
      <section class="card"><form id="op-new-draft" class="op-inline-form"><label for="op-topic">关联提问</label><select id="op-topic">${topics.map(p => `<option value="${esc(p.id)}">[${p.kind}] ${esc(p.text)}</option>`).join("")}</select><button class="op-btn primary" ${topics.length ? "" : "disabled"}>创建编辑草稿</button></form><p class="note">模板辅助 · 未调用生成式模型。只填入 ${ops.factSnapshot(D).length} 项已裁定事实，待裁定值不会写入正文。价格、疗效及医学建议由审核人核验。</p>${feedback()}</section>
      <div class="op-split op-section"><section class="card"><div class="card-title"><h3>内容资产</h3><span class="hint">${data.drafts.length} 篇</span></div><div class="op-draft-list">${data.drafts.length ? data.drafts.map(d => `<button class="op-draft-item" data-draft="${esc(d.id)}"><strong>${esc(d.title)}</strong><span class="tag ${d.status === "reviewed" && ops.current(D, d) ? "ok" : "ghost"}">${draftLabel(d)}</span><small>修订 ${d.revision} · ${stamp(d.updatedAt)}</small></button>`).join("") : empty("创建第一篇内容草稿。")}</div></section><section class="card" id="op-editor">${empty("选择左侧草稿进行编辑、导出或人工审核。")}</section></div>`;
  });
  window.VIEW_MOUNTS.content = () => {
    const create = document.getElementById("op-new-draft"); if (!create) return;
    let active = null;
    const show = draftId => {
      const d = db().drafts.find(r => r.id === draftId); if (!d) return;
      active = d.id;
      document.getElementById("op-editor").innerHTML = `<div class="card-title"><h3>编辑内容</h3><span class="tag">${draftLabel(d)} · v${d.revision}</span></div><form class="op-form" id="op-edit-form"><label>标题<input id="op-title" maxlength="200" value="${esc(d.title)}" required></label><label>正文（Markdown）<textarea id="op-body" rows="18" maxlength="30000" required>${esc(d.body)}</textarea></label><div class="op-actions"><button class="op-btn primary">保存修改</button><button class="op-btn" type="button" id="op-export-draft">导出已保存版本</button></div></form><details class="op-fact-details"><summary>草稿事实基线与来源（${d.factSnapshot.length} 项）</summary>${d.factSnapshot.map(f => `<p><b>${esc(f.label)}</b>：${esc(f.value)}<small>裁定：${esc(f.by || "未记录")} · ${esc(f.at || "未记录")}</small></p>`).join("")}<p class="note">规则版本 ${esc(d.ruleVersion)} · ${ops.current(D, d) ? "当前事实基线一致" : "事实基线已变化，请新建草稿"}</p></details><form id="op-review-form" class="op-inline-form"><label for="op-reviewer">实际审核人</label><input id="op-reviewer" maxlength="80" required placeholder="请填写姓名"><button class="op-btn">确认人工审核</button></form><p class="note">${d.review ? `最近审核：${esc(d.review.by)} · 修订 ${d.review.revision} · ${stamp(d.review.at)}` : "审核确认内容、来源和医学表述已经人工核验。编辑修改将作废此前审核。"}</p>`;
      document.querySelectorAll("[data-draft]").forEach(el => el.classList.toggle("selected", el.dataset.draft === active));
      document.getElementById("op-edit-form").addEventListener("submit", guard(e => {
        e.preventDefault(); ops.updateDraft(D, active, { title: document.getElementById("op-title").value, body: document.getElementById("op-body").value }); go("content"); show(active); message("修改已保存；内容变更后需重新审核。");
      }));
      const hasUnsaved = () => { const saved = db().drafts.find(r => r.id === active); return document.getElementById("op-title").value.trim() !== saved.title || document.getElementById("op-body").value.trim() !== saved.body; };
      document.getElementById("op-review-form").addEventListener("submit", guard(e => {
        e.preventDefault(); if (hasUnsaved()) throw new Error("有尚未保存的修改，请先保存后审核。"); ops.approve(D, active, document.getElementById("op-reviewer").value); go("content"); show(active); message("已登记人工审核，可到信源台账安排发布。审核不等于平台收录。");
      }));
      document.getElementById("op-export-draft").addEventListener("click", guard(() => {
        if (hasUnsaved()) throw new Error("有尚未保存的修改，请先保存后导出。"); const saved = db().drafts.find(r => r.id === active); download(`geo-draft-${saved.id}.md`, ops.markdown(saved), "text/markdown;charset=utf-8"); message("已发起草稿下载，请在浏览器下载列表确认。");
      }));
    };
    create.addEventListener("submit", guard(e => { e.preventDefault(); const d = ops.createDraft(D, document.getElementById("op-topic").value); go("content"); show(d.id); message("编辑草稿已创建，请补充回答和可核验来源。"); }));
    document.querySelector(".op-draft-list").addEventListener("click", guard(e => { const el = e.target.closest("[data-draft]"); if (el) show(el.dataset.draft); }));
    if (db().drafts.length) show(db().drafts[0].id);
  };
  window.VIEWS.sources = () => safeView(data => {
    const reviewed = data.drafts.filter(d => d.status === "reviewed" && ops.current(D, d));
    return `${header("信源台账", "记录经过审核的内容发布计划与人工凭据；后续在采集观测中单独核验 AI 引用。")}
      <div class="op-split"><section class="card"><h3>新增发布记录</h3><form id="op-publication" class="op-form"><label>已审核内容<select id="op-pub-draft" required>${reviewed.length ? reviewed.map(d => `<option value="${esc(d.id)}">${esc(d.title)} · v${d.revision}</option>`).join("") : '<option value="">请先完成内容审核</option>'}</select></label><label>发布渠道<input id="op-channel" maxlength="80" required placeholder="例如：品牌官网 / 公众号"></label><label>登记人<input id="op-owner" maxlength="80" required placeholder="实际执行人"></label><label>记录状态<select id="op-pub-status"><option value="planned">待发布计划</option><option value="manual_published">人工登记已发布</option></select></label><label>公开链接<input id="op-pub-url" type="url" maxlength="2000" placeholder="https://..."></label><label>发布凭据说明<textarea id="op-pub-evidence" maxlength="2000" rows="3" placeholder="发布人、时间、后台回执或证据文件编号；不填登录凭证"></textarea></label><button class="op-btn primary" ${reviewed.length ? "" : "disabled"}>保存发布记录</button></form>${feedback()}</section>
      <section class="card"><h3>信源与效果分别核验</h3><ol class="op-guide"><li><b>先确认内容</b><p>标题、正文和事实基线通过人工审核，台账保留发布时的内容版本。</p></li><li><b>再登记发布</b><p>发布仍在对应平台完成；在此记录计划，或用公开链接与凭据登记发布结果。</p></li><li><b>最后采集回答</b><p>发布成功不代表被收录或引用。保留平台、通道、时间和原始回答，按现有口径观察。</p></li></ol><div class="op-actions">${btn("内容工作室", "content")}${btn("采集观测", "collect")}</div><p class="note">本页面未连接媒体分发、收录检测或平台引用查询接口。登记链接不会触发外部网络请求。</p></section></div>
      <section class="card op-section"><div class="card-title"><h3>发布记录</h3><span class="hint">${data.publications.length} 条 · 保留修订快照</span></div>${data.publications.length ? `<div class="op-publications">${data.publications.map(p => `<article><div class="op-actions"><strong>${esc(p.snapshot.title)}</strong><span class="tag ${p.status === "manual_published" ? "ok" : "ghost"}">${p.status === "manual_published" ? "人工登记已发布" : "待发布"}</span><span class="tag ghost">收录 / AI 引用未检测</span></div><p>${esc(p.channel)} · 修订 ${p.revision} · 登记人 ${esc(p.owner)} · ${stamp(p.recordedAt)}</p><p class="op-url">${esc(p.url || "尚无公开链接")}</p><details><summary>查看发布凭据与内容快照</summary><p>${esc(p.evidence || "计划记录，尚无发布凭据")}</p><p class="note">审核：${esc(p.snapshot.review.by)} · ${stamp(p.snapshot.review.at)}</p><pre>${esc(p.snapshot.body)}</pre></details></article>`).join("")}</div>` : empty("暂无发布记录。先创建内容并完成人工审核。")}</section>`;
  });
  window.VIEW_MOUNTS.sources = () => document.getElementById("op-publication")?.addEventListener("submit", guard(e => {
    e.preventDefault(); ops.addPublication(D, { draftId: document.getElementById("op-pub-draft").value, channel: document.getElementById("op-channel").value,
      owner: document.getElementById("op-owner").value, status: document.getElementById("op-pub-status").value, url: document.getElementById("op-pub-url").value, evidence: document.getElementById("op-pub-evidence").value });
    go("sources"); message("发布记录已保存，保留此刻内容与审核快照。收录和 AI 引用仍为未检测。");
  }));
})();

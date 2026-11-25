/* Local operational drafts. Template source: geomon/prompts.py.
 * Content outline informed by claude-seo 2.6.2 MIT; see THIRD_PARTY_NOTICES.md.
 * Operational records never alter exported measurements or their denominators. */
(() => {
  "use strict";
  const VERSION = "operations-1.0.0";
  const templates = {
    nearby: [["{landmark}附近哪里可以做{项目}", "landmark"], ["{项目}附近哪里可以做", "none"]],
    which_best: [["{城市}{项目}哪家好", "city"], ["{项目}哪家做得比较好", "none"]],
    which_regular: [["{城市}{项目}哪家正规", "city"], ["{项目}哪家是正规机构", "none"]],
    price: [["{城市}做{项目}大概多少钱", "city"], ["{项目}价格大概多少", "none"]],
    verify: [["{项目}怎么验真", "none"], ["怎么查{项目}是不是正品", "none"]],
    pain: [["做{项目}痛不痛", "none"], ["{项目}疼不疼", "none"]],
    recovery: [["{项目}恢复期多久", "none"], ["做完{项目}几天能见人", "none"]],
  };
  const labels = { nearby: "附近有没有", which_best: "哪家好", which_regular: "哪家正规", price: "多少钱", verify: "怎么验真", pain: "痛不痛", recovery: "恢复期", brand: "品牌核验" };
  const denoms = { verify: "verification", pain: "knowledge", recovery: "knowledge", brand: "brand" };
  const text = (s, max = 1000) => String(s ?? "").trim().slice(0, max);
  const now = () => new Date().toISOString();
  const id = () => window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const key = storeId => `geomon.operations.v1.${encodeURIComponent(storeId)}`;
  function load(storeId) {
    let raw;
    try { raw = localStorage.getItem(key(storeId)); } catch { throw new Error("本地存储被禁用，运营数据无法读取。请允许本站存储后重试。"); }
    if (!raw) return { version: 1, storeId, candidates: [], drafts: [], publications: [] };
    let db;
    try { db = JSON.parse(raw); } catch { throw new Error("运营记录损坏，未覆盖原数据。请先备份浏览器站点数据。"); }
    return validate(db, storeId);
  }
  function validate(db, storeId) {
    if (!db || db.version !== 1 || db.storeId !== storeId || ![db.candidates, db.drafts, db.publications].every(Array.isArray) ||
      !db.candidates.every(r => r && typeof r.text === "string" && typeof r.id === "string") ||
      !db.drafts.every(r => r && typeof r.id === "string" && typeof r.body === "string" && typeof r.title === "string" && Array.isArray(r.factSnapshot)) ||
      !db.publications.every(r => r && typeof r.id === "string" && r.snapshot && typeof r.snapshot.title === "string"))
      throw new Error("运营记录格式不兼容，未覆盖原数据。请先备份。");
    return db;
  }
  function restore(data, raw) {
    if (typeof raw !== "string" || new TextEncoder().encode(raw).length > 2 * 1024 * 1024) throw new Error("备份超过 2 MB 或格式无效。");
    let incoming;
    try { incoming = JSON.parse(raw); } catch { throw new Error("备份不是有效 JSON，未修改现有记录。"); }
    validate(incoming, data.store.id);
    if (incoming.drafts.some(d => !d.topic || typeof d.topic.text !== "string" || !Number.isInteger(d.revision) ||
        !d.factSnapshot.every(f => f && typeof f.key === "string" && typeof f.value === "string")) ||
        incoming.publications.some(p => typeof p.snapshot.body !== "string" || !p.snapshot.topic || !Array.isArray(p.snapshot.factSnapshot)))
      throw new Error("备份缺少草稿/发布快照必需字段，未修改现有记录。");
    for (const rows of [incoming.candidates,incoming.drafts,incoming.publications])
      if (new Set(rows.map(r=>r.id)).size !== rows.length) throw new Error("备份包含重复编号，未恢复。");
    const currentDb = load(data.store.id);
    if (currentDb.candidates.length || currentDb.drafts.length || currentDb.publications.length) throw new Error("当前已有运营记录，未覆盖或合并。请先导出，并在空白工作区恢复备份。");
    const next = { version: 1, storeId: data.store.id,
      candidates: incoming.candidates,
      drafts: incoming.drafts.map(d => ({ ...d, status: "draft", review: null, restoredAt: now() })),
      publications: incoming.publications.map(p => ({ ...p, measurementStatus: "not_checked", provenance: "restored_backup", restoredAt: now() })) };
    // Imported approvals are historical evidence, never a new approval to publish.
    save(next); return next;
  }
  function save(db) {
    const raw = JSON.stringify(db);
    if (new TextEncoder().encode(raw).length > 2 * 1024 * 1024) throw new Error("运营记录超过 2 MB，未保存。请导出留档；本轮不自动删除历史。");
    try { localStorage.setItem(key(db.storeId), raw); } catch { throw new Error("本地存储空间不足或被禁用，本次修改未保存。请保留编辑框内容。"); }
    return db;
  }
  function projects(data) { return [...new Set(String(data.store.services || "").split(/[;；]/).map(s => s.trim()).filter(Boolean))]; }
  function generate(data, project = "", includeBrand = true) {
    const allowed = projects(data);
    if (project && !allowed.includes(project)) throw new Error("请选择门店已建档的项目。");
    const rows = [], seen = new Set();
    const add = (phrase, intent, service, region) => {
      const { city, landmark } = data.store;
      if (phrase.length < 4 || /\{城市\}|\{landmark\}|\{项目\}/.test(phrase) || seen.has(phrase)) return;
      if (city && landmark && phrase.includes(city) && phrase.includes(landmark)) return;
      if (city && phrase.includes(city) && /附近|哪里/.test(phrase)) return;
      seen.add(phrase);
      rows.push({ text: phrase, intent, intentLabel: labels[intent], project: service, region,
        denom: denoms[intent] || "store_answerable", origin: "local-template", ruleVersion: VERSION });
    };
    for (const service of project ? [project] : allowed) for (const [intent, list] of Object.entries(templates)) for (const [tpl, region] of list) {
      if (region === "landmark" && !data.store.landmark) continue;
      add(tpl.replaceAll("{城市}", data.store.city || "").replaceAll("{landmark}", data.store.landmark || "").replaceAll("{项目}", service), intent, service, region);
    }
    if (includeBrand) for (const suffix of ["正规吗", "是哪家公司", "有几家店", "怎么样", "靠谱吗", "投诉", "是正规机构吗", "地址在哪", "是连锁的吗", "创始人是谁"])
      add(`${data.store.brand_name}${suffix}`, "brand", "", "none");
    return rows;
  }
  function addCandidates(data, rows) {
    const db = load(data.store.id), known = new Set([...data.prompts, ...db.candidates].map(r => r.text));
    // Recompute allowed templates instead of trusting caller-supplied classifications.
    const allowed = new Map(generate(data).map(r => [r.text, r]));
    for (const r of rows) if (!known.has(r.text) && allowed.has(r.text)) {
      db.candidates.push({ ...allowed.get(r.text), id: id(), createdAt: now(), status: "candidate" }); known.add(r.text);
    }
    return save(db);
  }
  function factSnapshot(data) {
    return data.facts.filter(f => f.status === "arbitrated" && text(f.expected)).map(f => ({
      key: f.key, label: f.label, value: f.expected, by: f.by, at: f.at,
    })).sort((a, b) => a.key.localeCompare(b.key));
  }
  const current = (data, draft) => JSON.stringify(factSnapshot(data)) === JSON.stringify(draft.factSnapshot);
  function createDraft(data, topicId) {
    const db = load(data.store.id);
    const topic = [...data.prompts.map(r => ({ ...r, topicId: `measured:${r.id}` })), ...db.candidates.map(r => ({ ...r, topicId: `candidate:${r.id}` }))].find(r => r.topicId === topicId);
    if (!topic) throw new Error("请选择已建档词条或已保存候选词。");
    const facts = factSnapshot(data);
    const body = `# ${topic.text}\n\n## 回答摘要\n【待补：针对本问题提供有依据的直接回答，不承诺疗效或推荐名次】\n\n## 已确认的门店信息\n${facts.map(f => `- ${f.label}：${f.value}`).join("\n") || "【待补：门店事实尚未裁定】"}\n\n## 解释与核验方法\n【待补：核对项目适用范围、信息来源及核验步骤；医学内容须专业审核】\n\n## 来源与更新时间\n【待补：提供可公开核验的来源链接、作者与更新日期】`;
    const draft = { id: id(), title: topic.text, body, topic: { id: topicId, text: topic.text, denom: topic.denom },
      factSnapshot: facts, ruleVersion: VERSION, revision: 1, status: "draft", review: null, createdAt: now(), updatedAt: now() };
    db.drafts.unshift(draft); save(db); return draft;
  }
  function updateDraft(data, draftId, patch) {
    const db = load(data.store.id), d = db.drafts.find(r => r.id === draftId);
    if (!d) throw new Error("草稿不存在。");
    const title = text(patch.title, 200), body = text(patch.body, 30000);
    if (!title || !body) throw new Error("标题和正文不能为空。");
    if (title !== d.title || body !== d.body) { d.title = title; d.body = body; d.revision++; d.status = "draft"; d.review = null; d.updatedAt = now(); }
    save(db); return d;
  }
  function approve(data, draftId, reviewer) {
    const db = load(data.store.id), d = db.drafts.find(r => r.id === draftId);
    if (!d) throw new Error("草稿不存在。");
    if (!current(data, d)) throw new Error("事实基线已变化，请基于当前事实新建草稿并重新审核。");
    if (!text(reviewer, 80)) throw new Error("请填写实际审核人。");
    if (/【待补[：:]/.test(d.body)) throw new Error("正文仍含待补内容，请编辑完善并保存后审核。");
    d.status = "reviewed"; d.review = { by: text(reviewer, 80), at: now(), revision: d.revision }; d.updatedAt = now();
    save(db); return d;
  }
  function publicUrl(value) {
    let u;
    try { u = new URL(value); } catch { throw new Error("请输入完整的 http(s) 公开链接。"); }
    if (!["https:", "http:"].includes(u.protocol) || u.username || u.password) throw new Error("链接仅支持不含账号密码的 http(s) 地址。");
    return u.href;
  }
  function addPublication(data, fields) {
    const db = load(data.store.id), d = db.drafts.find(r => r.id === fields.draftId);
    if (!d || d.status !== "reviewed" || d.review?.revision !== d.revision || !current(data, d)) throw new Error("请先完成人工内容审核，并确认事实基线未变化。");
    const channel = text(fields.channel, 80), owner = text(fields.owner, 80);
    if (!channel || !owner) throw new Error("请填写发布渠道和登记人。");
    const published = fields.status === "manual_published";
    if (!["planned", "manual_published"].includes(fields.status)) throw new Error("发布状态无效。");
    const url = fields.url ? publicUrl(text(fields.url, 2000)) : "";
    if (published && (!url || !text(fields.evidence, 2000))) throw new Error("登记已发布需要公开链接和人工发布凭据说明。");
    const row = { id: id(), draftId: d.id, revision: d.revision, channel, owner, status: fields.status, url,
      evidence: text(fields.evidence, 2000), recordedAt: now(), measurementStatus: "not_checked",
      snapshot: { title: d.title, body: d.body, review: d.review, factSnapshot: d.factSnapshot, topic: d.topic, ruleVersion: d.ruleVersion } };
    db.publications.unshift(row); save(db); return row;
  }
  function markdown(d) {
    return `<!-- 门店内容草稿；${d.ruleVersion}；修订 ${d.revision}；${d.status === "reviewed" ? "人工已审核" : "待审核"} -->\n\n${d.body}\n\n---\n标题：${d.title}\n关联提问：${d.topic.text}\n生成时间：${d.createdAt}\n审核人：${d.review?.by || "未审核"}\n\n事实基线：\n${d.factSnapshot.map(f => `- ${f.label}：${f.value}（裁定：${f.by || "未记录"}；${f.at || "未记录"}）`).join("\n")}\n`;
  }
  window.GeoOperations = { VERSION, labels, key, load, restore, projects, generate, addCandidates, factSnapshot, current, createDraft, updateDraft, approve, publicUrl, addPublication, markdown };
})();

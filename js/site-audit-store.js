/* Snapshot/rectification storage is separate from GEO observations and data.js. */
(() => {
  "use strict";
  const KEY = "geomon.site-audits.v1";
  const MAX_STORAGE_BYTES = 2 * 1024 * 1024;
  function load() {
    let raw;
    try { raw = localStorage.getItem(KEY); } catch { throw new Error("浏览器未允许本地存储。仍可诊断并导出结果，但历史和任务无法保存。"); }
    if (!raw) return { version: 1, runs: [], tasks: [] };
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("本地诊断历史损坏，未覆盖原数据。请先备份浏览器站点数据。"); }
    if (value.version !== 1 || !Array.isArray(value.runs) || !Array.isArray(value.tasks)) throw new Error("本地诊断历史格式不兼容，未覆盖原数据。");
    return value;
  }
  function save(value) {
    const text = JSON.stringify(value);
    if (new TextEncoder().encode(text).length > MAX_STORAGE_BYTES) throw new Error("诊断历史超过 2 MB。请导出留档并在历史中清理旧快照后重试，本次结果尚未保存。");
    try { localStorage.setItem(KEY, text); }
    catch { throw new Error("本地存储空间不足或写入被禁用。本次结果尚未保存，请先导出留档。"); }
    return value;
  }
  function addRun(report) {
    const db = load();
    if (db.runs.some(r => r.id === report.id)) return db;
    // Only a checked, explicit pass can verify a task. Missing/skipped != fixed.
    const checked = new Map(report.checks.map(c => [c.id, c]));
    const stamp = report.capturedAt;
    db.tasks = db.tasks.map(task => {
      if (task.status !== "awaiting_recheck" || task.storeId !== report.storeId || task.url !== report.url || task.mode !== report.mode || task.ruleVersion !== report.ruleVersion || task.createdAt > stamp)
        return task;
      if (task.module === "store_facts" && (!report.factBaselineHash || task.factBaselineHash !== report.factBaselineHash)) return task;
      if (checked.get(task.ruleId)?.status !== "pass") return task;
      return { ...task, status: "verified", verifiedAt: stamp, verifiedByRun: report.id, updatedAt: stamp };
    });
    db.runs.unshift(report);
    return save(db);
  }
  function createTask(reportId, ruleId) {
    const db = load(), report = db.runs.find(r => r.id === reportId);
    const finding = report?.findings.find(f => f.id === ruleId);
    if (!report || !finding) throw new Error("请先保存诊断结果，再建立整改任务。");
    const existing = db.tasks.find(t => t.storeId === report.storeId && t.url === report.url && t.mode === report.mode && t.ruleId === ruleId && t.ruleVersion === report.ruleVersion && (finding.module !== "store_facts" || t.factBaselineHash === report.factBaselineHash) && ["open", "in_progress", "awaiting_recheck"].includes(t.status));
    if (existing) return db;
    db.tasks.unshift({ id: SiteAuditEngine.uid(), storeId: report.storeId, mode: report.mode,
      url: report.url, ruleVersion: report.ruleVersion, ruleId, module: finding.module,
      factBaselineHash: report.factBaselineHash, title: finding.title, recommendation: finding.recommendation,
      evidence: finding.evidence, sourceRunId: report.id, status: "open", owner: "", note: "",
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return save(db);
  }
  function updateTask(id, patch) {
    const db = load(), task = db.tasks.find(t => t.id === id);
    if (!task) throw new Error("整改任务不存在。");
    const next = patch.status || task.status;
    const transitions = { open: ["open", "in_progress", "awaiting_recheck", "review_closed"], in_progress: ["in_progress", "open", "awaiting_recheck", "review_closed"], awaiting_recheck: ["awaiting_recheck", "open", "in_progress", "review_closed"], verified: ["verified", "open"], review_closed: ["review_closed", "open"] };
    if (!transitions[task.status]?.includes(next)) throw new Error("已验证状态由同页复检产生，请先改为待复检并导入新快照。");
    if (next === "review_closed" && !String(patch.note ?? task.note).trim()) throw new Error("人工复核关闭需要填写关闭理由，不会标为复检通过。");
    task.owner = String(patch.owner ?? task.owner).slice(0, 60);
    task.note = String(patch.note ?? task.note).slice(0, 500);
    task.status = next;
    task.updatedAt = new Date().toISOString();
    if (next !== "verified") { delete task.verifiedAt; delete task.verifiedByRun; }
    return save(db);
  }
  function removeRun(id) {
    const db = load();
    if (db.tasks.some(t => t.sourceRunId === id || t.verifiedByRun === id)) throw new Error("此快照关联整改或复检证据，请保留。可清理未关联任务的旧快照。");
    db.runs = db.runs.filter(r => r.id !== id);
    return save(db);
  }
  window.SiteAuditStore = { load, addRun, createTask, updateTask, removeRun, KEY };
})();

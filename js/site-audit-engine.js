/* Selected deterministic checks adapted from AgriciDaniel/claude-seo (MIT).
 * Upstream 468ed5b0d9e3249394783710e54abb02837e326b, scripts/page_checks.py.
 * See ../../THIRD_PARTY_NOTICES.md. Browser snapshot adapter; no remote fetches.
 */
(() => {
  "use strict";
  const VERSION = "snapshot-1.0.0";
  const UPSTREAM = "468ed5b0d9e3249394783710e54abb02837e326b";
  const MAX_BYTES = 512 * 1024;
  const SEVERITY = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
  const LABELS = {
    license_name: "机构第一名称", address: "标准地址", phone: "联系电话",
    open_hours: "营业时间", subjects: "核准科目", license_no: "许可证号",
    booking_entry: "预约方式", org_type: "机构类别",
  };
  const clip = (s, n = 300) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, n);
  const normal = s => String(s ?? "").normalize("NFKC").toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");
  const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function normalizeUrl(raw, base) {
    const u = new URL(String(raw).trim(), base);
    if (!["http:", "https:"].includes(u.protocol) || !u.hostname || u.username || u.password)
      throw new Error("请填写完整的 http:// 或 https:// 页面地址，且不要包含账号密码。");
    u.hash = "";
    for (const key of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|msclkid$)/i.test(key)) u.searchParams.delete(key);
    }
    u.searchParams.sort();
    return u.href;
  }

  function plainText(root) {
    const copy = root.cloneNode(true);
    copy.querySelectorAll("script,style,template,noscript,title,meta,link,svg,[hidden],[aria-hidden='true']").forEach(n => n.remove());
    copy.querySelectorAll("[style]").forEach(n => {
      if (/display\s*:\s*none|visibility\s*:\s*hidden/i.test(n.getAttribute("style"))) n.remove();
    });
    // Block boundaries must separate adjacent labels/values when source has no whitespace.
    copy.querySelectorAll("p,div,li,br,h1,h2,h3,h4,h5,h6,td,section,footer,address").forEach(n => n.append(" "));
    return clip([...copy.childNodes].map(n => n.textContent || "").join(" "), MAX_BYTES);
  }

  function phoneNormal(value) {
    const digits = String(value ?? "").replace(/\D/g, "");
    return digits.startsWith("0086") ? digits.slice(4) : digits.startsWith("86") && digits.length > 11 ? digits.slice(2) : digits;
  }

  function schemaValue(value, byId) {
    if (value && typeof value === "object" && !Array.isArray(value) && value["@id"] && Object.keys(value).length === 1)
      return byId.get(value["@id"]) || value;
    return value;
  }

  function scalar(value, byId) {
    value = schemaValue(value, byId);
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map(v => scalar(v, byId)).filter(Boolean).join("; ");
    if (value && typeof value === "object") {
      if (value["@value"] !== undefined) return String(value["@value"]);
      if (value.value !== undefined) return scalar(value.value, byId);
      if (value.streetAddress) return [value.addressRegion, value.addressLocality, value.streetAddress].map(v => scalar(v, byId)).filter(Boolean).join("");
      if (value.opens) return [value.dayOfWeek, `${value.opens}-${value.closes || "?"}`].map(v => scalar(v, byId)).join(" ");
      return scalar(value.name || value.url || "", byId);
    }
    return "";
  }

  async function digest(value) {
    if (!globalThis.crypto?.subtle) return null;
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function inspect({ html, url, store, facts, mode = "imported", sourceLabel = "粘贴源码" }) {
    if (typeof html !== "string" || !html.trim()) throw new Error("请先上传 HTML 文件或粘贴网页源码。");
    const bytes = new TextEncoder().encode(html).length;
    if (bytes > MAX_BYTES) throw new Error("快照超过 512 KB，请导出单个页面的 HTML 后重试。");
    if (!/<(?:!doctype|html|head|body|main|div|p|h1|title|meta|script|section|article|footer|address|span)\b/i.test(html))
      throw new Error("没有识别到 HTML 标签，请导入网页源码，而不是只有正文的文本。");
    if (!store?.id) throw new Error("缺少门店身份，请先加载门店数据。");
    url = normalizeUrl(url);
    // Unlike DOMParser documents, template content is inert, including images/frames.
    // Never append imported nodes to the live DOM. Only extract strings.
    const template = document.createElement("template");
    template.innerHTML = html;
    const root = template.content;
    const checks = [];
    function add(id, module, status, severity, title, evidence, recommendation = "") {
      checks.push({ id, module, status, severity, title, evidence: clip(evidence), recommendation,
        measurementKind: "rule_check", verification: "使用修改后的同一页面 HTML 快照复检。" });
    }
    function check(id, module, ok, severity, title, evidence, recommendation) {
      add(id, module, ok ? "pass" : "fail", severity, title, evidence, recommendation);
    }
    const titles = [...root.querySelectorAll("title")].filter(n => !n.closest("svg"));
    const title = clip(titles[0]?.textContent, 2000);
    const metas = [...root.querySelectorAll("meta")];
    const meta = name => metas.find(n => (n.getAttribute("name") || "").toLowerCase() === name)?.getAttribute("content")?.trim() || "";
    const description = meta("description");
    const headings = [...root.querySelectorAll("h1")].filter(n => !n.closest("[hidden],[aria-hidden='true']")).map(n => clip(n.textContent));
    check("missing-title", "page_metadata", !!title, "High", "页面标题", title || "未发现非空 title", "为页面设置描述门店及本页用途的独立标题。");
    add("title-too-long", "page_metadata", !title ? "not_checked" : title.length <= 60 ? "pass" : "fail", "Low", "标题展示长度", title ? `${title.length} 字符；60 字符仅为显示启发式` : "标题缺失，无法检查长度", "压缩重复词，保留页面主题；这不是搜索引擎硬性上限。");
    check("missing-meta-description", "page_metadata", !!description, "Medium", "页面描述", description || "未发现非空 meta description", "补充简明、与正文一致的页面描述。");
    add("meta-description-too-long", "page_metadata", !description ? "not_checked" : description.length <= 160 ? "pass" : "fail", "Low", "描述展示长度", description ? `${description.length} 字符；160 字符仅为显示启发式` : "描述缺失，无法检查长度", "精简模板描述，突出本页事实。");
    check("missing-h1", "page_metadata", headings.length > 0, "Medium", "页面主标题", headings.join(" / ") || "未发现非空 H1", "为主体内容设置清楚的主标题。");
    check("multiple-h1", "page_metadata", headings.length <= 1, "Low", "主标题层级复核", `${headings.length} 个 H1；多个 H1 本身不等于搜索处罚`, "检查主标题是否清楚表达页面用途，按内容层次组织标题。");
    const canonicalLinks = [...root.querySelectorAll("link")].filter(n => (n.getAttribute("rel") || "").toLowerCase().split(/\s+/).includes("canonical"));
    const duplicates = titles.length > 1 || canonicalLinks.length > 1 || metas.filter(n => (n.getAttribute("name") || "").toLowerCase() === "description").length > 1;
    check("duplicate-meta-tags", "page_metadata", !duplicates, "Medium", "重复标题或元信息", `title ${titles.length} 个，canonical ${canonicalLinks.length} 个`, "每页保留一套明确的 title、description 和 canonical。");
    let base = url;
    try { base = normalizeUrl(root.querySelector("base[href]")?.getAttribute("href") || url, url); } catch { /* fall back to supplied URL */ }
    let canonical = "";
    try { if (canonicalLinks[0]?.getAttribute("href")) canonical = normalizeUrl(canonicalLinks[0].getAttribute("href"), base); } catch { /* invalid canonical is a finding */ }
    check("missing-canonical", "page_metadata", !!canonical, "Medium", "规范页面地址", canonical || "未发现有效的 canonical 地址", "设置正确的绝对规范地址，避免指向错误分店或其他页面。");
    const comparable = value => value.replace(/\/$/, "");
    add("canonical-points-elsewhere", "page_metadata", !canonical ? "not_checked" : comparable(canonical) === comparable(url) ? "pass" : "fail", "High", "规范地址指向", canonical ? `${canonical}；当前 ${url}` : "canonical 缺失，无法比较", "核实差异是否有意，必要时修正规范地址。");
    const robots = metas.filter(n => ["robots", "googlebot"].includes((n.getAttribute("name") || "").toLowerCase())).map(n => n.getAttribute("content") || "").join(", ");
    check("noindex", "page_metadata", !/(?:^|[\s,;])(noindex|none)(?:$|[\s,;])/i.test(robots), "Critical", "HTML 索引指令", robots || "HTML 未声明 noindex；响应头和 robots.txt 未检查", "若此页应公开索引，检查并移除非预期的 noindex/none。");
    check("missing-viewport", "page_metadata", !!meta("viewport"), "Low", "移动端视口", meta("viewport") || "未发现 viewport", "添加适当的 viewport 设置，并实际检查移动端布局。");
    const images = [...root.querySelectorAll("img[src],img[data-src]")].filter(n => !n.closest("[hidden],[aria-hidden='true']") && !["presentation", "none"].includes(n.getAttribute("role")));
    const missingAlt = images.filter(n => !n.hasAttribute("alt"));
    check("images-missing-alt", "page_metadata", !missingAlt.length, "Medium", "图像替代文本", `${missingAlt.length}/${images.length} 张图片缺 alt；空 alt 允许用于装饰图`, "为有信息的图像补充替代文本，装饰图可使用空 alt。");
    for (const [id, label] of [["noindex-header", "HTTP 响应头"], ["robots-txt", "robots.txt 与 AI 爬虫策略"], ["rendered-dom", "JavaScript 渲染后内容"], ["performance", "真实性能与 Core Web Vitals"]])
      add(id, "coverage", "not_checked", "Info", label, "当前只分析导入的 HTML 快照，不具备该项测量证据。");
    add("chinese-content-quality", "coverage", "not_checked", "Info", "中文语义质量与医疗专业性", "需人工复核；本轮不使用英文词数、AI 文风检测或模型评分。");

    const jsonNodes = [], schemaErrors = [], types = new Set(), byId = new Map();
    const scripts = [...root.querySelectorAll("script")].filter(n => (n.getAttribute("type") || "").trim().toLowerCase() === "application/ld+json");
    let traversalPartial = false;
    scripts.forEach((n, index) => {
      try {
        const value = JSON.parse(n.textContent);
        if (!value || typeof value !== "object") throw new Error("JSON-LD 顶层必须是对象或数组");
        const stack = [{ value, pointer: `/blocks/${index}` }];
        let visited = 0;
        while (stack.length) {
          if (++visited > 3000) { traversalPartial = true; break; }
          const item = stack.pop(), v = item.value;
          if (!v || typeof v !== "object") continue;
          if (Array.isArray(v)) { v.forEach((child, i) => stack.push({ value: child, pointer: `${item.pointer}/${i}` })); continue; }
          if (v["@type"]) {
            const nodeTypes = [v["@type"]].flat().filter(t => typeof t === "string").map(t => t.replace(/^https?:\/\/schema.org\//, ""));
            nodeTypes.forEach(t => types.add(t));
            jsonNodes.push({ node: v, pointer: item.pointer, types: nodeTypes });
          }
          if (typeof v["@id"] === "string" && Object.keys(v).length > 1) byId.set(v["@id"], v);
          for (const [key, child] of Object.entries(v)) {
            if (key !== "@context" && child && typeof child === "object") stack.push({ value: child, pointer: `${item.pointer}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}` });
          }
        }
      } catch (e) { schemaErrors.push(`第 ${index + 1} 块：${clip(e.message, 140)}`); }
    });
    check("jsonld-present", "schema", scripts.length > 0, "Medium", "JSON-LD 结构化信息", `${scripts.length} 个 JSON-LD 块`, "按真实门店资料添加适用的 LocalBusiness 或 MedicalClinic 信息。");
    add("invalid-jsonld", "schema", !scripts.length ? "not_checked" : schemaErrors.length ? "fail" : "pass", "High", "JSON-LD 语法", schemaErrors.join("；") || (scripts.length ? "JSON 解析成功；不代表完整 Schema.org 或 Google 富结果验证" : "无 JSON-LD，无法校验语法"), "修复无效 JSON；不要把模板表达式当作已发布的合法结构化数据。");
    add("jsonld-traversal", "schema", traversalPartial || schemaErrors.length ? "not_checked" : "pass", "Info", "结构化实体遍历", traversalPartial || schemaErrors.length ? "部分结构化信息未完整解析，不能确认全部实体" : `已提取 ${jsonNodes.length} 个带类型实体`);
    const exactNames = new Set([store.license_name, store.display_name].filter(Boolean).map(normal));
    const localTypes = new Set(["LocalBusiness", "MedicalClinic", "MedicalBusiness", "Hospital", "Dentist", "Organization", "HealthAndBeautyBusiness", "BeautySalon"]);
    const candidates = jsonNodes.filter(v => v.types.some(t => localTypes.has(t)) && [v.node.name, v.node.legalName].some(n => typeof n === "string" && exactNames.has(normal(n))));
    add("store-schema-identity", "schema", candidates.length ? "pass" : "not_checked", "Info", "本店结构化实体定位", candidates.length ? `${candidates.length} 个实体的名称与机构第一名称或展示名精确匹配` : "未精确识别本店实体；其他机构或分店不自动归属本店");
    const text = plainText(root);
    const normalizedText = normal(text);
    const observed = {};
    const factBaseline = (facts || []).map(f => ({ key: f.key, expected: f.expected, status: f.status })).sort((a, b) => a.key.localeCompare(b.key));
    for (const fact of factBaseline) {
      const id = `store-fact-${fact.key}`, label = LABELS[fact.key] || fact.key;
      if (fact.status !== "arbitrated" || !fact.expected) {
        add(id, "store_facts", "not_checked", "Info", label, "标准值尚未裁定，本轮不判定正确或冲突。");
        continue;
      }
      let values = [];
      for (const candidate of candidates) {
        const n = candidate.node;
        // A brand/display name is not a conflicting legal name.
        const value = ({ license_name: n.legalName || (normal(n.name) === normal(fact.expected) ? n.name : null), address: n.address, phone: n.telephone,
          open_hours: n.openingHoursSpecification || n.openingHours, license_no: n.identifier,
          subjects: n.medicalSpecialty, booking_entry: n.potentialAction, org_type: null })[fact.key];
        const rendered = scalar(value, byId);
        const field = { license_name: n.legalName ? "legalName" : "name", address: "address", phone: "telephone", open_hours: n.openingHoursSpecification ? "openingHoursSpecification" : "openingHours", license_no: "identifier", subjects: "medicalSpecialty", booking_entry: "potentialAction" }[fact.key] || fact.key;
        if (rendered) values.push({ value: rendered, pointer: `${candidate.pointer}/${field}` });
      }
      const expected = String(fact.expected);
      const isPhone = fact.key === "phone";
      const matches = v => isPhone ? phoneNormal(v) === phoneNormal(expected) : normal(v) === normal(expected);
      // Hours/specialties/actions need semantic normalization. Never label them a conflict by substring.
      const exactFields = ["license_name", "address", "phone", "license_no"];
      const conflict = exactFields.includes(fact.key) && values.some(v => !matches(v.value));
      let bodyMatch;
      if (isPhone) {
        const phones = text.match(/(?<!\d)(?:\+?86[\s-]*)?(?:0\d{2,3}[\s-]?\d{7,8}|1[3-9]\d{9}|400[\s-]?\d{3}[\s-]?\d{4})(?!\d)/g) || [];
        bodyMatch = phones.some(v => phoneNormal(v) === phoneNormal(expected));
      } else bodyMatch = normalizedText.includes(normal(expected));
      observed[fact.key] = { expected, staticTextMatch: bodyMatch, schemaValues: values };
      if (schemaErrors.length || traversalPartial) add(id, "store_facts", "not_checked", "Info", label, `静态正文${bodyMatch ? "找到" : "未找到"}标准值 ${expected}；JSON-LD 未完整解析，无法完成事实一致性检查。`);
      else if (!exactFields.includes(fact.key) && values.length) add(id, "store_facts", "not_checked", "Info", label, `静态正文${bodyMatch ? "找到" : "未找到"}标准值 ${expected}；结构化值 ${values.map(v => v.value).join("；")} 需人工语义核对。`);
      else if (conflict) add(id, "store_facts", "fail", "High", `${label}存在结构化差异`, `标准：${expected}；本店 Schema：${values.map(v => `${v.value} (${v.pointer})`).join("；")}`, "先人工核实差异，再修正官网信息；诊断不会改写门店标准值。");
      else if (bodyMatch) add(id, "store_facts", "pass", "Info", label, `静态正文中找到标准值：${expected}。${values.length ? "本店 Schema 值已另列留证。" : "没有可比较的本店结构化值。"}`);
      else add(id, "store_facts", "fail", "Medium", `${label}需核实或补充`, `静态正文未找到标准值：${expected}。${values.length ? `结构化值：${values.map(v => v.value).join("；")}` : "无可比较结构化值。"} 这不证明页面事实错误。`, "检查本页是否应展示该项；若只在 JS 或其他页面提供，保存相应证据后复核。");
    }
    checks.sort((a, b) => SEVERITY[a.severity] - SEVERITY[b.severity]);
    const findings = checks.filter(c => c.status === "fail");
    const fingerprint = JSON.stringify({ title, description, headings, canonical, robots, types: [...types].sort(), observed });
    const report = {
      id: uid(), storeId: store.id, storeName: store.display_name, mode,
      url, sourceLabel: clip(sourceLabel, 120), capturedAt: new Date().toISOString(),
      ruleVersion: VERSION, upstreamCommit: UPSTREAM, sourceHash: await digest(html),
      factBaselineHash: await digest(JSON.stringify(factBaseline)), factBaseline, sourceHtml: html, bytes,
      status: schemaErrors.length || traversalPartial ? "partial" : "succeeded",
      checks, findings, summary: {
        issues: findings.length, high: findings.filter(c => ["Critical", "High"].includes(c.severity)).length,
        passed: checks.filter(c => c.status === "pass").length,
        notChecked: checks.filter(c => c.status === "not_checked").length,
      },
      facts: { title, description, headings, canonical, robots, types: [...types].sort(), schemaBlocks: scripts.length, observed },
      fingerprint,
      limitations: ["仅检查导入的静态 HTML，不测量在线可达性、响应头、JS 渲染或 AI 实际引用。记录的时间是诊断时间，网页原始抓取时间未核验。", "门店事实仅使用本次已裁定标准；文本命中不证明资质有效，结构化差异需人工复核。", "此为确定性局部规则检查，不是完整 Schema.org 验证或搜索排名预测。"],
    };
    return report;
  }

  function compare(current, previous) {
    if (!previous || current.storeId !== previous.storeId || current.url !== previous.url || current.mode !== previous.mode || current.ruleVersion !== previous.ruleVersion)
      return null;
    const keys = ["title", "description", "headings", "canonical", "robots", "types"];
    const changes = keys.filter(k => JSON.stringify(current.facts[k]) !== JSON.stringify(previous.facts[k])).map(key => ({ key, before: previous.facts[key], after: current.facts[key] }));
    const now = new Map(current.checks.map(c => [c.id, c])), old = new Map(previous.checks.map(c => [c.id, c]));
    const comparable = c => c.module !== "store_facts" || (current.factBaselineHash && current.factBaselineHash === previous.factBaselineHash);
    return {
      previousId: previous.id, previousAt: previous.capturedAt,
      sameSource: !!current.sourceHash && current.sourceHash === previous.sourceHash,
      baselineChanged: current.factBaselineHash !== previous.factBaselineHash,
      changes,
      resolved: previous.findings.filter(c => now.get(c.id)?.status === "pass" && comparable(c)).map(c => c.id),
      introduced: current.findings.filter(c => old.get(c.id)?.status === "pass" && comparable(c)).map(c => c.id),
    };
  }

  window.SiteAuditEngine = { inspect, compare, normalizeUrl, uid, VERSION, UPSTREAM, MAX_BYTES };
})();

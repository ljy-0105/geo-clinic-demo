/* Isolated synthetic fixtures. Never describe these as a real store audit. */
(() => {
  const store = { id: "audit-example-store", license_name: "示例星河门诊部", display_name: "示例星河门诊部" };
  const facts = [
    { key: "license_name", expected: "示例星河门诊部", status: "arbitrated" },
    { key: "address", expected: "示例市星河路100号", status: "arbitrated" },
    { key: "phone", expected: "010-12345678", status: "arbitrated" },
    { key: "open_hours", expected: "09:00-18:00", status: "pending" },
  ];
  function html(fixed) {
    const schema = { "@context": "https://schema.org", "@graph": [
      { "@type": "MedicalClinic", "@id": "#clinic", name: store.license_name,
        address: { "@id": "#address" }, telephone: fixed ? "010-12345678" : "010-87654321" },
      { "@type": "PostalAddress", "@id": "#address", streetAddress: "示例市星河路100号" },
    ] };
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<title>${fixed ? "示例星河门诊部｜地址与联系方式" : ""}</title>
${fixed ? '<meta name="description" content="示例门店的地址、联系电话与营业信息，用于演示快照诊断。"><meta name="viewport" content="width=device-width, initial-scale=1">' : '<meta name="robots" content="noindex">'}
<link rel="canonical" href="https://example.com/clinic">
<script type="application/ld+json">${JSON.stringify(schema)}<\/script>
</head><body><main><h1>示例星河门诊部</h1><p>地址：示例市星河路100号</p>
<p>联系电话：010-12345678</p><p>此为虚构门店演示，非客户实测。</p>
<img src="https://example.invalid/never-fetch.png" ${fixed ? 'alt="门诊环境示意图"' : ""}>
</main></body></html>`;
  }
  window.SiteAuditExamples = { store, facts, url: "https://example.com/clinic", before: html(false), after: html(true) };
})();

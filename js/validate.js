/* Thin static UI over the existing pinned snapshot engine. No fetch or storage. */
(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const labels = {pass:"通过",fail:"需处理",not_checked:"未检查",info:"提示"};
  let mode = "imported", revision = 0;
  const notify = (message,bad=false) => { byId("validation-notice").textContent=message;byId("validation-notice").classList.toggle("error",bad); };
  function imported() { mode="imported"; revision++; byId("validation-result").innerHTML='<div class="validation-empty"><p>输入已更新，请重新校验。</p></div>'; byId("input-kind").textContent="当前为自行导入页面，仅作通用页面检查；没有已裁定门店事实，事实项保持未检查。"; }
  function example(which) {
    revision++; mode="sample";
    byId("validation-result").innerHTML='<div class="validation-empty"><p>示例已更新，请开始校验。</p></div>';
    byId("page-url").value=SiteAuditExamples.url;byId("page-html").value=SiteAuditExamples[which];
    byId("input-kind").textContent="当前为虚构门店示例，含示例已裁定事实；不代表真实机构诊断。";
    notify("示例已载入，点击“开始轻量校验”查看结果。");
  }
  byId("load-before").addEventListener("click",()=>example("before"));
  byId("load-after").addEventListener("click",()=>example("after"));
  byId("page-html").addEventListener("input",imported);
  byId("page-url").addEventListener("input",imported);
  byId("html-file").addEventListener("change",async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try {
      if(file.size>SiteAuditEngine.MAX_BYTES)throw new Error("文件超过 512 KB，请选择单页 HTML。");
      imported();const ticket=revision, source=await file.text();
      if(ticket!==revision)return;
      byId("page-html").value=source;notify("本地文件已读取，尚未执行校验。");
    } catch(error){notify(error.message,true);}
  });
  byId("validation-form").addEventListener("submit",async event=>{
    event.preventDefault();const button=byId("run-validation");button.disabled=true;
    const ticket=revision;
    try {
      const sample=mode==="sample";
      const report=await SiteAuditEngine.inspect({html:byId("page-html").value,url:byId("page-url").value,
        store:sample?SiteAuditExamples.store:{id:"local-html-only",display_name:"自行导入页面"},facts:sample?SiteAuditExamples.facts:[],
        mode:sample?"sample":"imported",sourceLabel:sample?"虚构门店示例":"本地导入，未核验网页抓取时间"});
      if(ticket!==revision){notify("输入已变化，请重新校验。");return;}
      const checks=[...report.checks].sort((a,b)=>(a.status==="fail"?0:a.status==="not_checked"?2:1)-(b.status==="fail"?0:b.status==="not_checked"?2:1));
      byId("validation-result").innerHTML=`<p class="validation-result-meta">${sample?"虚构门店示例":"自行导入页面"} · ${esc(report.url)}<br>${sample?"示例事实仅适用于本虚构门店":"未提供已裁定门店事实，未执行事实比对"}<br>规则 ${esc(report.ruleVersion)} · ${report.bytes.toLocaleString()} bytes<br>SHA-256 ${esc(report.sourceHash||"当前浏览器未提供散列能力")}</p><div class="validation-summary"><div>需处理<b>${report.summary.issues}</b></div><div>通过<b>${report.summary.passed}</b></div><div>未检查<b>${report.summary.notChecked}</b></div></div>${checks.map(c=>`<article class="validation-check"><h3><span class="validation-status ${esc(c.status)}">${labels[c.status]||esc(c.status)}</span>${esc(c.title||c.label||c.id)}</h3><p>${esc(c.evidence||"")}</p>${c.recommendation?`<p>建议：${esc(c.recommendation)}</p>`:""}<details><summary>检查证据</summary><pre>${esc(JSON.stringify(c,null,2))}</pre></details></article>`).join("")}<p class="note">${report.limitations.map(esc).join("<br>")}</p>`;
      notify("校验完成。结果仅针对本次 HTML 快照，不构成综合评分或 AI 实测。");
    }catch(error){notify(error.message,true);}finally{button.disabled=false;}
  });
})();

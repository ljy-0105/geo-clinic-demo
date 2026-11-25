/* 启动 */
document.addEventListener("DOMContentLoaded", function () {
  if (!window.GEO_DATA) {
    document.getElementById("root").innerHTML =
      '<div class="page"><div class="banner danger">未找到 data.js，先运行 export_web.py 生成数据。</div></div>';
    return;
  }
  renderShell();
  const t = new URLSearchParams(location.search).get("tab");
  const defaultTab = window.GEO_DEPLOYMENT?.defaultTab || "dashboard";
  go(window.VIEWS[t] ? t : defaultTab);
});

(function() {
  const STORAGE_KEY = "globalSidebarCollapsed";
  const MOBILE_OPEN_CLASS = "global-sidebar-mobile-open";
  const COLLAPSED_CLASS = "global-sidebar-collapsed";

  const stages = [
    {
      title: "第一阶段",
      subtitle: "了解考试",
      items: [
        { number: "01", label: "考试全流程", href: "guide-process.html", match: ["guide-process.html"] },
        { number: "02", label: "军队文职介绍", href: "guide.html", match: ["guide.html", "index.html", ""] },
        { number: "03", label: "岗位介绍", href: "job-list.html", match: ["job-list.html", "job-detail.html"] },
        { number: "04", label: "资格审核", href: "guide-qualification.html", match: ["guide-qualification.html", "guide-medical.html", "guide-political.html"] },
        { number: "05", label: "常见问题", href: "guide-faq.html", match: ["guide-faq.html"] }
      ]
    },
    {
      title: "第二阶段",
      subtitle: "选择岗位",
      items: [
        { number: "06", label: "AI岗位推荐", href: "recommend.html", match: ["recommend.html", "recommend-report.html"] }
      ]
    },
    {
      title: "第三阶段",
      subtitle: "开始备考",
      items: [
        { number: "07", label: "考试科目", href: "guide-exam.html", match: ["guide-exam.html"] },
        { number: "08", label: "真题中心", href: "papers.html", match: ["papers.html"] },
        { number: "09", label: "政策解读", href: "policy-reader.html", match: ["policy.html", "policy-reader.html"] }
      ]
    },
    {
      title: "第四阶段",
      subtitle: "正式报名",
      items: [
        { number: "10", label: "报考准备材料", href: "preparation-materials.html", match: ["preparation-materials.html"] },
        { number: "11", label: "报名流程", href: "guide-process.html#registration", match: ["guide-process.html#registration"] }
      ]
    }
  ];

  function getCurrentKey() {
    const filename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1) || "index.html";
    if (filename === "guide-process.html" && location.hash) return `${filename}${location.hash}`;
    return filename;
  }

  function isActive(item) {
    const current = getCurrentKey();
    return item.match.includes(current);
  }

  function getCurrentProgress() {
    const flatItems = stages.flatMap((stage, stageIndex) =>
      stage.items.map(item => ({ ...item, stage, stageIndex }))
    );
    const activeIndex = flatItems.findIndex(isActive);
    const activeItem = activeIndex >= 0 ? flatItems[activeIndex] : flatItems[0];
    return {
      stage: activeItem.stage,
      completed: activeIndex >= 0 ? activeIndex + 1 : 1,
      total: flatItems.length
    };
  }

  function renderProgress() {
    const progress = getCurrentProgress();
    return `
      <span>当前阶段</span>
      <strong>${progress.stage.title} · ${progress.stage.subtitle}</strong>
      <em>已完成：${progress.completed} / ${progress.total}</em>
    `;
  }

  function renderIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>';
  }

  function renderStage(stage) {
    return `
      <section class="global-sidebar-stage">
        <div class="global-sidebar-stage-head">
          ${stage.title}｜${stage.subtitle}
        </div>
        <div class="global-sidebar-links">
          ${stage.items.map(item => `
            <a class="global-sidebar-link${isActive(item) ? " active" : ""}" href="${item.href}" title="${item.label}">
              <span class="global-sidebar-num">${item.number}</span>
              <span class="global-sidebar-label">${item.label}</span>
            </a>
          `).join("")}
        </div>
      </section>
    `;
  }

  function setCollapsed(collapsed) {
    document.body.classList.toggle(COLLAPSED_CLASS, collapsed);
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    const button = document.querySelector(".global-sidebar-toggle");
    if (button) button.setAttribute("aria-expanded", collapsed ? "false" : "true");
  }

  function closeMobileDrawer() {
    document.body.classList.remove(MOBILE_OPEN_CLASS);
  }

  function initSidebar() {
    if (document.querySelector(".global-sidebar")) return;

    document.body.classList.add("has-global-sidebar");

    const sidebar = document.createElement("aside");
    sidebar.className = "global-sidebar";
    sidebar.setAttribute("aria-label", "上岸路线图");
    sidebar.innerHTML = `
      <div class="global-sidebar-inner">
        <div class="global-sidebar-top">
          <div class="global-sidebar-title">
            <span class="global-sidebar-mark">${renderIcon()}</span>
            <div class="global-sidebar-title-copy">
              <span class="global-sidebar-title-text">上岸路线图</span>
              <span class="global-sidebar-subtitle">军队文职报考导航</span>
            </div>
            <button class="global-sidebar-toggle" type="button" aria-label="收起或展开上岸路线图" aria-expanded="true">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
          </div>
          <div class="global-sidebar-progress">
            ${renderProgress()}
          </div>
        </div>
        <nav class="global-sidebar-nav">
          ${stages.map(renderStage).join("")}
        </nav>
      </div>
    `;

    const mobileToggle = document.createElement("button");
    mobileToggle.className = "global-sidebar-mobile-toggle";
    mobileToggle.type = "button";
    mobileToggle.setAttribute("aria-label", "打开上岸路线图");
    mobileToggle.innerHTML = renderIcon();

    const overlay = document.createElement("div");
    overlay.className = "global-sidebar-overlay";
    overlay.setAttribute("aria-hidden", "true");

    document.body.appendChild(sidebar);
    document.body.appendChild(mobileToggle);
    document.body.appendChild(overlay);

    const collapsed = localStorage.getItem(STORAGE_KEY) === "1";
    setCollapsed(collapsed);

    sidebar.querySelector(".global-sidebar-toggle").addEventListener("click", function() {
      setCollapsed(!document.body.classList.contains(COLLAPSED_CLASS));
    });

    mobileToggle.addEventListener("click", function() {
      document.body.classList.toggle(MOBILE_OPEN_CLASS);
    });

    overlay.addEventListener("click", closeMobileDrawer);

    sidebar.addEventListener("click", function(event) {
      const link = event.target.closest("a");
      if (link && window.matchMedia("(max-width: 768px)").matches) closeMobileDrawer();
    });

    window.addEventListener("hashchange", function() {
      document.querySelectorAll(".global-sidebar-link").forEach(link => link.classList.remove("active"));
      stages.flatMap(stage => stage.items).forEach(item => {
        if (!isActive(item)) return;
        const activeLink = document.querySelector(`.global-sidebar-link[href="${item.href}"]`);
        if (activeLink) activeLink.classList.add("active");
      });
      const progress = document.querySelector(".global-sidebar-progress");
      if (progress) progress.innerHTML = renderProgress();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebar);
  } else {
    initSidebar();
  }
})();

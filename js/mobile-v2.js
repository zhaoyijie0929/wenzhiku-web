(function() {
  const MOBILE_QUERY = "(max-width: 768px)";

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function currentFile() {
    return location.pathname.substring(location.pathname.lastIndexOf("/") + 1) || "index.html";
  }

  function normalizeHref(href) {
    const a = document.createElement("a");
    a.href = href;
    return a.pathname.substring(a.pathname.lastIndexOf("/") + 1) || "index.html";
  }

  function initDrawer() {
    const button = document.querySelector(".mobile-v2-menu-button");
    const drawer = document.querySelector(".mobile-v2-drawer");
    const overlay = document.querySelector(".mobile-v2-drawer-overlay");
    const close = document.querySelector(".mobile-v2-drawer-close");
    if (!button || !drawer || !overlay || !close) return;

    const openDrawer = () => {
      document.body.classList.add("mobile-v2-drawer-open");
      button.setAttribute("aria-expanded", "true");
    };
    const closeDrawer = () => {
      document.body.classList.remove("mobile-v2-drawer-open");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", openDrawer);
    close.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);
    drawer.addEventListener("click", event => {
      if (event.target.closest("a")) closeDrawer();
    });

    const file = currentFile();
    drawer.querySelectorAll("a").forEach(link => {
      const target = normalizeHref(link.getAttribute("href"));
      if (
        target === file ||
        (file === "recommend-report.html" && target === "recommend.html") ||
        (["guide.html", "guide-process.html", "guide-exam.html", "guide-qualification.html", "guide-medical.html", "guide-political.html", "guide-faq.html", "job-list.html", "job-detail.html", "preparation-materials.html"].includes(file) && target === "guide.html") ||
        (file === "policy.html" && target === "policy-reader.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  function icon(name) {
    const icons = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 10v9h13v-9"/><path d="M9.5 19v-5h5v5"/>',
      ai: '<path d="M12 3v3M12 18v3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M3 12h3M18 12h3M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1"/><circle cx="12" cy="12" r="4"/>',
      job: '<path d="M4 7h16v13H4z"/><path d="M8 7V5h8v2M8 12h8M8 16h5"/>',
      paper: '<path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
      mine: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c1.2-5 4.2-7 7.5-7s6.3 2 7.5 7"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  }

  function initTabbar() {
    if (document.querySelector(".mobile-v2-tabbar")) return;
    const tabs = [
      { key: "home", label: "首页", href: "index.html", files: ["index.html", ""] },
      { key: "ai", label: "AI推荐", href: "recommend.html", files: ["recommend.html", "recommend-report.html"] },
      { key: "job", label: "岗位", href: "job-list.html", files: ["job-list.html", "job-detail.html"] },
      { key: "paper", label: "真题", href: "papers.html", files: ["papers.html"] },
      { key: "mine", label: "我的", href: "guide.html", files: ["guide.html", "guide-process.html", "guide-exam.html", "guide-qualification.html", "guide-medical.html", "guide-political.html", "guide-faq.html", "preparation-materials.html", "policy-reader.html", "policy.html"] }
    ];
    const file = currentFile();
    const nav = document.createElement("nav");
    nav.className = "mobile-v2-tabbar";
    nav.setAttribute("aria-label", "移动端底部导航");
    nav.innerHTML = tabs.map(tab => `
      <a href="${tab.href}" class="${tab.files.includes(file) ? "active" : ""}">
        ${icon(tab.key)}
        <span>${tab.label}</span>
      </a>
    `).join("");
    document.body.appendChild(nav);
  }

  function initHomeRouteCard() {
    const path = document.querySelector(".home-v4-path");
    if (!path || document.querySelector(".mobile-v2-route-timeline")) return;
    const timeline = document.createElement("section");
    timeline.className = "mobile-v2-route-timeline";
    timeline.setAttribute("aria-label", "移动端上岸路线图");
    timeline.innerHTML = `
      <div class="mobile-v2-section-head">
        <strong>上岸路线图</strong>
        <a href="guide-process.html">完整流程</a>
      </div>
      <div class="mobile-v2-route-scroll">
        <a href="guide-process.html"><span>01</span><strong>了解考试</strong><em>条件/岗位/科目</em></a>
        <a href="recommend.html"><span>02</span><strong>AI推荐</strong><em>匹配适合岗位</em></a>
        <a href="papers.html"><span>03</span><strong>开始备考</strong><em>真题与资料</em></a>
        <a href="preparation-materials.html"><span>04</span><strong>正式报名</strong><em>材料与审核</em></a>
        <a href="guide-process.html#admission"><span>05</span><strong>上岸录用</strong><em>面试/体检/政审</em></a>
      </div>
    `;
    path.insertAdjacentElement("beforebegin", timeline);
  }

  function initRecommendWizard() {
    const form = document.getElementById("recommend-form");
    const cards = Array.from(document.querySelectorAll(".form-card[data-step-card]"));
    if (!form || !cards.length || form.dataset.mobileWizard === "true") return;

    form.dataset.mobileWizard = "true";
    document.body.classList.add("mobile-v2-recommend");
    let current = 0;

    const controls = document.createElement("div");
    controls.className = "mobile-v2-step-controls";
    controls.innerHTML = `
      <button type="button" data-mobile-step-prev>上一步</button>
      <button type="button" data-mobile-step-next>下一步</button>
    `;

    function render() {
      cards.forEach((card, index) => {
        card.classList.toggle("mobile-step-active", index === current);
      });
      const active = cards[current];
      if (active && controls.parentElement !== active) {
        active.appendChild(controls);
      }
      const prev = controls.querySelector("[data-mobile-step-prev]");
      const next = controls.querySelector("[data-mobile-step-next]");
      prev.disabled = current === 0;
      next.textContent = current === cards.length - 1 ? "查看摘要" : "下一步";
      document.querySelectorAll(".recommend-step").forEach((step, index) => {
        step.classList.toggle("active", index === current);
      });
    }

    controls.addEventListener("click", event => {
      if (event.target.matches("[data-mobile-step-prev]")) {
        current = Math.max(0, current - 1);
        render();
        cards[current].scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (event.target.matches("[data-mobile-step-next]")) {
        current = Math.min(cards.length - 1, current + 1);
        render();
        if (current < cards.length - 1) {
          cards[current].scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          document.querySelector(".recommend-summary-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

    document.querySelectorAll(".recommend-step").forEach((step, index) => {
      step.addEventListener("click", () => {
        if (!isMobile()) return;
        current = index;
        render();
        cards[current]?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    render();
  }

  function boot() {
    initDrawer();
    initTabbar();
    initHomeRouteCard();
    initRecommendWizard();
    watchRenderedContent();
  }

  function watchRenderedContent() {
    const app = document.getElementById("app");
    if (!app || app.dataset.mobileV2Watched === "true") return;
    app.dataset.mobileV2Watched = "true";
    const observer = new MutationObserver(() => {
      initHomeRouteCard();
      initRecommendWizard();
    });
    observer.observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("hashchange", () => {
    setTimeout(() => {
      initHomeRouteCard();
      initRecommendWizard();
    }, 60);
  });
})();

(function() {
  const DATA_DIR = "data/policy-annotations/";
  const app = document.getElementById("policyReaderApp");
  const select = document.getElementById("policyReaderSelect");
  const nav = document.getElementById("policyReaderNav");
  const titleEl = document.getElementById("readerTitle");
  const topicEl = document.getElementById("readerTopic");
  const paragraphCountEl = document.getElementById("readerParagraphCount");
  const annotationCountEl = document.getElementById("readerAnnotationCount");
  const relatedGuideEl = document.getElementById("policyRelatedGuide");

  let manifest = null;
  let resizeTimer = null;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function normalize(value) {
    return String(value || "").replace(/\s+/g, "");
  }

  function candidateTexts(annotation) {
    const text = String(annotation.markedText || "").trim();
    return [
      text,
      text.replace(/\s+and\s+/gi, "和"),
      text.replace(/[“”]/g, '"')
    ].filter(Boolean);
  }

  function findAnnotationMatch(paragraph, annotation) {
    for (const text of candidateTexts(annotation)) {
      const index = paragraph.indexOf(text);
      if (index >= 0) {
        return { annotation, start: index, end: index + text.length };
      }
    }

    const compactParagraph = normalize(paragraph);
    for (const text of candidateTexts(annotation)) {
      const compactText = normalize(text);
      if (compactText && compactParagraph.includes(compactText)) {
        return { annotation, start: 0, end: paragraph.length };
      }
    }
    return null;
  }

  function paragraphMatches(paragraph, annotations) {
    return annotations
      .map(annotation => findAnnotationMatch(paragraph, annotation))
      .filter(Boolean)
      .sort((a, b) => a.start - b.start);
  }

  function renderMarkedText(paragraph, matches) {
    if (!matches.length) return escapeHtml(paragraph);

    let cursor = 0;
    let html = "";
    matches.forEach(match => {
      if (match.start < cursor) return;
      const noteNumber = match.annotation.id ? String(match.annotation.id).replace("note-", "") : "";
      html += escapeHtml(paragraph.slice(cursor, match.start));
      html += `<span class="reader-ref">${escapeHtml(noteNumber)}</span><span class="reader-mark">${escapeHtml(paragraph.slice(match.start, match.end))}</span>`;
      cursor = match.end;
    });
    html += escapeHtml(paragraph.slice(cursor));
    return html;
  }

  function renderParagraph(paragraph, matches) {
    const text = String(paragraph || "").trim();
    if (/^[一二三四五六七八九十]+、/.test(text)) {
      return `<h3>${renderMarkedText(text, matches)}</h3>`;
    }
    if (/^（[一二三四五六七八九十]+）/.test(text) || /^\d+[.、]/.test(text)) {
      return `<h4>${renderMarkedText(text, matches)}</h4>`;
    }
    return `<p>${renderMarkedText(text, matches)}</p>`;
  }

  function annotationType(annotation) {
    const text = `${annotation.title || ""} ${annotation.summary || ""} ${(annotation.points || []).join(" ")} ${annotation.warning || ""}`;
    if (/时间|日期|截止|报名|缴费|准考证|成绩/.test(text)) return { label: "时间节点", className: "time" };
    if (/身份|学历|学位|资格|年龄|专业|条件|不得报考/.test(text)) return { label: "资格条件", className: "condition" };
    if (/体检|身体|政审|政治考核|考核/.test(text)) return { label: "体检政审", className: "review" };
    if (/公共科目|专业科目|大纲|笔试|面试|分值|考试/.test(text)) return { label: "考试备考", className: "exam" };
    if (/岗位|单位|招聘|计划|调剂|补录/.test(text)) return { label: "选岗报名", className: "job" };
    return { label: "重点提醒", className: "default" };
  }

  function renderNote(match, index) {
    const annotation = match.annotation;
    const points = Array.isArray(annotation.points) ? annotation.points : [];
    const summary = String(annotation.summary || "");
    const type = annotationType(annotation);
    return `
      <article class="note-card">
        <div class="note-topline">
          <span class="note-badge">批注 ${annotation.id ? String(annotation.id).replace("note-", "") : index + 1}</span>
          <span class="note-type note-type-${type.className}">${type.label}</span>
        </div>
        <h3>${escapeHtml(annotation.title || "重点提醒")}</h3>
        ${(summary || points.length || annotation.warning) ? `
          <details class="note-more">
            <summary>展开重点</summary>
            ${summary ? `<p class="note-full-summary">${escapeHtml(summary)}</p>` : ""}
            ${points.length ? `<ul>${points.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul>` : ""}
            ${annotation.warning ? `<div class="note-warning">${escapeHtml(annotation.warning)}</div>` : ""}
          </details>
        ` : ""}
      </article>
    `;
  }

  function inferRelatedGuides(data) {
    const text = [
      data.title,
      data.topic,
      ...(Array.isArray(data.paragraphs) ? data.paragraphs : []),
      ...(Array.isArray(data.annotations) ? data.annotations.map(item => `${item.title || ""} ${item.summary || ""} ${(item.points || []).join(" ")}`) : [])
    ].join(" ");
    const guides = [
      { label: "考试全流程", href: "guide-process.html", test: /公告|报名|资格|准考证|笔试|面试|录用|程序|流程/ },
      { label: "报名流程", href: "guide-process.html#registration", test: /报名|缴费|提交|资格条件初审|资格审核/ },
      { label: "考试科目", href: "guide-exam.html", test: /公共科目|专业科目|考试大纲|笔试|分值|成绩/ },
      { label: "真题中心", href: "papers.html", test: /真题|备考|笔试|考试内容|理论考试/ },
      { label: "体检标准", href: "guide-qualification.html#medical", test: /体检|身体|视力|身高|BMI|纹身|色弱/ },
      { label: "政治考核", href: "guide-qualification.html#political", test: /政治考核|政审|考核|违法|犯罪|失信|亲属/ },
      { label: "常见问题", href: "guide-faq.html", test: /问题|疑问|注意事项|咨询|怎么办/ }
    ];
    return guides.filter(item => item.test.test(text)).slice(0, 5);
  }

  function renderRelatedGuides(data) {
    if (!relatedGuideEl) return;
    const guides = inferRelatedGuides(data);
    if (!guides.length) {
      relatedGuideEl.classList.remove("show");
      relatedGuideEl.innerHTML = "";
      return;
    }
    relatedGuideEl.classList.add("show");
    relatedGuideEl.innerHTML = `<strong>相关指南</strong>${guides.map(item => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}`;
  }

  function positionNoteLayer() {
    const layer = app.querySelector(".reader-note-layer");
    if (!layer) return;

    if (window.matchMedia("(max-width: 1100px)").matches) {
      layer.querySelectorAll(".reader-note-group").forEach(group => {
        group.style.top = "";
      });
      app.style.minHeight = "";
      return;
    }

    let nextTop = 0;
    layer.querySelectorAll(".reader-note-group").forEach(group => {
      const row = app.querySelector(`[data-note-index="${group.dataset.noteIndex}"]`);
      if (!row) return;
      const top = Math.max(row.offsetTop + 6, nextTop);
      group.style.top = `${top}px`;
      nextTop = top + group.offsetHeight + 10;
    });
    app.style.minHeight = `${Math.max(app.scrollHeight, nextTop)}px`;
  }

  function render(data) {
    const paragraphs = Array.isArray(data.paragraphs) ? data.paragraphs : [];
    const annotations = Array.isArray(data.annotations) ? data.annotations : [];

    titleEl.textContent = data.title || "政策批注阅读";
    topicEl.textContent = data.topic || "policy";
    paragraphCountEl.textContent = String(paragraphs.length);
    annotationCountEl.textContent = String(annotations.length);
    renderRelatedGuides(data);

    const noteGroups = [];
    const rows = paragraphs.map((paragraph, index) => {
      const matches = paragraphMatches(paragraph, annotations);
      if (matches.length) {
        noteGroups.push(`
          <div class="reader-note-group" data-note-index="${index}">
            <div class="reader-arrow" aria-hidden="true">→</div>
            <div class="reader-notes">${matches.map(renderNote).join("")}</div>
          </div>
        `);
      }
      return `
        <div class="reader-row${matches.length ? " has-note" : ""}" data-note-index="${index}">
          <div class="reader-left">${renderParagraph(paragraph, matches)}</div>
        </div>
      `;
    }).join("");

    app.innerHTML = rows + `<div class="reader-note-layer">${noteGroups.join("")}</div>`;
    requestAnimationFrame(positionNoteLayer);
  }

  function updateUrl(topic) {
    const url = new URL(location.href);
    url.searchParams.set("topic", topic);
    history.replaceState(null, "", url.toString());
  }

  async function loadPolicy(item) {
    if (!item) return;
    app.innerHTML = '<div class="policy-reader-loading">正在加载批注数据...</div>';
    if (select) select.value = item.topic;
    updatePolicyNavActive(item.topic);
    updateUrl(item.topic);

    try {
      const response = await fetch(DATA_DIR + item.file);
      if (!response.ok) throw new Error("数据文件读取失败");
      const data = await response.json();
      render(data);
    } catch (error) {
      app.innerHTML = `<div class="policy-reader-error">批注数据加载失败，请确认本地服务器已启动。<br>${escapeHtml(error.message)}</div>`;
    }
  }

  function policyGroup(item) {
    return String(item.topic || "").startsWith("mgmt-") ? "管理技术岗" : "技能岗";
  }

  function visiblePolicyItems() {
    return manifest.items.filter(item => item.topic !== "skill-notice-2026");
  }

  function displayPolicyTitle(item) {
    const titles = {
      "skill-east": "2026-东部战区-技能岗公告",
      "skill-rocket": "2026-火箭军-技能岗公告",
      "skill-army": "2026-陆军-技能岗公告",
      "skill-logistics": "2026-中央军委后勤保障部-技能岗公告",
      "skill-airforce-notice": "2026-空军-技能岗公告",
      "skill-navy": "2026-海军-技能岗公告",
      "skill-airforce-guide": "2026-空军-技能岗报考指南",
      "skill-west": "2026-西部战区-技能岗公告",
      "skill-navy-syllabus": "2026-海军-技能岗大纲",
      "skill-north": "2026-北部战区-技能岗公告"
    };
    return titles[item.topic] || item.title;
  }

  function renderPolicyNav() {
    if (!nav) return;
    const groups = ["管理技术岗", "技能岗"].map(label => ({
      label,
      items: visiblePolicyItems().filter(item => policyGroup(item) === label)
    })).filter(group => group.items.length);

    nav.innerHTML = groups.map(group => `
      <section class="policy-reader-nav-group">
        <div class="policy-reader-nav-group-title">${escapeHtml(group.label)}</div>
        <div class="policy-reader-nav-buttons">
          ${group.items.map(item => `
            <button type="button" data-topic="${escapeHtml(item.topic)}">
              <span>${escapeHtml(displayPolicyTitle(item))}</span>
              <em>${escapeHtml(item.annotationCount || 0)} 条批注</em>
            </button>
          `).join("")}
        </div>
      </section>
    `).join("");
  }

  function updatePolicyNavActive(topic) {
    nav?.querySelectorAll("button[data-topic]").forEach(button => {
      button.classList.toggle("active", button.dataset.topic === topic);
    });
  }

  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(positionNoteLayer, 120);
  });

  app.addEventListener("toggle", function(event) {
    if (event.target.matches(".note-more")) {
      requestAnimationFrame(positionNoteLayer);
    }
  }, true);

  function findInitialItem() {
    const topic = getParam("topic");
    const file = getParam("file");
    if (topic === "skill-notice-2026") {
      return manifest.items.find(item => item.topic === "mgmt-notice-2026") || manifest.items[0];
    }
    return manifest.items.find(item => item.topic === topic) ||
      manifest.items.find(item => item.file === file) ||
      visiblePolicyItems()[0] ||
      manifest.items[0];
  }

  async function init() {
    try {
      const response = await fetch(DATA_DIR + "manifest.json");
      if (!response.ok) throw new Error("manifest.json 读取失败");
      manifest = await response.json();
      manifest.items = Array.isArray(manifest.items) ? manifest.items : [];

      if (select) select.innerHTML = manifest.items.map(item =>
        `<option value="${escapeHtml(item.topic)}">${escapeHtml(item.title)}</option>`
      ).join("");

      renderPolicyNav();

      select?.addEventListener("change", function() {
        loadPolicy(manifest.items.find(item => item.topic === select.value));
      });

      nav?.addEventListener("click", function(event) {
        const button = event.target.closest("button[data-topic]");
        if (!button) return;
        loadPolicy(manifest.items.find(item => item.topic === button.dataset.topic));
      });

      loadPolicy(findInitialItem());
    } catch (error) {
      app.innerHTML = `<div class="policy-reader-error">批注阅读器初始化失败。<br>${escapeHtml(error.message)}</div>`;
    }
  }

  init();
})();

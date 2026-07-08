(function() {
  const DATA_URL = "data/job-database.csv?v=20260705";
  const DEFAULT_TEXT = "待数据库导入后显示";
  const SUBJECT_BASE_URL = "guide-exam.html?subject=";
  const PAPER_BASE_URL = "papers.html?subject=";
  const MANAGEMENT_GRADE_KEYWORDS = ["九级文员", "八级文员", "七级文员", "六级文员", "五级文员", "四级文员"];
  const TECHNICAL_TITLE_KEYWORDS = [
    "助理工程师",
    "工程师",
    "实验师",
    "医师",
    "护师",
    "药师",
    "会计师",
    "审计师",
    "经济师",
    "讲师",
    "编辑",
    "翻译",
    "研究员",
    "助理研究员"
  ];

  const jobDetailSchema = {
    id: "",
    category: "",
    name: "",
    duty: "",
    dailyWork: "",
    workload: "",
    overtime: "",
    environment: "",
    promotion: "",
    commonUnits: [],
    examSubjects: [],
    examContent: "",
    recommendStars: 0,
    summary: "",
    originalTitle: "",
    raw: null
  };

  function getDisplayCategory(name, sourceCategory) {
    const title = String(name || "");
    const source = String(sourceCategory || "");
    if (MANAGEMENT_GRADE_KEYWORDS.some(keyword => title.includes(keyword))) return "管理岗";
    if (TECHNICAL_TITLE_KEYWORDS.some(keyword => title.includes(keyword))) return "技术岗";
    if (source.includes("技能岗") || source.includes("技能")) return "技能岗";
    if (source.includes("管理")) return "管理岗";
    if (source.includes("技术")) return "技术岗";
    return "管理岗";
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function getJobId() {
    return new URLSearchParams(window.location.search).get("id") || "";
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(value);
        value = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") i += 1;
        row.push(value);
        if (row.some(cell => cell !== "")) rows.push(row);
        row = [];
        value = "";
      } else {
        value += char;
      }
    }

    if (value || row.length) {
      row.push(value);
      if (row.some(cell => cell !== "")) rows.push(row);
    }

    const headers = rows.shift()?.map(item => item.replace(/^\uFEFF/, "")) || [];
    return rows.map(cells => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = cells[index] == null ? "" : cells[index];
      });
      return item;
    });
  }

  function normalizeArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === "string") {
      return value
        .split(/[\n,，、;；]/)
        .map(item => item.trim())
        .filter(Boolean);
    }
    return [];
  }

  function cleanExamSubject(value) {
    const text = String(value || "")
      .replace(/[（(]\d+[\)）]/g, "")
      .replace(/[。\.]$/g, "")
      .trim();
    if (!text || /免笔试|无|不限/.test(text)) return "";
    return text;
  }

  function normalizeJob(row) {
    const job = {
      ...jobDetailSchema,
      id: row["序号"] || "",
      category: getDisplayCategory(row["岗位名称"], row["来源类别"]),
      name: row["岗位名称"] || "",
      duty: row["岗位职责"] || "",
      dailyWork: row["日常工作内容"] || "",
      workload: row["工作强度"] || "",
      overtime: row["是否经常加班"] || "",
      environment: row["工作环境"] || "",
      promotion: row["晋升方向"] || "",
      commonUnits: row["常见单位"] || "",
      examSubjects: row["考试专业科目"] || "",
      examContent: row["考试内容"] || "",
      recommendStars: row["推荐指数"] || "",
      summary: row["一句话总结"] || "",
      originalTitle: row["原始标题"] || "",
      raw: row
    };
    job.commonUnits = normalizeArray(job.commonUnits);
    job.examSubjects = normalizeArray(job.examSubjects).map(cleanExamSubject).filter(Boolean);
    return job;
  }

  async function loadJobDetails() {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`岗位百科数据读取失败：${response.status}`);
    return parseCsv(await response.text()).map(normalizeJob);
  }

  function textOrEmpty(value) {
    return value ? escapeHtml(value) : DEFAULT_TEXT;
  }

  function renderStars(count) {
    if (typeof count === "string" && count.includes("★")) {
      return count.trim();
    }
    const full = Math.round(Number(count) || 0);
    return "★★★★★".split("").map((star, index) => index < full ? star : "☆").join("");
  }

  function renderPromotion(value) {
    const rawText = String(value || "").trim();
    const arrowSteps = rawText
      ? rawText.split(/(?:→|->|➡)/).map(item => item.trim().replace(/[。.;；]+$/, "")).filter(Boolean)
      : [];
    const steps = arrowSteps.length > 1 ? arrowSteps : normalizeArray(value);
    if (!steps.length && rawText) steps.push(rawText);
    if (!steps.length) {
      return `<p class="job-ency-text job-compact-text">${DEFAULT_TEXT}</p>`;
    }
    if (steps.length === 1) {
      return `<p class="job-ency-text job-compact-text">${escapeHtml(steps[0])}</p>`;
    }
    return `<div class="promotion-flow">
      ${steps.map((step, index) => `
        <div class="promotion-flow-step">
          <span>${index + 1}</span>
          <strong>${escapeHtml(step)}</strong>
        </div>
      `).join("")}
    </div>`;
  }

  function renderPills(items, className, linkSubjects) {
    if (!items.length) return `<span class="${className}">${DEFAULT_TEXT}</span>`;
    return items.map(item => {
      const label = escapeHtml(item);
      if (linkSubjects) {
        return `<a class="${className}" href="${SUBJECT_BASE_URL}${encodeURIComponent(item)}">${label}</a>`;
      }
      return `<span class="${className}">${label}</span>`;
    }).join("");
  }

  function renderSubjectActions(subjects) {
    if (!subjects.length) return "";
    return `<div class="subject-related-actions">
      ${subjects.map(subject => `
        <a class="btn btn-primary btn-sm" href="${SUBJECT_BASE_URL}${encodeURIComponent(subject)}">查看${escapeHtml(subject)}考试科目</a>
        <a class="btn btn-outline btn-sm" href="${PAPER_BASE_URL}${encodeURIComponent(subject)}">查看${escapeHtml(subject)}真题</a>
      `).join("")}
    </div>`;
  }

  function renderJob(job) {
    document.title = `${job.name || "岗位百科"} - 军队文职智能报考平台`;
    const category = job.category || "待分类";
    const stars = renderStars(job.recommendStars);
    const starCount = typeof job.recommendStars === "string"
      ? (job.recommendStars.match(/★/g) || []).length
      : 0;
    const scoreText = typeof job.recommendStars === "string" && job.recommendStars.includes("★")
      ? `${starCount}/5`
      : (job.recommendStars ? `${job.recommendStars}/5` : "待评估");
    return `
      <div class="encyclopedia-breadcrumb">
        <a href="index.html">首页</a>
        <span>/</span>
        <span>报考指南</span>
        <span>/</span>
        <span>岗位介绍</span>
      </div>

      <section class="job-ency-hero">
        <div>
          <div class="job-ency-kicker">岗位百科</div>
          <h1>${textOrEmpty(job.name)}</h1>
          <p class="job-ency-summary">${textOrEmpty(job.summary)}</p>
          <div class="job-ency-meta">
            <span class="job-ency-tag">岗位编号：${textOrEmpty(job.id)}</span>
            <span class="job-ency-tag">岗位类别：${escapeHtml(category)}</span>
          </div>
        </div>
        <aside class="job-ency-score-card">
          <span>推荐指数</span>
          <div class="job-ency-stars" aria-label="推荐指数">${stars}</div>
          <strong>${escapeHtml(scoreText)}</strong>
        </aside>
      </section>

      <section class="job-decision-strip" aria-label="岗位快速判断">
        <article>
          <span>主要判断</span>
          <strong>${textOrEmpty(job.summary)}</strong>
        </article>
        <article>
          <span>岗位类型</span>
          <strong>${escapeHtml(category)}</strong>
        </article>
        <article>
          <span>工作强度</span>
          <strong>${textOrEmpty(job.workload)}</strong>
        </article>
        <article>
          <span>备考科目</span>
          <strong>${job.examSubjects.length ? escapeHtml(job.examSubjects.slice(0, 2).join("、")) : DEFAULT_TEXT}</strong>
        </article>
      </section>

      <main class="job-ency-main job-ency-main-single">
          <section class="job-ency-section job-intro-section">
            <h2>岗位介绍</h2>
            <div class="job-read-block">
              <h3>岗位职责</h3>
              <p class="job-ency-text">${textOrEmpty(job.duty)}</p>
            </div>
            <div class="job-read-block">
              <h3>日常工作内容</h3>
              <p class="job-ency-text">${textOrEmpty(job.dailyWork)}</p>
            </div>
          </section>

          <section class="job-ency-section">
            <h2>工作特点</h2>
            <div class="job-feature-list">
              <div class="job-feature-row">
                <span>工作强度</span>
                <strong>${textOrEmpty(job.workload)}</strong>
              </div>
              <div class="job-feature-row">
                <span>是否经常加班</span>
                <strong>${textOrEmpty(job.overtime)}</strong>
              </div>
              <div class="job-feature-row">
                <span>工作环境</span>
                <strong>${textOrEmpty(job.environment)}</strong>
              </div>
            </div>
          </section>

          <section class="job-ency-section job-compact-section">
            <h2>晋升方向</h2>
            ${renderPromotion(job.promotion)}
          </section>

          <section class="job-ency-section">
            <h2>常见招聘单位</h2>
            <div class="unit-grid">${renderPills(job.commonUnits, "unit-pill", false)}</div>
          </section>

          <section class="job-ency-section job-exam-section">
            <h2>考试信息</h2>
            <div class="exam-info-stack">
              <div class="exam-info-row">
                <span class="exam-info-label">专业科目</span>
                <div class="exam-info-content">
                  <div class="subject-grid">${renderPills(job.examSubjects, "subject-pill", true)}</div>
                  ${renderSubjectActions(job.examSubjects)}
                </div>
              </div>
              <div class="exam-info-row">
                <span class="exam-info-label">考试内容</span>
                <p class="exam-info-content job-ency-text">${job.examContent ? textOrEmpty(job.examContent) : "暂无内容，后续补充。"}</p>
              </div>
            </div>
          </section>
        </main>
    `;
  }

  function renderEmpty(message, detail) {
    return `
      <section class="job-ency-empty">
        <h1>${escapeHtml(message)}</h1>
        <p>${escapeHtml(detail)}</p>
        <div class="job-ency-actions">
          <a class="btn btn-primary" href="job-list.html">返回岗位百科</a>
          <a class="btn btn-outline" href="index.html">返回首页</a>
        </div>
      </section>
    `;
  }

  async function init() {
    const app = document.getElementById("job-detail-app");
    const id = getJobId();
    if (!id) {
      app.innerHTML = renderEmpty("请选择岗位", "当前页面需要通过岗位编号读取数据库，例如：job-detail.html?id=001。");
      return;
    }

    try {
      const jobs = await loadJobDetails();
      const job = jobs.find(item => String(item.id) === String(id));
      if (!job) {
        app.innerHTML = renderJob({ ...jobDetailSchema, id });
        return;
      }
      app.innerHTML = renderJob(job);
    } catch (error) {
        app.innerHTML = renderEmpty("岗位百科数据读取失败", "请确认 data/job-database.csv 存在且格式正确。");
      console.error(error);
    }
  }

  window.JobDetailDataAPI = {
    schema: jobDetailSchema,
    dataUrl: DATA_URL,
    load: loadJobDetails,
    render: renderJob
  };

  document.addEventListener("DOMContentLoaded", init);
})();

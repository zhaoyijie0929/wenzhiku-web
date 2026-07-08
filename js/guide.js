(function() {
  const GUIDE_NAV = [
    { key: "process", title: "考试全流程", href: "guide-process.html" },
    { key: "home", title: "军队文职介绍", href: "guide.html" },
    { key: "jobs", title: "岗位介绍", href: "job-list.html" },
    { key: "exam", title: "考试科目", href: "guide-exam.html" },
    { key: "qualification", title: "资格审核", href: "guide-qualification.html" },
    { key: "faq", title: "常见问题（FAQ）", href: "guide-faq.html" }
  ];

  const PAGE_META = {
    home: {
      title: "军队文职介绍",
      summary: "这里将承载军队文职基础介绍文章，便于第一次了解文职的用户先建立完整认知。"
    },
    process: { title: "考试全流程", summary: "按时间顺序梳理从了解考试到最终录用的完整路径。" },
    jobs: { title: "岗位介绍", summary: "按岗位百科了解岗位职责、日常工作、工作强度、考试科目和报考建议。" },
    exam: { title: "考试科目", summary: "查看公共科目与专业科目介绍、分值结构、官方大纲和下载资料。" },
    qualification: { title: "资格审核", summary: "先从政审和体检两个方向判断自己是否满足后续审核要求。" },
    medical: { title: "体检标准", summary: "集中查看军队文职体检通用标准、文职人员补充标准和体检项目说明。" },
    political: { title: "政治考核", summary: "了解政治考核流程、考核内容、注意事项、疑难问题和申诉惩戒。" },
    faq: { title: "常见问题", summary: "集中查看军队文职报考、选岗、备考、体检、政审和入职相关高频问题。" }
  };

  const PROCESS_STEPS = [
    {
      title: "了解考试",
      stage: "第一阶段",
      desc: "先了解军队文职是什么、适合哪些人、整体考试节奏和主要报考限制。",
      focus: "建立基本判断，不急着选岗位。",
      href: "guide.html",
      action: "看文职介绍"
    },
    {
      title: "资格审核",
      stage: "第一阶段",
      desc: "提前确认政审和体检要求，避免后续报名、入围后才发现限制。",
      focus: "先看能不能报，再决定怎么报。",
      href: "guide-qualification.html",
      action: "看资格审核"
    },
    {
      title: "智能匹配",
      stage: "第二阶段",
      desc: "输入学历、专业、地区等条件，由系统先筛出更适合优先关注的岗位方向。",
      focus: "先用推荐报告缩小范围，再结合岗位百科理解岗位内容。",
      href: "recommend.html",
      action: "智能推荐"
    },
    {
      title: "岗位选择",
      stage: "第二阶段",
      desc: "结合推荐结果继续查看岗位职责、日常工作、考试科目和常见招聘单位。",
      focus: "先知道岗位是干什么的，再决定是否重点关注。",
      href: "job-list.html",
      action: "看岗位百科"
    },
    {
      title: "开始备考",
      stage: "第三阶段",
      desc: "确认公共科目和专业科目，制定复习计划，先用真题判断题型和难度。",
      focus: "先看大纲，再做真题。",
      href: "guide-exam.html",
      action: "看考试科目"
    },
    {
      title: "公告发布",
      stage: "第四阶段",
      desc: "关注年度招考公告、岗位计划、报名时间、考试时间和资格条件变化。",
      focus: "公告发布后，以当年公告为准。",
      href: "policy.html",
      action: "看政策"
    },
    {
      title: "网上报名",
      stage: "第四阶段",
      desc: "按公告要求填写报名信息、选择岗位、上传材料并完成报名确认。",
      focus: "信息、专业名称和岗位代码要反复核对。",
      href: "guide-process.html#registration",
      action: "看报名流程"
    },
    {
      title: "打印准考证",
      stage: "第四阶段",
      desc: "在规定时间内下载并打印准考证，提前确认考点、交通和考试用品。",
      focus: "不要临近考试才打印。",
      href: "guide-process.html#registration",
      action: "看报名流程"
    },
    {
      title: "笔试",
      stage: "第三阶段",
      desc: "参加公共科目和专业科目考试，按准考证要求到指定考点应试。",
      focus: "公共科目和专业科目都不能忽视。",
      href: "papers.html",
      action: "看真题"
    },
    {
      title: "成绩公布",
      stage: "第五阶段",
      desc: "查询笔试成绩和入围情况，判断是否进入后续面试、体检等环节。",
      focus: "关注入围名单和后续通知。",
      href: "policy.html",
      action: "看公告"
    },
    {
      title: "面试",
      stage: "第五阶段",
      desc: "按照用人单位安排参加面试或专业能力考核，展示岗位匹配度。",
      focus: "提前熟悉岗位职责和单位特点。",
      href: "job-list.html",
      action: "看岗位百科"
    },
    {
      title: "体检",
      stage: "第五阶段",
      desc: "按通知参加体检，重点关注通用标准、补充标准和岗位特殊要求。",
      focus: "有疑问提前查标准，不要靠猜。",
      href: "guide-qualification.html#medical",
      action: "看体检标准"
    },
    {
      title: "政治考核",
      stage: "第五阶段",
      desc: "配合完成政治考核、材料核验和相关调查，保持材料真实一致。",
      focus: "如实填写，提前准备证明材料。",
      href: "guide-qualification.html#political",
      action: "看政审说明"
    },
    {
      title: "公示录用",
      stage: "第五阶段",
      desc: "通过综合考察后进入公示、审批和录用环节，按要求完成后续手续。",
      focus: "关注公示名单和单位通知。",
      href: "policy.html",
      action: "看最新公告"
    }
  ];

  const MEDICAL_SECTIONS = ["身高", "视力", "BMI", "纹身", "色弱"];
  const POLITICAL_SECTIONS = ["政治考核流程", "考核内容", "注意事项", "常见问题"];
  const EXAM_SECTIONS = ["公共科目", "专业科目"];
  const JOB_DATABASE_URL = "data/job-database.csv?v=20260705";
  const EXAM_OUTLINE_URL = "data/exam-outline.json?v=20260705";
  const EXAM_INTRO_URL = "data/exam-subject-introductions.json?v=20260705";
  const PAPERS_URL = "data/papers.json?v=20260706";
  const MEDICAL_URL = "data/guide/medical.json?v=20260705";
  const POLITICAL_URL = "data/guide/political.json?v=20260705";
  const FAQ_URL = "data/guide/faq.json?v=20260705";
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

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function stars(value) {
    if (typeof value === "string" && value.includes("★")) {
      return value.trim();
    }
    const count = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
    return "★★★★★".split("").map((star, index) => index < count ? star : "☆").join("");
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

  async function loadJobCsv() {
    const response = await fetch(JOB_DATABASE_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`${JOB_DATABASE_URL} ${response.status}`);
    return parseCsv(await response.text());
  }

  function renderNav(activeKey, subNav = []) {
    return `<aside class="guide-sidebar"><nav class="guide-nav" aria-label="报考指南导航">
      ${GUIDE_NAV.map(item => `
        <a href="${item.href}" class="${item.key === activeKey ? "active" : ""}">
          <span>${item.title}</span>
          <span>›</span>
        </a>
      `).join("")}
    </nav>
    ${subNav.length ? `
      <div class="guide-subnav">
        <div class="guide-subnav-title">二级分类</div>
        ${subNav.map(item => `
          <a href="#${escapeHtml(item.id)}">
            <span>${escapeHtml(item.label)}</span>
            ${item.count != null ? `<em>${escapeHtml(item.count)}</em>` : ""}
          </a>
        `).join("")}
      </div>
    ` : ""}
    </aside>`;
  }

  function renderHero(meta) {
    return `<section class="guide-hero">
      <div class="guide-kicker">报考指南</div>
      <h1>${escapeHtml(meta.title)}</h1>
      <p>${escapeHtml(meta.summary)}</p>
    </section>`;
  }

  function renderShell(activeKey, innerHtml, options = {}) {
    return `${options.showHero ? renderHero(PAGE_META[activeKey] || PAGE_META.home) : ""}
      <div class="guide-layout guide-layout-single">
        <main class="guide-content">${innerHtml}</main>
      </div>`;
  }

  function makeSectionId(prefix, index) {
    return `${prefix}-${index + 1}`;
  }

  function renderEmpty(title, text) {
    return `<div class="guide-empty">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
    </div>`;
  }

  async function loadJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${url} ${response.status}`);
    return response.json();
  }

  function normalizeItems(raw) {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    return [];
  }

  function renderHome() {
    return renderShell("home", `
      <article class="guide-section civilian-intro-article">
        <div class="guide-section-head">
          <div>
            <h2>军队文职全面介绍</h2>
            <p class="guide-muted">从定义、身份定位、岗位职责、招考类型和考试规则几个角度，先把军队文职这件事讲清楚。</p>
          </div>
        </div>
        <div class="civilian-intro-lead">
          <strong>一句话理解</strong>
          <p>军队文职是军队编制岗位中的非现役人员，主要承担管理、专业技术、技能保障等工作，是军队作战、训练、科研、医疗、后勤等体系的重要支撑力量。</p>
        </div>
        <section class="civilian-intro-section">
          <h3>一、军队文职是什么</h3>
          <p>军队文职人员是按照《中国人民解放军文职人员条例》规定，在军队编制岗位任职，从事<span class="article-keyword">军民通用</span>、<span class="article-keyword">非直接参与作战</span>、社会化保障不宜承担的管理、专业技术、技能保障工作的非服兵役人员。</p>
          <p>它不同于现役军人、公务员、事业编和合同工，属于<span class="article-keyword">军队专属编制岗位工作人员</span>，主要为军队作战、训练、后勤、科研、保障等工作提供专业化支撑。</p>
          <p>简单说，军队文职通常<span class="article-keyword">不参军服役、无军衔</span>，但享受军队专属薪酬福利和保障体系，从事军队日常管理、技术研发、医疗教学、后勤实操保障等工作。</p>
        </section>

        <section class="civilian-intro-section">
          <h3>二、身份与定位</h3>
          <div class="civilian-intro-grid">
            <article>
              <span>身份属性</span>
              <p>文职人员属于<span class="article-keyword">国家工作人员</span>，纳入军队正式人员编制，依法享有相应权利、履行相应义务，并非临时工或劳务派遣人员。</p>
            </article>
            <article>
              <span>岗位定位</span>
              <p>核心定位是军队作战支援保障力量，聚焦<span class="article-keyword">非战斗、强保障、专业化</span>，弥补专业技术、行政管理和实操保障领域的人力需求。</p>
            </article>
          </div>
          <p>文职人员日常立足岗位履职，根据军队统一安排，也可能参加军事训练、战备执勤，承担非战争军事行动保障任务，战时依法承担相应作战支援保障工作。</p>
        </section>

        <section class="civilian-intro-section">
          <h3>三、主要岗位职责</h3>
          <div class="civilian-job-types">
            <article>
              <strong>管理岗</strong>
              <p>负责军队机关、基层单位的行政管理与综合统筹，如公文处理、人事管理、考勤考核、会务组织、物资统筹、制度落实和日常事务管理。</p>
            </article>
            <article>
              <strong>专业技术岗</strong>
              <p>依托专业知识开展技术型、科研型、服务型工作，覆盖医疗、护理、教学、科研、工程、会计、新闻、翻译、计算机、文体等领域。</p>
            </article>
            <article>
              <strong>技能岗</strong>
              <p>侧重一线实操保障，常见岗位包括司机、炊事员、保管员、设备检修工、文印员、卫生员、勤务保障等。</p>
            </article>
            <article>
              <strong>文体岗</strong>
              <p>服务军队文化建设、文体宣传、强军氛围营造，涵盖声乐、舞蹈、器乐、编导、体育专项、播音主持等特色岗位。</p>
            </article>
          </div>
        </section>

        <section class="civilian-intro-section">
          <h3>四、招考类型与考试规则</h3>
          <div class="civilian-exam-compare">
            <article>
              <h4>管理岗、专业技术岗</h4>
              <p>这是主流招考类型，面向全社会公开招考，岗位覆盖面广，通常<span class="article-keyword">每年10月底至11月初发布公告</span>，12月中旬组织全军统一笔试。</p>
              <ul>
                <li>考试形式：线下闭卷笔试 + 结构化面试。</li>
                <li>笔试科目：公共科目 + 专业科目，两科一张试卷、一次考完。</li>
                <li>普通岗位通常先笔试后面试。</li>
                <li>艺术、体育、播音等文体特色岗位通常<span class="article-keyword">先专业面试，后统一笔试</span>。</li>
              </ul>
            </article>
            <article>
              <h4>专业技能岗</h4>
              <p>技能岗聚焦实操保障岗位，报考门槛相对更低，部分岗位高中及以上学历即可报考，公告多由各部队、各单位分批发布。</p>
              <ul>
                <li>招考时间：多集中在每年3月至12月，时间不完全固定。</li>
                <li>考试形式：理论笔试 + 专业技能实操考核。</li>
                <li>部分岗位可免笔试，直接进行技能考核。</li>
                <li>录用更看重岗位实际操作能力。</li>
              </ul>
            </article>
          </div>
        </section>

        <section class="civilian-intro-section">
          <h3>五、核心总结</h3>
          <div class="civilian-summary-list">
            <p><span>01</span>身份定位：军队正式在编人员、国家工作人员，非现役、非公务员、非普通事业编。</p>
            <p><span>02</span>岗位分类：管理岗、专业技术岗、文体岗、技能岗四类，各自职责和考试方式不同。</p>
            <p><span>03</span>统考岗位：管理岗、普通专业技术岗、文体岗通常一年一考，10-11月公告，12月笔试。</p>
            <p><span>04</span>技能岗位：分批招考，考理论和实操，门槛相对更低，侧重实际技能。</p>
          </div>
        </section>
      </article>
    `);
  }

  function renderQualificationContent(politicalData, medicalItems) {
    const politicalItems = normalizeItems(politicalData);
    const defaultItem = politicalItems[0] || medicalItems[0] || null;
    return renderShell("qualification", `
      <section class="guide-section">
        <div class="guide-section-head">
          <div>
            <h2>资格审核</h2>
            <p class="guide-muted">左侧按政审、体检展开分类，点击小类别直接定位到对应原文内容。</p>
          </div>
        </div>
        <div class="guide-status-layout">
          <aside class="guide-status-nav" aria-label="资格审核分类">
            <details open>
              <summary>政审</summary>
              ${politicalItems.map(item => `
                <button type="button" class="${item === defaultItem ? "active" : ""}" data-qualification-kind="political" data-qualification-id="${escapeHtml(item.id)}">
                  <span>${escapeHtml(shortPoliticalTitle(item.title || "政审内容"))}</span>
                </button>
              `).join("")}
            </details>
            <details>
              <summary>体检</summary>
              ${medicalItems.map(item => `
                <button type="button" data-qualification-kind="medical" data-qualification-id="${escapeHtml(item.id)}">
                  <span>${escapeHtml(item.title || item.category || "体检标准")}</span>
                </button>
              `).join("")}
            </details>
          </aside>
          <article class="guide-status-content qualification-reader" id="qualification-reader"></article>
        </div>
      </section>
    `);
  }

  async function renderQualification(app) {
    app.innerHTML = renderShell("qualification", `
      <section class="guide-section">
        ${renderEmpty("正在读取资格审核内容", "系统正在加载政审与体检标准。")}
      </section>
    `);

    try {
      const [politicalData, medicalData] = await Promise.all([
        loadJson(POLITICAL_URL),
        loadJson(MEDICAL_URL)
      ]);
      const politicalItems = normalizeItems(politicalData);
      const medicalItems = normalizeItems(medicalData);
      app.innerHTML = renderQualificationContent(politicalData, medicalItems);
      initQualificationReader(politicalItems, medicalItems);
    } catch (error) {
      app.innerHTML = renderShell("qualification", `
        <section class="guide-section">
          ${renderEmpty("资格审核内容读取失败", "请确认政审和体检标准数据存在且格式正确。")}
        </section>
      `);
      console.error(error);
    }
  }

  function renderQualificationArticle(kind, item) {
    if (!item) return renderEmpty("暂无内容", "当前分类还没有对应正文。");
    const isPolitical = kind === "political";
    return `
      <div class="qualification-reader-head">
        <span>${isPolitical ? "政审" : escapeHtml(item.category || "体检")}</span>
        <h3>${escapeHtml(item.title || "未命名内容")}</h3>
        ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
      </div>
      <div class="qualification-reader-body ${isPolitical ? "political-content" : ""}">
        ${isPolitical ? formatPoliticalContent(item.content) : formatGuideContent(item.content)}
      </div>
    `;
  }

  function initQualificationReader(politicalItems, medicalItems) {
    const reader = document.getElementById("qualification-reader");
    const buttons = Array.from(document.querySelectorAll("[data-qualification-id]"));
    const politicalMap = new Map(politicalItems.map(item => [String(item.id), item]));
    const medicalMap = new Map(medicalItems.map(item => [String(item.id), item]));

    function select(kind, id) {
      buttons.forEach(button => button.classList.toggle(
        "active",
        button.dataset.qualificationKind === kind && button.dataset.qualificationId === id
      ));
      const item = kind === "political" ? politicalMap.get(id) : medicalMap.get(id);
      if (reader) reader.innerHTML = renderQualificationArticle(kind, item);
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        select(button.dataset.qualificationKind || "political", button.dataset.qualificationId || "");
      });
    });

    function selectFromHash() {
      const hash = decodeURIComponent(location.hash || "").replace(/^#/, "");
      const targetKind = hash === "medical" ? "medical" : hash === "political" ? "political" : "";
      const target = targetKind
        ? buttons.find(button => button.dataset.qualificationKind === targetKind)
        : buttons[0];
      if (!target) return;
      const group = target.closest("details");
      if (group) group.open = true;
      select(target.dataset.qualificationKind || "political", target.dataset.qualificationId || "");
    }

    window.addEventListener("hashchange", selectFromHash);
    selectFromHash();
  }

  function renderRegistrationPlaceholder() {
    const registrationSteps = [
      "阅读招考公告、下载岗位计划表，核对自身报考条件",
      "登录军队人才网（81rc.mil.cn），进入对应招考报名入口，下载官方照片处理工具",
      "新用户注册账号（身份证、手机号、邮箱验证），完成登录",
      "如实填写个人信息：学历、工作经历、户籍、优待加分身份等",
      "筛选岗位代码，选定报考岗位并选择笔试考试城市",
      "使用官方工具处理证件照，上传学历、资格证、户籍等全部佐证材料",
      "核对全部信息无误，提交申请进入资格初审",
      "等待单位初审反馈：审核不通过可在规定时限内改报其他岗位；审核通过岗位不可修改",
      "初审合格人员在缴费时段完成网上缴费，逾期未缴费视为自动放弃报考",
      "缴费成功后打印报名回执留存",
      "笔试前规定时间登录系统，打印笔试准考证，凭准考证参加统一笔试"
    ];
    return renderShell("process", `
      <section class="guide-section registration-flow-section">
        <div class="guide-section-head">
          <div>
            <h2>报名流程</h2>
            <p class="guide-muted">按实际报名顺序整理，从阅读公告到打印准考证，适合作为报名前自查清单。</p>
          </div>
        </div>
        <div class="registration-flow-list">
          ${registrationSteps.map((step, index) => `
            <article class="registration-flow-step">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <p>${formatRegistrationStep(step)}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `);
  }

  function formatRegistrationStep(text) {
    const highlighted = escapeHtml(text)
      .replaceAll("招考公告", '<span class="article-keyword">招考公告</span>')
      .replaceAll("岗位计划表", '<span class="article-keyword">岗位计划表</span>')
      .replaceAll("自身报考条件", '<span class="article-keyword">自身报考条件</span>')
      .replaceAll("军队人才网（81rc.mil.cn）", '<a class="registration-inline-link" href="https://81rc.mil.cn" target="_blank" rel="noopener">军队人才网（81rc.mil.cn）</a>')
      .replaceAll("官方照片处理工具", '<span class="article-keyword">官方照片处理工具</span>')
      .replaceAll("身份证、手机号、邮箱验证", '<span class="article-keyword">身份证、手机号、邮箱验证</span>')
      .replaceAll("个人信息", '<span class="article-keyword">个人信息</span>')
      .replaceAll("岗位代码", '<span class="article-keyword">岗位代码</span>')
      .replaceAll("笔试考试城市", '<span class="article-keyword">笔试考试城市</span>')
      .replaceAll("全部佐证材料", '<span class="article-keyword">全部佐证材料</span>')
      .replaceAll("资格初审", '<span class="article-keyword">资格初审</span>')
      .replaceAll("审核不通过", '<span class="article-keyword">审核不通过</span>')
      .replaceAll("审核通过岗位不可修改", '<span class="article-keyword">审核通过岗位不可修改</span>')
      .replaceAll("网上缴费", '<span class="article-keyword">网上缴费</span>')
      .replaceAll("自动放弃报考", '<span class="article-keyword">自动放弃报考</span>')
      .replaceAll("报名回执", '<span class="article-keyword">报名回执</span>')
      .replaceAll("笔试准考证", '<span class="article-keyword">笔试准考证</span>');
    return highlighted;
  }

  function renderProcess() {
    const stageOrder = ["第一阶段", "第二阶段", "第三阶段", "第四阶段", "第五阶段"];
    const stageMeta = {
      "第一阶段": { title: "了解考试", desc: "先建立完整认知，确认自己要看什么。" },
      "第二阶段": { title: "选择岗位", desc: "用推荐缩小范围，再理解岗位本身。" },
      "第三阶段": { title: "开始备考", desc: "明确科目、大纲和真题资料。" },
      "第四阶段": { title: "正式报名", desc: "跟着公告时间完成报名与审核。" },
      "第五阶段": { title: "上岸录用", desc: "完成成绩、面试、体检、政审与录用。" }
    };
    const grouped = stageOrder.map(stage => ({
      stage,
      ...stageMeta[stage],
      steps: PROCESS_STEPS.filter(step => step.stage === stage)
    }));

    return renderShell("process", `
      <section class="guide-section process-roadmap-section">
        <div class="guide-section-head">
          <div>
            <h2>军队文职上岸流程图</h2>
            <p class="guide-muted">按考生真实决策顺序整理成思维导图：先了解，再选岗，再备考，最后完成报名和录用流程。</p>
          </div>
        </div>
        <div class="process-mindmap" aria-label="军队文职上岸思维导图">
          <div class="process-mindmap-core">
            <span>军队文职</span>
            <strong>上岸路径</strong>
            <em>从了解考试到正式录用</em>
          </div>
          <div class="process-mindmap-branches">
            ${grouped.map((group, groupIndex) => `
              <section class="process-branch process-branch-${groupIndex + 1}">
                <div class="process-branch-head">
                  <span>${escapeHtml(group.stage)}</span>
                  <strong>${escapeHtml(group.title)}</strong>
                  <em>${escapeHtml(group.desc)}</em>
                </div>
                <div class="process-branch-nodes">
                  ${group.steps.map(step => `
                    <a class="process-node" id="${getProcessAnchor(step.title)}" href="${step.href}">
                      <span>${String(PROCESS_STEPS.indexOf(step) + 1).padStart(2, "0")}</span>
                      <strong>${escapeHtml(step.title)}</strong>
                      <em>${escapeHtml(step.focus)}</em>
                    </a>
                  `).join("")}
                </div>
              </section>
            `).join("")}
          </div>
        </div>
        <div class="process-note-card">
          <strong>阅读建议</strong>
          <p>第一次报考建议按顺序走完整流程；已经明确方向的用户，可以直接从“AI岗位推荐”“考试科目”“真题中心”进入。</p>
        </div>
      </section>
    `);
  }

  function getProcessAnchor(title) {
    const map = {
      "公告发布": "notice",
      "网上报名": "registration",
      "资格审核": "qualification",
      "面试": "interview",
      "公示录用": "admission"
    };
    return map[title] || "";
  }

  function getSubjectParam() {
    return new URLSearchParams(location.search).get("subject") || "";
  }

  function normalizeExamData(outline, introductions) {
    const introItems = Array.isArray(introductions?.subjects) ? introductions.subjects : normalizeItems(introductions);
    const introMap = new Map(introItems.map(item => [String(item.id), item]));
    const subjects = normalizeItems(outline?.subjects || outline).map(subject => ({
      ...subject,
      introduction: introMap.get(String(subject.id)) || null
    }));
    return { meta: outline?.meta || {}, subjects };
  }

  async function loadExamData() {
    const [outline, introductions] = await Promise.all([
      loadJson(EXAM_OUTLINE_URL),
      loadJson(EXAM_INTRO_URL)
    ]);
    return normalizeExamData(outline, introductions);
  }

  function findExamSubject(subjects, value) {
    const query = String(value || "").trim();
    if (!query) return null;
    const decoded = decodeURIComponent(query);
    return subjects.find(subject => String(subject.id) === decoded || subject.name === decoded) || null;
  }

  function normalizeSubjectName(value) {
    return String(value || "")
      .replace(/专业科目|考试专业科目|科目|类/g, "")
      .replace(/\s+/g, "")
      .trim();
  }

  function subjectAliases(name) {
    const normalized = normalizeSubjectName(name);
    const aliases = new Set([normalized, String(name || "").trim()]);
    if (normalized === "图书") aliases.add("图书档案学").add("档案学");
    if (normalized === "档案") aliases.add("图书档案学").add("档案学");
    if (normalized === "公共") aliases.add("公共科目");
    return Array.from(aliases).filter(Boolean);
  }

  function getSubjectPapers(subject, papers) {
    const aliases = subjectAliases(subject.name);
    return normalizeItems(papers).filter(paper => {
      const paperSubject = normalizeSubjectName(paper.subject || paper.major || "");
      return aliases.some(alias => paperSubject === normalizeSubjectName(alias));
    }).sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  }

  function subjectOverview(subject) {
    const overview = subject.overview || {};
    const detectedQuestion = detectQuestionType(subject);
    return {
      summary: overview.summary || subject.features || subject.key_features || `${subject.name}考试科目说明。`,
      fullScore: overview.fullScore || subject["满分"] || 100,
      duration: overview.durationText || (subject["考试时长_min"] ? `${subject["考试时长_min"]}分钟` : "120分钟"),
      questionType: detectedQuestion.questionType,
      hasSubjective: detectedQuestion.hasSubjective ? "是" : "否",
      applicableJobs: overview.applicableJobs || subject.target || "以岗位要求为准",
      majorCategory: overview.majorCategory || subject.category || "专业科目"
    };
  }

  function subjectIntroLead(subject) {
    const firstSection = subject.introduction?.sections?.[0];
    return firstSection?.paragraphs?.[0] || subjectOverview(subject).summary;
  }

  function subjectPartHighlights(subject) {
    const parts = Array.isArray(subject.parts) ? subject.parts : [];
    const chapters = parts.flatMap(part => Array.isArray(part.chapters) ? part.chapters : []);
    const source = chapters.length ? chapters : parts;
    return source
      .map(part => ({
        name: part.name || "重点模块",
        score: part.score,
        ratio: part.ratio,
        questionCount: part.question_count,
        points: part.key_points || part.topics || part.features || ""
      }))
      .filter(item => item.name || item.points)
      .slice(0, 6);
  }

  function renderSubjectQuickView(subject) {
    const overview = subjectOverview(subject);
    const highlights = subjectPartHighlights(subject);
    return `
      <section class="guide-section exam-quick-view" id="exam-quick-view">
        <div class="guide-section-head">
          <div>
            <h2>考试速览</h2>
            <p class="guide-muted">${escapeHtml(subjectIntroLead(subject))}</p>
          </div>
        </div>
        <div class="exam-quick-stats">
          <div><span>满分</span><strong>${escapeHtml(overview.fullScore)}分</strong></div>
          <div><span>考试时间</span><strong>${escapeHtml(overview.duration)}</strong></div>
          <div><span>题型</span><strong>${escapeHtml(overview.questionType)}</strong></div>
          <div><span>适用岗位</span><strong>${escapeHtml(overview.applicableJobs)}</strong></div>
        </div>
        ${highlights.length ? `
          <div class="exam-focus-list">
            ${highlights.map(item => `
              <article>
                <div>
                  <strong>${escapeHtml(item.name)}</strong>
                  <span>${[item.score != null ? `${item.score}分` : "", item.ratio ? `占比${item.ratio}` : "", item.questionCount ? `${item.questionCount}` : ""].filter(Boolean).join(" · ")}</span>
                </div>
                ${item.points ? `<p>${escapeHtml(item.points)}</p>` : ""}
              </article>
            `).join("")}
          </div>
        ` : ""}
      </section>
    `;
  }

  function detectQuestionType(subject) {
    const typeText = String(subject["题型"] || "");
    const featureText = String(subject.features || "");
    const sourceText = `${typeText} ${featureText}`;
    const partsText = Array.isArray(subject.parts)
      ? subject.parts.map(part => `${part.name || ""} ${part.ratio || ""} ${part.topics || ""}`).join(" ")
      : "";
    const explicitNoSubjective = /全客观|客观性试题|无主观题/.test(sourceText);
    const explicitSubjective = /含主观题|客观题\+主观题/.test(sourceText) || /主观\d*分|主观写作|主观题/.test(partsText);
    const hasSubjective = explicitSubjective && !explicitNoSubjective;
    return {
      hasSubjective,
      questionType: typeText || (hasSubjective ? "客观+主观" : "全客观题")
    };
  }

  function renderExamList(subjects) {
    const publicSubjects = subjects.filter(subject => subject.category === "公共科目");
    const professionalSubjects = subjects.filter(subject => subject.category !== "公共科目");
    const categories = [...new Set(professionalSubjects.map(subject => subject.category).filter(Boolean))];
    const groupedCategories = [
      { label: "公共科目", subjects: publicSubjects },
      ...categories.map(category => ({
        label: category,
        subjects: professionalSubjects.filter(subject => subject.category === category)
      }))
    ].filter(group => group.subjects.length);

    const flatSubjects = groupedCategories.flatMap((group, groupIndex) =>
      group.subjects.map((subject, subjectIndex) => ({
        subject,
        anchorId: subjectIndex === 0 ? makeSectionId("exam-category", groupIndex) : ""
      }))
    );

    function card(subject, anchorId = "") {
      const overview = subjectOverview(subject);
      return `<a class="exam-subject-card" ${anchorId ? `id="${anchorId}"` : ""} href="guide-exam.html?subject=${encodeURIComponent(subject.id)}">
        <div class="exam-subject-card-head">
          <span>${escapeHtml(overview.majorCategory)}</span>
          <strong>${escapeHtml(overview.fullScore)}分</strong>
        </div>
        <h3>${escapeHtml(subject.name)}</h3>
        <div class="exam-subject-card-meta">
          <span>${escapeHtml(overview.duration)}</span>
          <span>${overview.hasSubjective === "是" ? "含主观题" : "客观题"}</span>
        </div>
      </a>`;
    }

    return `
      <section class="guide-section">
        <div class="guide-section-head">
          <div>
            <h2>考试科目</h2>
            <p class="guide-muted">先确认自己报考岗位要求的专业科目，再查看对应大纲、分值和下载资料。</p>
          </div>
          <a class="guide-head-link" href="recommend.html">不知道考哪科？先做 AI 推荐 →</a>
        </div>
        <div class="exam-helper-panel">
          <div>
            <strong>公共科目</strong>
            <span>所有考生都需要准备，建议优先做历年公共科目真题。</span>
          </div>
          <div>
            <strong>专业科目</strong>
            <span>由岗位要求决定，先看推荐报告或岗位详情中的考试专业科目。</span>
          </div>
          <div>
            <strong>下载资料</strong>
          <span>进入科目详情后，可查看官方大纲、考试介绍和配套资料下载区。</span>
          </div>
        </div>
        <div class="guide-status-layout">
          <aside class="guide-status-nav" aria-label="考试科目分类">
            <details open>
              <summary>考试科目</summary>
              ${groupedCategories.map((group, index) => `
                <a href="#${makeSectionId("exam-category", index)}">
                  <span>${escapeHtml(group.label)}</span>
                  <em>${group.subjects.length}</em>
                </a>
              `).join("")}
            </details>
          </aside>
          <div class="guide-status-content">
            <div class="exam-subject-grid exam-subject-grid-compact">
              ${flatSubjects.map(item => card(item.subject, item.anchorId)).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderIntroSections(subject) {
    const sections = subject.introduction?.sections || [];
    if (!sections.length) {
      return renderEmpty("暂无考试介绍", "请确认 Word 正文已完成转换并写入 data/exam-subject-introductions.json。");
    }
    return `<div class="exam-rich-content">
      ${sections.map(section => {
        const paragraphs = section.paragraphs || [];
        return `
        <section class="exam-rich-section">
          <h3>${escapeHtml(section.title)}</h3>
          <div class="knowledge-content exam-knowledge-content">
            ${paragraphs.map((text, index) => index === 0
              ? `<p class="exam-intro-lead">${escapeHtml(text)}</p>`
              : formatKnowledgeLine(text)).join("")}
          </div>
        </section>
      `;
      }).join("")}
    </div>`;
  }

  function renderOutlineMeta(item) {
    const entries = [
      item.score != null ? `分值 ${item.score}` : "",
      item.ratio ? `占比 ${item.ratio}` : "",
      item.question_count ? `题量 ${item.question_count}` : "",
      item.per_question_score ? `每题 ${item.per_question_score}分` : ""
    ].filter(Boolean);
    if (!entries.length) return "";
    return `<div class="exam-outline-meta">${entries.map(entry => `<span>${escapeHtml(entry)}</span>`).join("")}</div>`;
  }

  function renderOutlineBody(item) {
    const chapters = Array.isArray(item.chapters) ? item.chapters : [];
    if (chapters.length) {
      return `<div class="exam-outline-chapters">
        ${chapters.map(chapter => `
          <article class="exam-outline-chapter">
            <div>
              <h4>${escapeHtml(chapter.name || "知识点")}</h4>
              ${renderOutlineMeta(chapter)}
            </div>
            ${chapter.key_points ? formatKnowledgeLine(`知识点：${chapter.key_points}`) : ""}
            ${chapter.topics ? formatKnowledgeLine(`考查内容：${chapter.topics}`) : ""}
            ${chapter.features ? formatKnowledgeLine(`重点说明：${chapter.features}`) : ""}
          </article>
        `).join("")}
      </div>`;
    }

    return `<div class="exam-outline-plain">
      ${item.topics ? formatKnowledgeLine(`考查内容：${item.topics}`) : ""}
      ${item.key_points ? formatKnowledgeLine(`知识点：${item.key_points}`) : ""}
      ${item.features ? formatKnowledgeLine(`重点说明：${item.features}`) : ""}
      ${!item.topics && !item.key_points && !item.features ? `<p>暂无章节说明，后续可在 JSON 中补充。</p>` : ""}
    </div>`;
  }

  function renderOutline(subject) {
    const parts = Array.isArray(subject.parts) ? subject.parts : [];
    if (!parts.length) {
      return renderEmpty("暂无考试大纲", "请确认 data/exam-outline.json 中已配置 parts 章节。");
    }
    return `<div class="exam-outline-list">
      ${parts.map((part, index) => `
        <details class="exam-outline-detail">
          <summary>
            <span class="exam-outline-index">${index + 1}</span>
            <strong>${escapeHtml(part.name || `第${index + 1}章`)}</strong>
            ${renderOutlineMeta(part)}
          </summary>
          ${renderOutlineBody(part)}
        </details>
      `).join("")}
    </div>`;
  }

  function renderRelatedPapers(subject, papers) {
    const related = getSubjectPapers(subject, papers).slice(0, 6);
    const paperUrl = `papers.html?subject=${encodeURIComponent(subject.name)}`;
    return `<section class="guide-section exam-related-paper-section" id="exam-papers">
      <div class="guide-section-head">
        <div>
          <h2>${escapeHtml(subject.name)}历年真题</h2>
          <p class="guide-muted">根据 data/papers.json 自动匹配当前科目的真题资料。</p>
        </div>
        <a class="btn btn-outline btn-sm" href="${paperUrl}">查看全部真题</a>
      </div>
      ${related.length ? `
        <div class="exam-related-paper-grid">
          ${related.map(paper => `
            <article class="exam-related-paper-card">
              <div>
                <h3>${escapeHtml(paper.title)}</h3>
                <p>${escapeHtml(paper.year)}年 · ${escapeHtml(paper.paperType || "真题资料")} · ${escapeHtml(paper.size || "PDF")}</p>
              </div>
              <div class="exam-related-paper-actions">
                <a class="btn btn-outline btn-sm" href="${escapeHtml(paper.path)}" target="_blank">在线预览</a>
                <a class="btn btn-primary btn-sm" href="${escapeHtml(paper.path)}" download="${escapeHtml(paper.filename || paper.title)}">下载</a>
              </div>
            </article>
          `).join("")}
        </div>
      ` : renderEmpty("暂无对应真题", "当前科目暂未在真题中心匹配到资料，后续补充后会自动显示。")}
    </section>`;
  }

  function renderDownloadSection(subject) {
    const outlineUrl = subject.pdf || subject.outline_pdf || subject.download_url || "data/exam-outline.json";
    const introUrl = "data/exam-subject-introductions.json";
    const truePaperUrl = `papers.html?subject=${encodeURIComponent(subject.name)}`;
    return `<section class="guide-section exam-download-section" id="exam-download">
      <div class="guide-section-head">
        <div>
          <h2>资料下载</h2>
          <p class="guide-muted">当前可下载结构化大纲与科目介绍数据，真题资料进入真题中心获取。</p>
        </div>
      </div>
      <div class="exam-download-grid">
        <article class="exam-download-card">
          <span>01</span>
          <h3>官方考试大纲</h3>
          <p>下载全科目结构化考试大纲 JSON，包含章节、分值、题量和重点说明。</p>
          <a class="btn btn-primary btn-sm" href="${escapeHtml(outlineUrl)}" download>下载大纲数据</a>
        </article>
        <article class="exam-download-card">
          <span>02</span>
          <h3>科目详细介绍</h3>
          <p>下载由 Word 转换后的科目介绍数据，包含考试介绍、题型、分值和备考建议。</p>
          <a class="btn btn-primary btn-sm" href="${escapeHtml(introUrl)}" download>下载科目介绍</a>
        </article>
        <article class="exam-download-card">
          <span>03</span>
          <h3>历年真题</h3>
          <p>跳转真题中心查看相关试卷。</p>
          <a class="btn btn-primary btn-sm" href="${truePaperUrl}">进入真题中心</a>
        </article>
      </div>
    </section>`;
  }

  function renderExamDetail(subject, papers = []) {
    const overview = subjectOverview(subject);
    return `
      <section class="exam-detail-titlebar">
        <div class="exam-detail-copy">
          <h1>${escapeHtml(subject.name)}</h1>
          <div class="exam-title-tags">
            <span>${escapeHtml(overview.majorCategory)}</span>
            <span>${escapeHtml(overview.fullScore)}分</span>
            <span>${escapeHtml(overview.duration)}</span>
            <span>${escapeHtml(overview.hasSubjective === "是" ? "含主观题" : "客观题")}</span>
          </div>
        </div>
        <a class="exam-back-link" href="guide-exam.html">返回考试科目列表</a>
      </section>

      ${renderSubjectQuickView(subject)}

      <section class="guide-section exam-intro-section" id="exam-intro">
        <div class="guide-section-head">
          <div>
            <h2>考试介绍</h2>
            <p class="guide-muted">以下正文由 Word 内容转换为 HTML 富文本排版。</p>
          </div>
        </div>
        ${renderKnowledgeLegend()}
        ${renderIntroSections(subject)}
      </section>

      <section class="guide-section exam-outline-section" id="exam-outline">
        <div class="guide-section-head">
          <div>
            <h2>官方考试大纲</h2>
            <p class="guide-muted">按 JSON 章节动态生成，默认收起，点击章节展开查看知识点、考查内容和重点说明。</p>
          </div>
        </div>
        ${renderKnowledgeLegend()}
        ${renderOutline(subject)}
      </section>

      ${renderDownloadSection(subject)}
      ${renderRelatedPapers(subject, papers)}
    `;
  }

  async function renderExam(app) {
    app.innerHTML = renderShell("exam", `
      <section class="guide-section">
        ${renderEmpty("正在读取考试科目数据库", "系统正在加载 Word 转换正文与专业科目 JSON。")}
      </section>
    `);

    try {
      const [data, paperData] = await Promise.all([
        loadExamData(),
        loadJson(PAPERS_URL).catch(() => [])
      ]);
      const subject = findExamSubject(data.subjects, getSubjectParam());
      document.title = subject
        ? `${subject.name} - 专业科目详情 - 军队文职智能报考平台`
        : "考试科目 - 军队文职智能报考平台";
      const innerHtml = subject ? renderExamDetail(subject, paperData) : renderExamList(data.subjects);
      const subNav = subject
        ? [
          { id: "exam-quick-view", label: "考试速览" },
          { id: "exam-intro", label: "考试介绍" },
          { id: "exam-outline", label: "官方大纲" },
          { id: "exam-download", label: "资料下载" },
          { id: "exam-papers", label: "历年真题" }
        ]
        : [
          { label: "公共科目", subjects: data.subjects.filter(item => item.category === "公共科目") },
          ...[...new Set(data.subjects.filter(item => item.category !== "公共科目").map(item => item.category).filter(Boolean))]
            .map(category => ({
              label: category,
              subjects: data.subjects.filter(item => item.category === category)
            }))
        ].filter(group => group.subjects.length).map((group, index) => ({
          id: makeSectionId("exam-category", index),
          label: group.label,
          count: group.subjects.length
        }));
      app.innerHTML = renderShell("exam", innerHtml, { hideHero: Boolean(subject), subNav });
    } catch (error) {
      app.innerHTML = renderShell("exam", `
        <section class="guide-section">
          ${renderEmpty("考试科目数据读取失败", "请确认 data/exam-outline.json 和 data/exam-subject-introductions.json 存在且格式正确。")}
        </section>
      `);
      console.error(error);
    }
  }

  function renderPlaceholder(activeKey, titles, dataName) {
    return renderShell(activeKey, `
      <section class="guide-section">
        <div class="guide-section-head">
          <div>
            <h2>${PAGE_META[activeKey].title}</h2>
            <p class="guide-muted">已预留 ${dataName} 数据接口，正式内容后续导入。</p>
          </div>
        </div>
        <div class="guide-grid">
          ${titles.map(title => `
            <div class="guide-card">
              <h3>${title}</h3>
              <p>待数据库导入后显示详细内容。</p>
              <span class="guide-card-action">占位模块</span>
            </div>
          `).join("")}
        </div>
      </section>
    `);
  }

  function getKnowledgeTone(text) {
    const line = String(text || "");
    if (/不合格/.test(line)) return "risk";
    if (/^下列情况合格|合格。$|合格；$|合格$/.test(line) || /无并发症|无后遗症|无复发/.test(line)) return "safe";
    if (/重点关注|特别注意|必须|严禁|禁止|不得/.test(line)) return "note";
    return "";
  }

  function markMedicalKeywords(html) {
    const keywords = [
      "男性身高低于162cm",
      "女性身高低于158cm",
      "体重指数",
      "BMI",
      "空腹血糖",
      "糖化血红蛋白",
      "颅脑损伤",
      "甲状腺",
      "脊柱",
      "骨盆",
      "骨折",
      "强直性脊柱炎",
      "重度扁平足",
      "下蹲不全",
      "文身",
      "白癜风",
      "重度腋臭",
      "恶性肿瘤",
      "高血压",
      "血压",
      "心率",
      "支气管哮喘",
      "病毒性肝炎",
      "结核病",
      "癫痫",
      "晕血",
      "口吃",
      "耳语听力",
      "眩晕症",
      "嗅觉丧失",
      "裸眼视力",
      "矫正视力",
      "600度",
      "色盲",
      "色弱",
      "青光眼",
      "牙齿缺失",
      "精神分裂症",
      "抑郁症",
      "焦虑症"
    ];
    return keywords.reduce((result, keyword) => {
      const escaped = escapeHtml(keyword);
      return result.replaceAll(escaped, `<span class="medical-keyword">${escaped}</span>`);
    }, html);
  }

  function formatKnowledgeLine(text, options = {}) {
    const line = String(text || "").trim();
    if (!line) return "";
    const tone = getKnowledgeTone(line);
    const labelMatch = line.match(/^([^：:]{2,10})[：:](.+)$/);
    const renderText = value => {
      const escaped = escapeHtml(value);
      return options.markMedical ? markMedicalKeywords(escaped) : escaped;
    };
    const body = labelMatch
      ? `<strong>${escapeHtml(labelMatch[1])}：</strong>${renderText(labelMatch[2].trim())}`
      : renderText(line);
    return `<p class="knowledge-line${tone ? ` is-${tone}` : ""}">${body}</p>`;
  }

  function renderKnowledgeLegend() {
    return `<div class="knowledge-reading-guide" aria-label="阅读提示">
      <span><i class="risk"></i> 红线/不合格</span>
      <span><i class="safe"></i> 合格/影响较小</span>
      <span><i class="note"></i> 重点/注意</span>
    </div>`;
  }

  function normalizeKnowledgeParagraphs(text) {
    const rawLines = String(text || "")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);
    const result = [];
    let current = "";
    let skipIndex = -1;

    function flush() {
      if (!current.trim()) return;
      result.push(current.trim());
      current = "";
    }

    rawLines.forEach((line, index) => {
      if (index === skipIndex) return;
      const next = rawLines[index + 1] || "";
      if (/^第[一二三四五六七八九十百]+章/.test(line)) {
        flush();
        if (/^第[一二三四五六七八九十百]+章.{1,3}$/.test(line) && next && !/^第[一二三四五六七八九十百]+条|^第[一二三四五六七八九十百]+章|^（[一二三四五六七八九十]+）|^\d+[\.、]/.test(next)) {
          result.push(`${line}${next}`);
          skipIndex = index + 1;
          return;
        }
        result.push(line);
        return;
      }

      const startsNew = /^第[一二三四五六七八九十百]+条|^（[一二三四五六七八九十]+）|^\d+[\.、]/.test(line);
      if (startsNew) flush();

      current = current ? `${current}${line}` : line;

      if (/[。；;：:]$/.test(line) || /^第[一二三四五六七八九十百]+章/.test(current)) {
        flush();
      }
    });
    flush();

    return result
      .map(line => line.replace(/^(第[一二三四五六七八九十百]+章)(.+)$/, "$1 $2"))
      .filter((line, index, arr) => line && arr.indexOf(line) === index);
  }

  function formatGuideContent(text) {
    return normalizeKnowledgeParagraphs(text)
      .map(line => /^第[一二三四五六七八九十百]+章/.test(line)
        ? `<h4 class="knowledge-chapter">${escapeHtml(line)}</h4>`
        : formatKnowledgeLine(line, { markMedical: true }))
      .join("");
  }

  function formatPoliticalContent(text) {
    return String(text || "")
      .replace(/\n{2,}/g, "\n")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const escaped = escapeHtml(line);
        if (/^（[一二三四五六七八九十]+）/.test(line) || /^\d+\.\s/.test(line) || /^环节\d+：/.test(line)) {
          return `<h4 class="political-subtitle">${escaped}</h4>`;
        }
        if (/^案例\d+：/.test(line)) {
          return `<p class="political-line political-case">${escaped}</p>`;
        }
        if (/^核心前置结论/.test(line)) {
          return `<p class="political-line political-lead">${escaped}</p>`;
        }
    if (/一票否决|直接淘汰|不合格|零容错|红线|终身禁止|无任何例外/.test(line)) {
      return `<p class="political-line political-risk">${escaped}</p>`;
    }
    if (/无影响|不影响|可通过|完全无影响|合格|无惩戒/.test(line)) {
      return `<p class="political-line political-safe">${escaped}</p>`;
    }
    if (/注意事项|必须|禁止|严禁|不得|暂缓|存疑|申诉/.test(line)) {
      return `<p class="political-line political-note">${escaped}</p>`;
    }
        return `<p class="political-line">${escaped}</p>`;
      })
      .join("");
  }

  function renderMedicalItems(items) {
    if (!items.length) {
      return renderEmpty("暂无体检标准数据", "请确认 data/guide/medical.json 已写入体检标准内容。");
    }
    const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
    const groups = categories.map(category => ({
      label: category,
      items: items.filter(item => item.category === category)
    }));
    return `
      <section class="guide-section">
        <div class="guide-section-head">
          <div>
            <h2>体检标准知识库</h2>
            <p class="guide-muted">内容来源于《军队选拔军官和文职人员体检标准》及补充条款，已按模块整理为可阅读条目。</p>
          </div>
        </div>
        <div class="medical-category-row">
          ${groups.map((group, index) => `
            <a href="#${makeSectionId("medical-category", index)}">
              <span>${escapeHtml(group.label)}</span>
              <em>${group.items.length}</em>
            </a>
          `).join("")}
        </div>
        ${renderKnowledgeLegend()}
        ${groups.map((group, index) => `
          <section class="medical-category-section" id="${makeSectionId("medical-category", index)}">
            <div class="medical-category-title">
              <h3>${escapeHtml(group.label)}</h3>
              <span>${group.items.length} 条标准</span>
            </div>
            <div class="medical-standard-list">
              ${group.items.map(item => `
                <article class="medical-standard-card" id="${escapeHtml(item.id)}">
                  <div class="medical-standard-meta">
                    <span>${escapeHtml(item.category || "体检标准")}</span>
                    <span>${escapeHtml(item.id || "")}</span>
                  </div>
                  <h3>${escapeHtml(item.title || "未命名项目")}</h3>
                  <p class="medical-standard-summary">${escapeHtml(item.summary || "")}</p>
                  <details>
                    <summary>查看详细条款</summary>
                    <div class="medical-standard-content">${formatGuideContent(item.content)}</div>
                  </details>
                </article>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </section>
    `;
  }

  async function renderMedical(app) {
    app.innerHTML = renderShell("medical", `
      <section class="guide-section">
        ${renderEmpty("正在读取体检标准", "系统正在加载 data/guide/medical.json。")}
      </section>
    `);

    try {
      const items = normalizeItems(await loadJson(MEDICAL_URL));
      const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
      const subNav = categories.map((category, index) => ({
        id: makeSectionId("medical-category", index),
        label: category,
        count: items.filter(item => item.category === category).length
      }));
      app.innerHTML = renderShell("medical", renderMedicalItems(items), { subNav });
    } catch (error) {
      app.innerHTML = renderShell("medical", `
        <section class="guide-section">
          ${renderEmpty("体检标准数据读取失败", "请确认 data/guide/medical.json 存在且格式正确。")}
        </section>
      `);
      console.error(error);
    }
  }

  function renderPoliticalItems(items, intro = []) {
    if (!items.length) {
      return renderEmpty("暂无政治考核数据", "请确认 data/guide/political.json 已写入政治考核内容。");
    }
    return `
      <section class="guide-section">
        <div class="guide-section-head">
          <div>
            <h2>政治考核知识库</h2>
            <p class="guide-muted">内容来源于用户提供的政审 Word 文档，已按流程、考核内容、注意事项、疑难问题和申诉惩戒整理。</p>
          </div>
        </div>
        ${intro.length ? `
          <div class="political-intro-card">
            ${intro.map(item => `<p>${escapeHtml(item)}</p>`).join("")}
          </div>
        ` : ""}
        <div class="political-reading-guide" aria-label="阅读提示">
          <span><i class="risk"></i> 红线风险</span>
          <span><i class="safe"></i> 可通过/影响较小</span>
          <span><i class="note"></i> 注意事项</span>
          <span><i class="case"></i> 案例复盘</span>
        </div>
        <div class="medical-category-row guide-mini-nav" aria-label="政治考核分类导航">
          ${items.map(item => `
            <a href="#${escapeHtml(item.id)}">
              <span>${escapeHtml(shortPoliticalTitle(item.title || "政审内容"))}</span>
              <em>1</em>
            </a>
          `).join("")}
        </div>
        <div class="medical-standard-list">
          ${items.map(item => `
            <article class="medical-standard-card" id="${escapeHtml(item.id)}">
              <div class="medical-standard-meta">
                <span>政治考核</span>
                <span>${escapeHtml(item.id || "")}</span>
              </div>
              <h3>${escapeHtml(item.title || "未命名内容")}</h3>
              <p class="medical-standard-summary">${escapeHtml(item.summary || "")}</p>
              <details>
                <summary>查看详细内容</summary>
                <div class="medical-standard-content political-content">${formatPoliticalContent(item.content)}</div>
              </details>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function shortPoliticalTitle(title) {
    const text = String(title || "");
    if (/基础规则|底层逻辑/.test(text)) return "基础规则";
    if (/流程/.test(text)) return "政审流程";
    if (/考核内容/.test(text)) return "考核内容";
    if (/注意事项/.test(text)) return "注意事项";
    if (/疑难问题|常见/.test(text)) return "疑难问题";
    if (/补救|申诉/.test(text)) return "补救申诉";
    if (/材料/.test(text)) return "材料准备";
    if (/案例/.test(text)) return "案例复盘";
    return text.replace(/文职|政审|政治考核|（.*?）|\\(.+?\\)/g, "").slice(0, 8) || "政审内容";
  }

  async function renderPolitical(app) {
    app.innerHTML = renderShell("political", `
      <section class="guide-section">
        ${renderEmpty("正在读取政治考核", "系统正在加载 data/guide/political.json。")}
      </section>
    `);

    try {
      const data = await loadJson(POLITICAL_URL);
      app.innerHTML = renderShell("political", renderPoliticalItems(normalizeItems(data), Array.isArray(data?.intro) ? data.intro : []));
    } catch (error) {
      app.innerHTML = renderShell("political", `
        <section class="guide-section">
          ${renderEmpty("政治考核数据读取失败", "请确认 data/guide/political.json 存在且格式正确。")}
        </section>
      `);
      console.error(error);
    }
  }

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

  function getCategoryForFilter(name, sourceCategory) {
    return [getDisplayCategory(name, sourceCategory)];
  }

  function getSourceCategory(sourceCategory) {
    const text = String(sourceCategory || "");
    return text || "待分类";
  }

  function normalizeJobs(raw) {
    return raw.map(item => ({
      raw: item,
      id: item["序号"] || "",
      name: item["岗位名称"] || "",
      sourceCategory: getSourceCategory(item["来源类别"]),
      displayCategory: getDisplayCategory(item["岗位名称"], item["来源类别"]),
      categories: getCategoryForFilter(item["岗位名称"], item["来源类别"]),
      summary: item["一句话总结"] || "",
      recommendStars: item["推荐指数"] || ""
    }));
  }

  function renderJobCards(jobs) {
    if (!jobs.length) {
      return renderEmpty("暂无岗位百科数据", "岗位百科列表页已就绪。后续导入岗位卡数据库后，将自动生成岗位卡片并连接详情页。");
    }
    return `<div class="job-wiki-grid">
      ${jobs.map(job => `
        <article class="job-wiki-card">
          <div class="job-wiki-meta">
            <span class="job-wiki-tag">${escapeHtml(job.displayCategory)}</span>
            <span class="job-wiki-tag">${escapeHtml(stars(job.recommendStars))}</span>
          </div>
          <h3>${escapeHtml(job.name || "未命名岗位")}</h3>
          <p>${escapeHtml(job.summary)}</p>
          <div class="job-wiki-actions">
            <a class="btn btn-primary btn-sm" href="job-detail.html?id=${encodeURIComponent(job.id)}">查看详情</a>
          </div>
        </article>
      `).join("")}
    </div>`;
  }

  async function renderJobList(app) {
    const initialQuery = new URLSearchParams(location.search).get("q") || "";
    const state = { query: initialQuery, category: "全部", jobs: [] };
    app.innerHTML = renderShell("jobs", `
      <section class="guide-section">
        <div class="guide-section-head">
          <div>
            <h2>岗位百科列表</h2>
            <p class="guide-muted">先用三类岗位建立基本判断，再搜索具体岗位名称查看岗位职责、工作特点和考试科目。</p>
          </div>
          <a class="guide-head-link" href="recommend.html">已了解岗位？进入 AI 推荐 →</a>
        </div>
        <div class="job-type-guide">
          <article>
            <span>管理岗</span>
            <strong>偏组织协调、机关事务、计划管理</strong>
            <p>适合想了解参谋、干事、助理员等文员等级岗位的考生。</p>
          </article>
          <article>
            <span>技术岗</span>
            <strong>偏专业技术、科研教学、医疗工程</strong>
            <p>重点看专业是否对应，常见如工程师、医师、会计师、讲师等。</p>
          </article>
          <article>
            <span>技能岗</span>
            <strong>偏操作技能、保障服务、专业工种</strong>
            <p>更强调技能等级、工种要求和具体单位岗位条件。</p>
          </article>
        </div>
        <div class="job-list-toolbar">
          <input class="job-list-search" id="job-wiki-search" type="search" placeholder="搜索岗位名称、岗位类别" value="${escapeHtml(initialQuery)}">
          <div class="job-list-tabs" id="job-wiki-tabs">
            ${["全部", "管理岗", "技术岗", "技能岗"].map((item, index) => `
              <button type="button" class="${index === 0 ? "active" : ""}" data-category="${item}">${item}</button>
            `).join("")}
          </div>
        </div>
        <div id="job-wiki-results">${renderEmpty("正在读取岗位百科", "系统正在连接岗位百科数据接口。")}</div>
      </section>
    `);

    const resultEl = document.getElementById("job-wiki-results");
    const searchEl = document.getElementById("job-wiki-search");
    const tabsEl = document.getElementById("job-wiki-tabs");

    function update() {
      const query = state.query.trim().toLowerCase();
      const filtered = state.jobs.filter(job => {
        const matchCategory = state.category === "全部" || job.categories.includes(state.category);
        const text = `${job.name}`.toLowerCase();
        return matchCategory && (!query || text.includes(query));
      });
      resultEl.innerHTML = renderJobCards(filtered);
    }

    try {
      state.jobs = normalizeJobs(await loadJobCsv());
      update();
    } catch (error) {
      resultEl.innerHTML = renderEmpty("岗位百科数据读取失败", "请确认 data/job-database.csv 存在且格式正确。");
      console.error(error);
    }

    searchEl?.addEventListener("input", event => {
      state.query = event.target.value || "";
      update();
    });

    tabsEl?.addEventListener("click", event => {
      const btn = event.target.closest("button[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category;
      tabsEl.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === btn));
      update();
    });
  }

  function renderFaqItems(items) {
    if (!items.length) {
      return renderEmpty("暂无匹配问题", "请更换关键词，或切换到其他问题分类。");
    }
    function relatedFaqLinks(item) {
      const text = `${item.category || ""} ${item.question || ""} ${item.answer || ""}`;
      const links = [
        { label: "体检标准", href: "guide-qualification.html#medical", test: /体检|视力|身高|BMI|纹身|色弱|身体/ },
        { label: "政治考核", href: "guide-qualification.html#political", test: /政审|政治考核|违法|犯罪|亲属|失信/ },
        { label: "考试科目", href: "guide-exam.html", test: /考试科目|专业科目|公共科目|大纲|分值|笔试/ },
        { label: "真题中心", href: "papers.html", test: /真题|刷题|备考|试卷/ },
        { label: "AI岗位推荐", href: "recommend.html", test: /岗位|选岗|职位|招聘人数|入围/ },
        { label: "岗位百科", href: "job-list.html", test: /岗位|职责|工作内容|单位/ },
        { label: "考试全流程", href: "guide-process.html", test: /报名|资格|缴费|准考证|面试|录用|流程/ }
      ].filter(item => item.test.test(text)).slice(0, 3);
      if (!links.length) return "";
      return `<div class="faq-related-links">
        <span>相关入口</span>
        ${links.map(link => `<a href="${link.href}">${escapeHtml(link.label)}</a>`).join("")}
      </div>`;
    }
    return `<div class="faq-list">
      ${items.map((item, index) => `
        <details class="faq-item" ${index === 0 ? "open" : ""}>
          <summary>
            <span class="faq-question">${escapeHtml(item.question || "未命名问题")}</span>
            <span class="faq-category">${escapeHtml(item.category || "未分类")}</span>
          </summary>
          <div class="faq-answer">
            ${escapeHtml(item.answer || "暂无回答").replace(/\n/g, "<br>")}
            ${relatedFaqLinks(item)}
          </div>
        </details>
      `).join("")}
    </div>`;
  }

  function faqDisplayCategory(item) {
    const text = `${item.category || ""} ${item.question || ""} ${item.answer || ""}`;
    const groups = [
      { label: "报考条件", test: /政策|基本常识|条件|学历|学位|年龄|专业|应届|身份|定向|资格/ },
      { label: "岗位选择", test: /岗位|职责|职位|单位|选岗|招聘人数|入围|岗位类型|岗位职责|不同单位类型/ },
      { label: "考试备考", test: /考试|备考|笔试|面试|科目|大纲|真题|分值|题型|高分|答题|专业技能岗专项/ },
      { label: "报名审核", test: /报名|资格审核|流程|缴费|准考证|材料|证明|报考误区|退费/ },
      { label: "体检政审", test: /体检|政审|政治考核|身体|视力|纹身|征信|亲属|审核细节/ },
      { label: "薪酬发展", test: /薪资|福利|保障|职业发展|晋升|待遇|合同|解聘|离职|入职|培训/ },
      { label: "特殊人群", test: /特殊人群|军属|退役|社会人才|在职|二战|多战|补录|调剂|递补/ },
      { label: "生活管理", test: /日常管理|工作生活|住宿|休假|纪律|保密|驻地/ }
    ];
    return groups.find(group => group.test.test(text))?.label || "其他问题";
  }

  async function renderFaq(app) {
    const state = { query: "", category: "全部", items: [] };
    app.innerHTML = renderShell("faq", `
      <section class="guide-section">
        <div class="guide-section-head">
          <div>
            <h2>常见问题（FAQ）</h2>
            <p class="guide-muted">按问题类型整理军队文职报考高频疑问，支持分类筛选和关键词搜索。</p>
          </div>
        </div>
        <div class="faq-tools">
          <input class="faq-search" id="faq-search" type="search" placeholder="搜索问题关键词，例如：应届、体检、政审、分数">
          <div class="faq-count" id="faq-count">正在读取 FAQ</div>
        </div>
        <div class="guide-status-layout">
          <aside class="guide-status-nav faq-tabs" id="faq-tabs" aria-label="常见问题分类"></aside>
          <div class="guide-status-content" id="faq-results">${renderEmpty("正在读取 FAQ", "系统正在连接常见问题数据库。")}</div>
        </div>
      </section>
    `);

    const searchEl = document.getElementById("faq-search");
    const tabsEl = document.getElementById("faq-tabs");
    const resultsEl = document.getElementById("faq-results");
    const countEl = document.getElementById("faq-count");

    function categories() {
      const list = [];
      state.items.forEach(item => {
        const category = faqDisplayCategory(item);
        if (!list.includes(category)) list.push(category);
      });
      return ["全部", ...list];
    }

    function updateTabs() {
      tabsEl.innerHTML = `<details open><summary>常见问题</summary>${categories().map(category => `
        <button type="button" class="${category === state.category ? "active" : ""}" data-category="${escapeHtml(category)}">
          <span>${escapeHtml(category)}</span>
        </button>
      `).join("")}</details>`;
    }

    function update() {
      const query = state.query.trim().toLowerCase();
      const filtered = state.items.filter(item => {
        const displayCategory = faqDisplayCategory(item);
        const matchCategory = state.category === "全部" || displayCategory === state.category;
        const text = `${item.question || ""} ${item.answer || ""} ${item.category || ""}`.toLowerCase();
        return matchCategory && (!query || text.includes(query));
      });
      countEl.textContent = `共 ${filtered.length} / ${state.items.length} 个问题`;
      resultsEl.innerHTML = renderFaqItems(filtered);
    }

    try {
      const data = await loadJson(FAQ_URL);
      state.items = normalizeItems(data);
      updateTabs();
      update();
    } catch (error) {
      resultsEl.innerHTML = renderEmpty("FAQ 数据读取失败", "请确认 data/guide/faq.json 存在且格式正确。");
      if (countEl) countEl.textContent = "读取失败";
      console.error(error);
    }

    searchEl?.addEventListener("input", event => {
      state.query = event.target.value || "";
      update();
    });

    tabsEl?.addEventListener("click", event => {
      const btn = event.target.closest("button[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category || "全部";
      tabsEl.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === btn));
      update();
    });

  }

  function init() {
    const app = document.getElementById("guide-app");
    if (!app) return;
    const page = document.body.dataset.guidePage || "home";
    document.title = `${PAGE_META[page]?.title || "报考指南"} - 军队文职智能报考平台`;

    if (page === "jobs") {
      renderJobList(app);
      return;
    }
    if (page === "exam") {
      renderExam(app);
      return;
    }
    if (page === "process" && location.hash === "#registration") app.innerHTML = renderRegistrationPlaceholder();
    else if (page === "process") app.innerHTML = renderProcess();
    else if (page === "qualification") renderQualification(app);
    else if (page === "medical") renderMedical(app);
    else if (page === "political") renderPolitical(app);
    else if (page === "faq") renderFaq(app);
    else app.innerHTML = renderHome();
  }

  window.GuideCenterAPI = {
    nav: GUIDE_NAV,
    loadJson,
    loadJobCsv,
    renderShell
  };

  document.addEventListener("DOMContentLoaded", init);
})();

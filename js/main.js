/* === Data Store === */
const DATA = {
  // 省份列表（简称）
  provinces: [
    "北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江",
    "上海","江苏","浙江","安徽","福建","江西","山东","河南",
    "湖北","湖南","广东","广西","海南","重庆","四川","贵州",
    "云南","西藏","陕西","甘肃","青海","宁夏","新疆"
  ],

  // 省份全称映射
  provinceFullName: {
    "北京":"北京市","天津":"天津市","河北":"河北省","山西":"山西省",
    "内蒙古":"内蒙古自治区","辽宁":"辽宁省","吉林":"吉林省","黑龙江":"黑龙江省",
    "上海":"上海市","江苏":"江苏省","浙江":"浙江省","安徽":"安徽省",
    "福建":"福建省","江西":"江西省","山东":"山东省","河南":"河南省",
    "湖北":"湖北省","湖南":"湖南省","广东":"广东省","广西":"广西壮族自治区",
    "海南":"海南省","重庆":"重庆市","四川":"四川省","贵州":"贵州省",
    "云南":"云南省","西藏":"西藏自治区","陕西":"陕西省","甘肃":"甘肃省",
    "青海":"青海省","宁夏":"宁夏回族自治区","新疆":"新疆维吾尔自治区"
  },

  // 岗位数据（延迟加载）
  positions: null,
  positionsLoaded: false,
  positionsLoading: false,
  positionsLoadPromise: null,

  async loadPositions() {
    if (DATA.positionsLoaded) return DATA.positions;
    if (DATA.positionsLoading) return DATA.positionsLoadPromise;
    DATA.positionsLoading = true;
    DATA.positionsLoadPromise = fetch('data/positions.json')
      .then(r => r.json())
      .then(data => {
        DATA.positions = data;
        DATA.positionsLoaded = true;
        DATA.positionsLoading = false;
        return data;
      })
      .catch(err => {
        DATA.positionsLoading = false;
        throw err;
      });
    return DATA.positionsLoadPromise;
  },

  // 军队文职岗位表
  getMilitaryJobList(category) {
    const years = [2026, 2025, 2024];
    return years.map(y => ({
      title: `${y}军队文职${category}岗位表`,
      year: y,
      category: category,
      type: "military"
    }));
  },

  // 军队文职真题列表
  getMilitaryPaperList(subject) {
    const years = [2025, 2024, 2023, 2022];
    return years.map(y => ({
      title: `${y}军队文职${subject}真题`,
      year: y,
      subject: subject,
      exam: `军队文职${subject}`,
      type: "military"
    }));
  }
};

/* === Router === */
const Router = {
  parse() {
    const hash = location.hash.slice(1) || "home";
    const parts = hash.split("/");
    return { route: parts[0], params: parts.slice(1) };
  },

  navigate(hash) {
    location.hash = hash;
  },

  goBack() {
    history.back();
  }
};

/* === Page Renderers === */
function renderHome() {
  const html = `
    <section class="home-v4-hero">
      <div class="home-v4-hero-copy">
        <span class="home-v4-kicker">军队文职</span>
        <h1>军队文职<span>智能报考</span>平台</h1>
        <p>从岗位认知、智能推荐到真题备考，一站式完成报考决策。</p>
        <div class="home-v4-actions">
          <a href="recommend.html" class="home-v4-primary">开始智能推荐</a>
          <a href="guide-process.html" class="home-v4-secondary">查看上岸流程</a>
        </div>
        <div class="home-v4-abilities">
          <span><svg viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7"/></svg>数据驱动</span>
          <span><svg viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7"/></svg>智能匹配</span>
          <span><svg viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7"/></svg>真题题库</span>
          <span><svg viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7"/></svg>政策权威</span>
        </div>
      </div>
      <div class="home-v4-illustration" aria-hidden="true">
        <div class="home-v4-window">
          <div class="home-v4-window-bar"><i></i><i></i><i></i></div>
          <div class="home-v4-ai">AI</div>
          <div class="home-v4-lines"><i></i><i></i><i></i></div>
          <div class="home-v4-bars"><i></i><i></i><i></i></div>
          <div class="home-v4-pie"></div>
          <div class="home-v4-checks"><span>岗位匹配度</span><span>竞争热度</span><span>上岸建议</span></div>
        </div>
        <div class="home-v4-lens"></div>
      </div>
    </section>

    <section class="home-v4-path" aria-label="上岸流程">
      ${[
        ["01", "了解考试", "掌握考试全流程与科目", "guide-process.html"],
        ["02", "选择岗位", "定位方向，智能匹配岗位", "recommend.html"],
        ["03", "开始备考", "制定计划，高效备考", "guide-exam.html"],
        ["04", "正式报名", "报名审核，参加笔试", "guide-process.html#registration"],
        ["05", "上岸录用", "面试体检，公示录用", "guide-process.html#admission"]
      ].map(item => `
        <a class="home-v4-path-item" href="${item[3]}">
          <span>${item[0]}</span>
          <strong>${item[1]}</strong>
          <em>${item[2]}</em>
        </a>
      `).join("")}
    </section>

    <section class="home-v4-main-grid">
      <div class="home-v4-feature-row">
        <a href="recommend.html" class="home-v4-feature-card home-v4-feature-ai">
          <span class="home-v4-feature-icon">AI</span>
          <strong>AI 岗位推荐</strong>
          <p>基于你的条件与偏好，智能推荐合适岗位。</p>
          <ul>
            <li>多维条件精准匹配</li>
            <li>竞争热度可视化</li>
            <li>生成推荐报告</li>
          </ul>
          <em>立即智能推荐</em>
        </a>
        <a href="job-list.html" class="home-v4-feature-card home-v4-feature-job">
          <span class="home-v4-feature-icon">
            <svg viewBox="0 0 24 24"><path d="M4 7h7l2 3h7v10H4z"/><path d="M8 13h8M8 16h5"/></svg>
          </span>
          <strong>岗位百科</strong>
          <p>全面了解岗位职责、工作特点与考试科目。</p>
          <ul>
            <li>岗位职责与要求</li>
            <li>常见单位分析</li>
            <li>工作强度与发展</li>
          </ul>
          <em>去查询岗位</em>
        </a>
        <a href="papers.html" class="home-v4-feature-card home-v4-feature-paper">
          <span class="home-v4-feature-icon">
            <svg viewBox="0 0 24 24"><path d="M6 4h9l3 3v13H6z"/><path d="M9 12h6M9 15h6M9 18h4"/></svg>
          </span>
          <strong>考试资料库</strong>
          <p>真题练习、备考资料与专业科目大纲。</p>
          <ul>
            <li>历年真题及解析</li>
            <li>备考资料与讲义</li>
            <li>高频考点汇总</li>
          </ul>
          <em>进入资料库</em>
        </a>
      </div>

      <aside class="home-v4-policy-card">
        <div class="home-v4-card-head">
          <h3>最新政策解读</h3>
          <a href="policy-reader.html">查看更多</a>
        </div>
        <div class="home-v4-policy-list">
          <a href="policy-reader.html"><span>公告</span><strong>2026年军队文职公开招考公告发布</strong><em>06-30</em></a>
          <a href="policy-reader.html"><span>政策</span><strong>军队文职人员管理新规解读</strong><em>06-28</em></a>
          <a href="policy-reader.html"><span>通知</span><strong>2026年统一考试时间安排</strong><em>06-25</em></a>
          <a href="policy-reader.html"><span>解读</span><strong>岗位分类与专业要求说明</strong><em>06-21</em></a>
          <a href="policy-reader.html"><span>政策</span><strong>军队文职薪酬福利政策解读</strong><em>06-20</em></a>
        </div>
      </aside>
    </section>

    <section class="home-v4-data-strip" aria-label="平台数据概览">
      <div><span>平台数据概览</span><strong>持续更新</strong></div>
      <div><span>岗位总数</span><strong>80,321 个</strong></div>
      <div><span>涉及单位</span><strong>1,093 个</strong></div>
      <div><span>覆盖地区</span><strong>31 个</strong></div>
      <div><span>每日更新</span><strong>数据同步官方</strong></div>
    </section>

  `;
  return { title: "首页", content: html };
}

const HeatmapHome = {
  chart: null,
  selectedYear: "2026",
  selectedMetric: "jobs",
  mapRegistered: false,
  provinceMap: {
    "北京":"北京市","天津":"天津市","河北":"河北省","山西":"山西省",
    "内蒙古":"内蒙古自治区","辽宁":"辽宁省","吉林":"吉林省","黑龙江":"黑龙江省",
    "上海":"上海市","江苏":"江苏省","浙江":"浙江省","安徽":"安徽省",
    "福建":"福建省","江西":"江西省","山东":"山东省","河南":"河南省",
    "湖北":"湖北省","湖南":"湖南省","广东":"广东省","广西":"广西壮族自治区",
    "海南":"海南省","重庆":"重庆市","四川":"四川省","贵州":"贵州省",
    "云南":"云南省","西藏":"西藏自治区","陕西":"陕西省","甘肃":"甘肃省",
    "青海":"青海省","宁夏":"宁夏回族自治区","新疆":"新疆维吾尔自治区"
  },

  async init() {
    const chartEl = document.getElementById("home-heatmap-chart");
    if (!chartEl || !window.echarts || !window.CHINA_GEOJSON) return;
    await DATA.loadPositions();
    if (!this.mapRegistered) {
      echarts.registerMap("china", window.CHINA_GEOJSON);
      this.mapRegistered = true;
    }
    if (this.chart) this.chart.dispose();
    this.chart = echarts.init(chartEl);
    this.bindControls();
    this.bindChartClick();
    this.render();
    window.addEventListener("resize", this.resize);
  },

  resize() {
    HeatmapHome.chart?.resize();
  },

  bindControls() {
    this.bindSegment("heatmap-year-tabs", "year", value => { this.selectedYear = value; });
    this.bindSegment("heatmap-metric-tabs", "metric", value => { this.selectedMetric = value; });
  },

  bindSegment(containerId, datasetKey, setter) {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.bound === "true") return;
    container.dataset.bound = "true";
    container.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;
      container.querySelectorAll("button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      setter(button.dataset[datasetKey]);
      this.render();
    });
  },

  bindChartClick() {
    this.chart.off("click");
    this.chart.on("click", params => {
      const province = this.shortProvinceName(params.name);
      if (province) this.openJobsForProvince(province);
    });
  },

  getFilteredPositions() {
    return (DATA.positions || []).filter(job => String(job.yr || "") === this.selectedYear);
  },

  buildProvinceStats(rows) {
    const stats = new Map(Object.keys(this.provinceMap).map(name => [name, {
      name,
      fullName: this.provinceMap[name],
      jobs: 0,
      recruits: 0,
      units: new Set()
    }]));

    rows.forEach(job => {
      const province = job.prov;
      if (!stats.has(province)) return;
      const item = stats.get(province);
      item.jobs += 1;
      item.recruits += parseInt(job.num, 10) || 0;
      if (job.unit) item.units.add(job.unit);
    });

    return Array.from(stats.values()).map(item => ({
      ...item,
      unitCount: item.units.size,
      value: this.selectedMetric === "recruits" ? item.recruits : item.jobs
    }));
  },

  render() {
    const rows = this.getFilteredPositions();
    const provinceStats = this.buildProvinceStats(rows);
    const maxValue = Math.max(1, ...provinceStats.map(item => item.value));
    const metricLabel = this.selectedMetric === "recruits" ? "招聘人数" : "岗位数量";

    document.getElementById("heatmap-subtitle").textContent =
      `${this.selectedYear}年全国岗位分布 · 按${metricLabel}着色`;
    document.getElementById("heatmap-stat-jobs").textContent = rows.length.toLocaleString();
    document.getElementById("heatmap-stat-recruits").textContent =
      rows.reduce((sum, job) => sum + (parseInt(job.num, 10) || 0), 0).toLocaleString();
    document.getElementById("heatmap-stat-units").textContent =
      new Set(rows.map(job => job.unit).filter(Boolean)).size.toLocaleString();
    document.getElementById("heatmap-stat-provinces").textContent =
      provinceStats.filter(item => item.jobs > 0).length.toLocaleString();

    this.renderRank(provinceStats);
    this.renderMap(provinceStats, maxValue, metricLabel);
  },

  renderMap(provinceStats, maxValue, metricLabel) {
    const mapData = provinceStats.map(item => ({
      name: item.fullName,
      value: item.value,
      shortName: item.name,
      jobs: item.jobs,
      recruits: item.recruits,
      unitCount: item.unitCount
    }));
    mapData.push({ name: "台湾省", value: 0, jobs: 0, recruits: 0, unitCount: 0 });
    mapData.push({ name: "香港特别行政区", value: 0, jobs: 0, recruits: 0, unitCount: 0 });
    mapData.push({ name: "澳门特别行政区", value: 0, jobs: 0, recruits: 0, unitCount: 0 });

    this.chart.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "#e3e8ef",
        borderWidth: 1,
        textStyle: { color: "#0f172a", fontSize: 13 },
        formatter: params => {
          const name = this.shortProvinceName(params.name) || params.name;
          const data = params.data || {};
          return `<strong>${name}</strong><br/>岗位数量：${data.jobs || 0}<br/>招聘人数：${data.recruits || 0}<br/>涉及单位：${data.unitCount || 0}`;
        }
      },
      visualMap: {
        min: 0,
        max: maxValue,
        left: 18,
        bottom: 18,
        calculable: false,
        inRange: { color: ["#eaf2ff", "#9dbbf5", "#4f7fd2", "#174ea6"] },
        text: ["高", "低"],
        textStyle: { color: "#64748b", fontSize: 12 }
      },
      series: [{
        name: metricLabel,
        type: "map",
        map: "china",
        roam: false,
        zoom: 1.42,
        center: [104.5, 35.6],
        itemStyle: { borderColor: "#cfd8e3", borderWidth: 1, areaColor: "#eef2f7" },
        label: { show: true, fontSize: 10, color: "#334155" },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 700, color: "#0f172a" },
          itemStyle: { areaColor: "#93c5fd", borderColor: "#174ea6", borderWidth: 1.5 }
        },
        data: mapData
      }]
    }, { notMerge: true });
  },

  renderRank(provinceStats) {
    const sorted = [...provinceStats]
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    const maxValue = sorted.length > 0 ? sorted[0].value : 1;
    const unit = this.selectedMetric === "recruits" ? "人" : "岗";
    document.getElementById("heatmap-rank-list").innerHTML = sorted.map((item, index) => `
      <div class="home-rank-item" data-province="${item.name}">
        <span class="rank-index">${index + 1}</span>
        <span class="rank-name">${item.name}</span>
        <span class="rank-count">${item.value.toLocaleString()}${unit}</span>
        <div class="rank-bar">
          <div class="rank-bar-fill" style="width: ${Math.round(item.value / maxValue * 100)}%"></div>
        </div>
      </div>
    `).join("") || `<div class="home-rank-empty">暂无数据</div>`;

    document.querySelectorAll(".home-rank-item").forEach(item => {
      item.addEventListener("click", () => this.openJobsForProvince(item.dataset.province));
    });
  },

  shortProvinceName(fullName) {
    return Object.entries(this.provinceMap).find(([, full]) => full === fullName)?.[0] || fullName;
  },

  openJobsForProvince(province) {
    sessionStorage.setItem("recommendRegionHint", province || "");
    location.href = "recommend.html";
  }
};

function renderPapers() {
  // 真题中心已迁移到独立页面
  const contentHtml = `
    <div class="card" style="margin-top:24px;">
      <div class="card-body" style="text-align:center;padding:48px;color:var(--gray-400);">
        <p style="font-size:16px;margin-bottom:16px;">真题中心已上线</p>
        <a href="papers.html" class="btn btn-primary btn-sm">进入真题中心</a>
      </div>
    </div>`;

  return {
    title: "真题中心",
    content: `
      <div class="page-header">
        <div class="breadcrumb"><a href="#">首页</a> / <span>真题中心</span></div>
        <h2>真题中心</h2>
      </div>
      ${contentHtml}`
  };
}

function renderPaperList(type, key) {
  // 真题列表模块 — 待接入真实真题数据
  const subtitle = `军队文职${decodeURIComponent(key)}`;
  return {
    title: subtitle,
    content: `
      <div class="page-header">
        <div class="breadcrumb">
          <a href="#">首页</a> / <a href="#papers">真题下载</a> / <span>${subtitle}</span>
        </div>
        <h2>${subtitle}</h2>
      </div>
      <div class="card"><div class="card-body" style="text-align:center;padding:48px;color:var(--gray-400);">
        <p>真题资源正在整理中，敬请期待。</p>
      </div></div>`
  };
}

function renderPaperDetail(title) {
  const decoded = decodeURIComponent(title);
  return {
    title: decoded,
    content: `
      <div class="page-header">
        <div class="breadcrumb">
          <a href="#">首页</a> / <a href="#papers">真题下载</a> / <span>${decoded}</span>
        </div>
        <h2>${decoded}</h2>
      </div>
      <div class="card detail-card">
        <div class="card-body">
          <div class="detail-meta">
            <div class="detail-meta-item">年份：<strong>${decoded.match(/\d{4}/)?.[0] || "—"}</strong></div>
            <div class="detail-meta-item">考试名称：<strong>${decoded}</strong></div>
            <div class="detail-meta-item">文件格式：<strong>PDF</strong></div>
            <div class="detail-meta-item">文件大小：<strong>约 2.8 MB</strong></div>
          </div>
          <div class="detail-section">
            <h3>文件简介</h3>
            <p class="text-gray" style="font-size:14px;">本文件为${decoded}，包含完整试题及参考答案解析，适合考生备考使用。</p>
          </div>
          <div class="detail-section">
            <h3>文件预览</h3>
            <div class="preview-placeholder">文件预览区域（预留）</div>
          </div>
          <div class="detail-section">
            <h3>下载</h3>
            ${buildDownloadItem(decoded, "PDF", "约 2.8 MB")}
          </div>
        </div>
      </div>
      <div class="related-section">
        <h3>相关推荐</h3>
        <p class="text-gray" style="font-size:14px;">（相关推荐区域预留，后续将展示相关真题及岗位表链接。）</p>
      </div>`
  };
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderAbout() {
  return {
    title: "关于本站",
    content: `
      <div class="page-header text-center">
        <h2>关于本站</h2>
      </div>
      <div class="about-section">
        <div class="card">
          <div class="card-body">
            <p>《军队文职智能报考平台》是一个专注于军队文职考试资料整理的本地化工具。</p>
            <p>本项目第一版（V1.1）为纯静态前端原型，涵盖 AI 岗位推荐、岗位百科、真题下载三大核心功能模块，覆盖军队文职管理岗与技术岗。所有数据均为模拟数据，后续将接入 SQLite 数据库实现真实数据管理。</p>
            <p>技术栈：HTML5 + CSS3 + JavaScript（原生）。本项目需要通过本地静态服务器启动，请使用项目根目录中的 <code>启动网站.command</code>，不要直接双击 HTML 文件。</p>
            <p class="mt-24"><strong>版本：</strong>V1.1（前端原型）</p>
            <p><strong>下一阶段规划：</strong>SQLite 数据库接入、AI 智能选岗、搜索功能、用户系统等。</p>
          </div>
        </div>
      </div>`
  };
}

/* === Helpers === */
function buildSubCard(href, title, desc) {
  return `
    <a href="#${href}" class="card sub-category-card">
      <div class="icon">📋</div>
      <div class="card-title">${title}</div>
      <div class="card-text">${desc}</div>
    </a>`;
}

function buildDownloadItem(label, format, size) {
  return `
    <div class="download-item">
      <div>
        <span class="dl-info">${label}</span>
        <span class="dl-meta">${format} · ${size}</span>
      </div>
      <a href="downloads/sample.${format.toLowerCase()}" class="btn btn-outline btn-sm" download>下载</a>
    </div>`;
}

/* === Router Handler === */
function handleRoute() {
  const { route, params } = Router.parse();
  let result;

  switch (route) {
    case "home":
    case "":
      result = renderHome();
      break;
    case "jobs":
      location.replace("recommend.html");
      return;
      break;
    case "job-list":
      result = renderJobList(params[0], params[1] || "");
      break;
    case "job-detail":
      result = renderJobDetail(params[0] || "");
      break;
    case "papers":
      result = renderPapers();
      break;
    case "paper-list":
      result = renderPaperList(params[0], params[1] || "");
      break;
    case "paper-detail":
      result = renderPaperDetail(params[0] || "");
      break;
    case "about":
      result = renderAbout();
      break;
    default:
      result = renderHome();
  }

  document.getElementById("app").innerHTML = result.content;
  document.title = result.title ? `${result.title} — 军队文职智能报考平台` : "军队文职智能报考平台";

  // Update nav active state
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach(a => {
    a.classList.remove("active");
    const href = a.getAttribute("href");
    if (href === `#${route}` || (route === "home" && href === "#home")) {
      a.classList.add("active");
    }
    if (route === "papers" && href === "#papers") a.classList.add("active");
    if (route === "paper-list" && href === "#papers") a.classList.add("active");
    if (route === "paper-detail" && href === "#papers") a.classList.add("active");
    if (route === "about" && href === "#about") a.classList.add("active");
  });

  window.scrollTo(0, 0);
  if (route === "home" || route === "") {
    HeatmapHome.init();
  }
}

/* === Init === */
window.addEventListener("hashchange", handleRoute);
window.addEventListener("DOMContentLoaded", handleRoute);

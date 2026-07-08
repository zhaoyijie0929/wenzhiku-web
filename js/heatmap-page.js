(function() {
  const POSITIONS_URL = "data/positions.json?v=20260706";
  const MAJORS_URL = "data/majors.json?v=20260706";
  const ignoredMajorTerms = new Set(["专业", "专业类", "学科", "门类", "本科", "研究生", "四年", "五年"]);
  const provinceMap = {
    "北京":"北京市","天津":"天津市","河北":"河北省","山西":"山西省",
    "内蒙古":"内蒙古自治区","辽宁":"辽宁省","吉林":"吉林省","黑龙江":"黑龙江省",
    "上海":"上海市","江苏":"江苏省","浙江":"浙江省","安徽":"安徽省",
    "福建":"福建省","江西":"江西省","山东":"山东省","河南":"河南省",
    "湖北":"湖北省","湖南":"湖南省","广东":"广东省","广西":"广西壮族自治区",
    "海南":"海南省","重庆":"重庆市","四川":"四川省","贵州":"贵州省",
    "云南":"云南省","西藏":"西藏自治区","陕西":"陕西省","甘肃":"甘肃省",
    "青海":"青海省","宁夏":"宁夏回族自治区","新疆":"新疆维吾尔自治区"
  };

  const state = {
    rows: [],
    majors: [],
    majorMatch: null,
    chart: null,
    selectedProvince: ""
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function uniq(rows, key) {
    return [...new Set(rows.map(row => String(row[key] || "").trim()).filter(Boolean))].sort();
  }

  function optionHtml(items, allLabel = "全部") {
    return [`<option value="全部">${allLabel}</option>`]
      .concat(items.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`))
      .join("");
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  function getCategory(row) {
    if (typeof window.classifyJob === "function") return window.classifyJob(row);
    if (row.cat === "技能岗") return "技能岗";
    return /文员/.test(row.title || "") ? "管理岗" : "技术岗";
  }

  function parseNumber(value) {
    const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(num) ? num : 0;
  }

  function normalizeMajorTerm(value) {
    return String(value || "")
      .replace(/[，、；;|/]/g, " ")
      .trim();
  }

  function splitMajorTerms(value) {
    return normalizeMajorTerm(value)
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length >= 2 && !ignoredMajorTerms.has(term));
  }

  function uniqueTerms(terms) {
    return [...new Set(terms.filter(Boolean))];
  }

  function getMajorRecordTerms(record) {
    if (!record) return [];
    return uniqueTerms([
      ...splitMajorTerms(record.major_name),
      ...splitMajorTerms(record.major_category),
      ...splitMajorTerms(record.discipline)
    ]);
  }

  function buildMajorMatch(query) {
    const raw = String(query || "").trim();
    if (!raw) return { terms: [], labels: [], matched: [] };
    const q = raw.toLowerCase();
    const matched = state.majors.filter(major => {
      const text = `${major.major_name || ""} ${major.major_category || ""} ${major.discipline || ""}`.toLowerCase();
      return text.includes(q);
    }).slice(0, 12);
    const primary = matched.find(major => String(major.major_name || "").toLowerCase() === q)
      || matched.find(major => String(major.major_name || "").toLowerCase().includes(q))
      || matched[0];
    const terms = uniqueTerms([
      ...splitMajorTerms(raw),
      ...matched.flatMap(getMajorRecordTerms)
    ]);
    const labels = uniqueTerms([
      ...getMajorRecordTerms(primary),
      ...splitMajorTerms(raw)
    ]).slice(0, 6);
    return { terms: terms.map(term => term.toLowerCase()), labels, matched };
  }

  function renderMajorHint(match) {
    if (!els.majorHint) return;
    if (!match || !String(els.major?.value || "").trim()) {
      els.majorHint.innerHTML = "输入专业后自动识别专业类与学科门类";
      els.majorHint.classList.remove("is-active", "is-fallback");
      return;
    }
    if (!match.matched.length) {
      els.majorHint.innerHTML = `未在专业库精确识别，按关键词 <strong>${escapeHtml(els.major.value.trim())}</strong> 匹配`;
      els.majorHint.classList.add("is-active", "is-fallback");
      return;
    }
    els.majorHint.innerHTML = `已识别：${match.labels.map(term => `<span>${escapeHtml(term)}</span>`).join("")}`;
    els.majorHint.classList.add("is-active");
    els.majorHint.classList.remove("is-fallback");
  }

  function initSelects() {
    els.year.innerHTML = optionHtml(uniq(state.rows, "yr"), "全部年份");
    els.year.value = "2026";
    if (!els.year.value) els.year.value = "全部";
    els.degree.innerHTML = optionHtml(uniq(state.rows, "degree"), "全部学位");
    els.edu.innerHTML = optionHtml(uniq(state.rows, "edu"), "全部学历");
    els.province.innerHTML = optionHtml(Object.keys(provinceMap), "全国");
  }

  function selectedValue(el) {
    return el?.value || "全部";
  }

  function filteredRows() {
    const year = selectedValue(els.year);
    const category = selectedValue(els.category);
    const degree = selectedValue(els.degree);
    const edu = selectedValue(els.edu);
    const province = selectedValue(els.province);
    const majorKeyword = String(els.major?.value || "").trim().toLowerCase();
    const majorMatch = buildMajorMatch(majorKeyword);
    state.majorMatch = majorMatch;
    return state.rows.filter(row => {
      if (year !== "全部" && String(row.yr || "") !== year) return false;
      if (category !== "全部" && getCategory(row) !== category) return false;
      if (degree !== "全部" && String(row.degree || "") !== degree) return false;
      if (edu !== "全部" && String(row.edu || "") !== edu) return false;
      if (province !== "全部" && String(row.prov || "") !== province) return false;
      if (majorKeyword) {
        const haystack = `${row.major || ""} ${row.exam || ""} ${row.type || ""} ${row.title || ""}`.toLowerCase();
        const terms = majorMatch.terms.length ? majorMatch.terms : [majorKeyword];
        if (!terms.some(term => haystack.includes(term))) return false;
      }
      return true;
    });
  }

  function buildStats(rows) {
    const stats = new Map(Object.keys(provinceMap).map(name => [name, {
      name,
      fullName: provinceMap[name],
      jobs: 0,
      recruits: 0,
      units: new Set(),
      scoreSum: 0,
      scoreCount: 0
    }]));

    rows.forEach(row => {
      const province = row.prov;
      if (!stats.has(province)) return;
      const item = stats.get(province);
      item.jobs += 1;
      item.recruits += parseNumber(row.num);
      if (row.unit) item.units.add(row.unit);
      const score = parseNumber(row.score);
      if (score > 0) {
        item.scoreSum += score;
        item.scoreCount += 1;
      }
    });

    const metric = selectedValue(els.metric);
    return Array.from(stats.values()).map(item => {
      const avgScore = item.scoreCount ? item.scoreSum / item.scoreCount : 0;
      const unitCount = item.units.size;
      const valueMap = {
        jobs: item.jobs,
        recruits: item.recruits,
        units: unitCount,
        score: avgScore
      };
      return {
        ...item,
        unitCount,
        avgScore,
        value: valueMap[metric] || item.jobs
      };
    });
  }

  function metricLabel() {
    return {
      jobs: "岗位数量",
      recruits: "招聘人数",
      units: "涉及单位",
      score: "平均入围"
    }[selectedValue(els.metric)] || "岗位数量";
  }

  function renderSummary(rows, stats) {
    const activeStats = stats.filter(item => item.jobs > 0);
    $("heatmap-total-jobs").textContent = rows.length.toLocaleString();
    $("heatmap-total-recruits").textContent = rows.reduce((sum, row) => sum + parseNumber(row.num), 0).toLocaleString();
    $("heatmap-total-units").textContent = new Set(rows.map(row => row.unit).filter(Boolean)).size.toLocaleString();
    $("heatmap-total-provinces").textContent = activeStats.length.toLocaleString();
    els.subtitle.textContent = `${selectedValue(els.year) === "全部" ? "全部年份" : selectedValue(els.year) + "年"} · ${metricLabel()} · 当前筛选 ${rows.length.toLocaleString()} 个岗位`;
    $("heatmap-rank-unit").textContent = metricLabel();
    renderMajorHint(state.majorMatch);
  }

  function renderMap(stats) {
    if (!state.chart) return;
    const metric = selectedValue(els.metric);
    const metricValues = stats.map(item => item.value).filter(value => metric === "score" ? value > 0 : value >= 0);
    let minValue = metric === "score" && metricValues.length ? Math.min(...metricValues) : 0;
    let maxValue = Math.max(1, ...metricValues);
    if (metric === "score" && Math.abs(maxValue - minValue) < 0.1) maxValue = minValue + 1;
    const visualColors = metric === "score"
      ? ["#FEF3C7", "#FDBA74", "#FB923C", "#EF4444", "#991B1B"]
      : ["#F1F5F9", "#D7E8FF", "#8AB8FF", "#3B82F6", "#1D4ED8", "#0F2F8F"];
    const mapData = stats.map(item => ({
      name: item.fullName,
      value: Number(item.value.toFixed ? item.value.toFixed(1) : item.value),
      shortName: item.name,
      jobs: item.jobs,
      recruits: item.recruits,
      unitCount: item.unitCount,
      avgScore: item.avgScore
    }));
    mapData.push({ name: "台湾省", value: 0, jobs: 0, recruits: 0, unitCount: 0, avgScore: 0 });
    mapData.push({ name: "香港特别行政区", value: 0, jobs: 0, recruits: 0, unitCount: 0, avgScore: 0 });
    mapData.push({ name: "澳门特别行政区", value: 0, jobs: 0, recruits: 0, unitCount: 0, avgScore: 0 });

    state.chart.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255,255,255,.96)",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        textStyle: { color: "#111827", fontSize: 13 },
        formatter: params => {
          const data = params.data || {};
          const name = data.shortName || shortProvinceName(params.name) || params.name;
          return `<strong>${name}</strong><br/>岗位数量：${data.jobs || 0}<br/>招聘人数：${data.recruits || 0}<br/>涉及单位：${data.unitCount || 0}<br/>平均入围：${data.avgScore ? data.avgScore.toFixed(1) : "--"}`;
        }
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        left: 18,
        bottom: 18,
        calculable: false,
        precision: metric === "score" ? 1 : 0,
        inRange: { color: visualColors },
        outOfRange: { color: ["#F1F5F9"] },
        text: ["高", "低"],
        textStyle: { color: "#667085", fontSize: 12 }
      },
      series: [{
        name: metricLabel(),
        type: "map",
        map: "china",
        roam: true,
        zoom: 1.28,
        center: [104.5, 35.5],
        itemStyle: { borderColor: "#D7DEE9", borderWidth: 1, areaColor: "#F1F5F9" },
        label: { show: true, fontSize: 11, color: "#334155" },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 700, color: "#111827" },
          itemStyle: { areaColor: "#93C5FD", borderColor: "#1D4ED8", borderWidth: 1.5 }
        },
        data: mapData
      }]
    }, { notMerge: true });
  }

  function renderRank(stats) {
    const metric = selectedValue(els.metric);
    const sorted = [...stats].filter(item => item.jobs > 0).sort((a, b) => b.value - a.value).slice(0, 12);
    const max = Math.max(1, sorted[0]?.value || 1);
    els.rank.innerHTML = sorted.map((item, index) => {
      const value = metric === "score" ? item.value.toFixed(1) : Math.round(item.value).toLocaleString();
      return `
        <button type="button" class="heatmap-rank-item" data-province="${escapeHtml(item.name)}">
          <span>${index + 1}</span>
          <strong>${escapeHtml(item.name)}</strong>
          <em>${value}</em>
          <i style="width:${Math.max(5, Math.round(item.value / max * 100))}%"></i>
        </button>
      `;
    }).join("") || `<div class="heatmap-empty">暂无匹配地区</div>`;
  }

  function renderDetail(rows) {
    const province = state.selectedProvince || selectedValue(els.province);
    const detailRows = province && province !== "全部" ? rows.filter(row => row.prov === province) : rows;
    const title = province && province !== "全部" ? `${province}岗位明细` : "全国岗位明细";
    $("heatmap-province-title").textContent = title;
    $("heatmap-province-action").href = province && province !== "全部" ? `recommend.html?region=${encodeURIComponent(province)}` : "recommend.html";

    const categoryCounts = detailRows.reduce((acc, row) => {
      const category = getCategory(row);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    const examTop = Object.entries(detailRows.reduce((acc, row) => {
      const exam = row.exam || "未注明";
      acc[exam] = (acc[exam] || 0) + 1;
      return acc;
    }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);

    $("heatmap-detail-grid").innerHTML = `
      <div><span>岗位数量</span><strong>${detailRows.length.toLocaleString()}</strong></div>
      <div><span>招聘人数</span><strong>${detailRows.reduce((sum, row) => sum + parseNumber(row.num), 0).toLocaleString()}</strong></div>
      <div><span>涉及单位</span><strong>${new Set(detailRows.map(row => row.unit).filter(Boolean)).size.toLocaleString()}</strong></div>
      <div><span>岗位类别</span><strong>${Object.entries(categoryCounts).map(([k,v]) => `${k}${v}`).join(" / ") || "--"}</strong></div>
      <div class="heatmap-detail-wide"><span>热门专业科目</span><strong>${examTop.map(([k,v]) => `${escapeHtml(k)} ${v}`).join("、") || "--"}</strong></div>
    `;
  }

  function shortProvinceName(fullName) {
    return Object.entries(provinceMap).find(([, full]) => full === fullName)?.[0] || fullName;
  }

  function render() {
    const rows = filteredRows();
    const stats = buildStats(rows);
    renderSummary(rows, stats);
    renderMap(stats);
    renderRank(stats);
    renderDetail(rows);
  }

  function bindEvents() {
    [els.year, els.category, els.degree, els.edu, els.province, els.metric].forEach(el => {
      el.addEventListener("change", () => {
        state.selectedProvince = selectedValue(els.province) === "全部" ? "" : selectedValue(els.province);
        render();
      });
    });
    els.major.addEventListener("input", () => {
      render();
    });
    $("heatmap-reset").addEventListener("click", () => {
      els.year.value = "2026";
      els.category.value = "全部";
      els.degree.value = "全部";
      els.edu.value = "全部";
      els.province.value = "全部";
      els.major.value = "";
      els.metric.value = "jobs";
      state.selectedProvince = "";
      render();
    });
    els.rank.addEventListener("click", event => {
      const button = event.target.closest("[data-province]");
      if (!button) return;
      state.selectedProvince = button.dataset.province;
      els.province.value = state.selectedProvince;
      render();
      document.getElementById("heatmap-province-card").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    window.addEventListener("resize", () => state.chart?.resize());
  }

  async function init() {
    els.year = $("heatmap-year");
    els.category = $("heatmap-category");
    els.degree = $("heatmap-degree");
    els.edu = $("heatmap-edu");
    els.province = $("heatmap-province");
    els.major = $("heatmap-major");
    els.majorHint = $("heatmap-major-hint");
    els.metric = $("heatmap-metric");
    els.subtitle = $("heatmap-subtitle");
    els.rank = $("heatmap-rank");

    const [positionsResponse, majorsResponse] = await Promise.all([
      fetch(POSITIONS_URL, { cache: "no-store" }),
      fetch(MAJORS_URL, { cache: "no-store" }).catch(() => null)
    ]);
    const manifest = await positionsResponse.json();
    state.rows = (await Promise.all(manifest.chunks.map(url => fetch(url, { cache: "no-store" }).then(r => r.json())))).flat();
    state.majors = majorsResponse?.ok ? await majorsResponse.json() : [];
    initSelects();
    bindEvents();
    if (window.echarts && window.CHINA_GEOJSON) {
      echarts.registerMap("china", window.CHINA_GEOJSON);
      state.chart = echarts.init($("heatmap-chart"));
      state.chart.on("click", params => {
        const province = shortProvinceName(params.name);
        if (!province || !provinceMap[province]) return;
        state.selectedProvince = province;
        els.province.value = province;
        render();
        document.getElementById("heatmap-province-card").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch(error => {
      console.error("[Heatmap] 初始化失败", error);
      const subtitle = $("heatmap-subtitle");
      if (subtitle) subtitle.textContent = "岗位热力地图加载失败，请确认本地服务器已启动。";
    });
  });
})();

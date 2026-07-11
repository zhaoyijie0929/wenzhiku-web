(function() {
  var headerHTML = '<header class="header">' +
    '<div class="header-inner">' +
      '<a href="index.html" class="logo">' +
        '<span class="logo-icon">知</span>' +
        '后进知学' +
      '</a>' +
      '<nav class="nav">' +
        '<a href="index.html">首页</a>' +
        '<a href="guide.html">报考指南</a>' +
        '<a href="heatmap.html">热力地图</a>' +
        '<a href="recommend.html">岗位推荐</a>' +
        '<a href="papers.html">真题中心</a>' +
        '<a href="policy-reader.html">政策解读</a>' +
        '<a href="index.html#about">关于本站</a>' +
      '</nav>' +
      '<div class="header-search" role="search" aria-label="站内搜索">' +
        '<span class="header-search-placeholder">搜索政策、岗位、真题...</span>' +
        '<svg class="header-search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
          '<circle cx="8" cy="8" r="5" stroke="#6B7280" stroke-width="1.6"/>' +
          '<path d="M12 12l3.2 3.2" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round"/>' +
        '</svg>' +
      '</div>' +
    '</div>' +
  '</header>';

  var placeholder = document.getElementById('site-header');
  if (placeholder) {
    placeholder.outerHTML = headerHTML;
  } else {
    console.error('[Header] 未找到 #site-header');
  }

  var path = location.pathname;
  var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  var isIndex = (filename === 'index.html' || filename === '' || path === '/');

  // On index.html, rewrite nav links to use hash-only for SPA routing (no page reload)
  if (isIndex) {
    var homeLink = document.querySelector('.nav a[href="index.html"]');
    if (homeLink) homeLink.setAttribute('href', '#home');
    var aboutLink = document.querySelector('.nav a[href="index.html#about"]');
    if (aboutLink) aboutLink.setAttribute('href', '#about');
  }

  function setActive() {
    var hash = location.hash;
    var links = document.querySelectorAll('.nav a');
    links.forEach(function(a) { a.classList.remove('active'); });

    if (isIndex) {
      if (hash === '#about') {
        var link = document.querySelector('.nav a[href="#about"]');
        if (link) link.classList.add('active');
      } else {
        var link = document.querySelector('.nav a[href="#home"]') ||
                   document.querySelector('.nav a[href="index.html"]');
        if (link) link.classList.add('active');
      }
    } else if (filename === 'recommend.html' || filename === 'recommend-report.html') {
      var link = document.querySelector('.nav a[href="recommend.html"]');
      if (link) link.classList.add('active');
    } else if (filename === 'heatmap.html') {
      var link = document.querySelector('.nav a[href="heatmap.html"]');
      if (link) link.classList.add('active');
    } else if (filename === 'guide.html' ||
               filename === 'guide-process.html' ||
               filename === 'job-list.html' ||
               filename === 'job-detail.html' ||
               filename === 'guide-exam.html' ||
               filename === 'guide-qualification.html' ||
               filename === 'guide-medical.html' ||
               filename === 'guide-political.html' ||
               filename === 'guide-faq.html' ||
               filename === 'preparation-materials.html') {
      var link = document.querySelector('.nav a[href="guide.html"]');
      if (link) link.classList.add('active');
    } else if (filename === 'papers.html') {
      var link = document.querySelector('.nav a[href="papers.html"]');
      if (link) link.classList.add('active');
    } else if (filename === 'policy.html' || filename === 'policy-reader.html') {
      var link = document.querySelector('.nav a[href="policy-reader.html"]');
      if (link) link.classList.add('active');
    }
  }

  setActive();

  if (isIndex) {
    window.addEventListener('hashchange', setActive);
  }

  if (!document.querySelector('script[data-global-sidebar]')) {
    var sidebarScript = document.createElement('script');
    sidebarScript.src = 'js/sidebar.js?v=20260705';
    sidebarScript.dataset.globalSidebar = 'true';
    document.body.appendChild(sidebarScript);
  }

  if (!document.querySelector('link[data-ui-clean]')) {
    var cleanStyle = document.createElement('link');
    cleanStyle.rel = 'stylesheet';
    cleanStyle.href = 'css/ui-clean.css?v=20260707';
    cleanStyle.dataset.uiClean = 'true';
    document.head.appendChild(cleanStyle);
  }

  if (!document.querySelector('link[data-assistant-widget]')) {
    var assistantStyle = document.createElement('link');
    assistantStyle.rel = 'stylesheet';
    assistantStyle.href = 'css/assistant-widget.css?v=20260707';
    assistantStyle.dataset.assistantWidget = 'true';
    document.head.appendChild(assistantStyle);
  }

  if (!document.querySelector('script[data-assistant-widget]')) {
    var assistantScript = document.createElement('script');
    assistantScript.src = 'js/assistant-widget.js?v=20260707';
    assistantScript.dataset.assistantWidget = 'true';
    document.body.appendChild(assistantScript);
  }
})();

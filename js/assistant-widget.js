(function() {
  const STORAGE_KEY = "yf_assistant_messages_v1";
  const NUDGE_KEY = "yf_assistant_nudge_closed";
  const STATUS_LABELS = {
    online: "在线",
    offline: "离线",
    thinking: "正在思考",
    querying: "正在查询数据库",
    reporting: "正在生成报告",
    done: "已完成",
    error: "出现错误"
  };

  const MOCK_REPLY = {
    success: true,
    message: "这是模拟回复，后续将接入AI。"
  };

  class AssistantWidget {
    constructor(options = {}) {
      this.options = {
        name: "杨帆",
        title: "AI 助手",
        mockDelay: 2000,
        ...options
      };
      this.status = "online";
      this.messages = this.loadMessages();
      this.isOpen = false;
      this.isOpening = false;
      this.isDragging = false;
      this.dragStart = null;
      this.el = null;
    }

    mount() {
      if (document.querySelector(".assistant-widget")) return;
      this.el = document.createElement("div");
      this.el.className = "assistant-widget";
      this.el.dataset.status = this.status;
      this.el.innerHTML = this.template();
      document.body.appendChild(this.el);
      this.cacheDom();
      this.bindEvents();
      this.renderMessages();
      this.setupScrollInertia();
      this.scheduleBreath();
      this.scheduleNudge();
      window.AssistantWidget = this;
    }

    cacheDom() {
      this.launcher = this.el.querySelector(".assistant-launcher");
      this.panel = this.el.querySelector(".assistant-panel");
      this.header = this.el.querySelector(".assistant-header");
      this.statusText = this.el.querySelector(".assistant-status-text");
      this.messagesEl = this.el.querySelector(".assistant-messages");
      this.input = this.el.querySelector(".assistant-input");
      this.sendBtn = this.el.querySelector(".assistant-send");
      this.nudge = this.el.querySelector(".assistant-nudge");
    }

    bindEvents() {
      this.launcher.addEventListener("click", () => this.open());
      this.el.querySelector("[data-assistant-close]").addEventListener("click", () => this.close());
      this.el.querySelector("[data-assistant-minimize]").addEventListener("click", () => this.toggleMinimize());
      this.el.querySelector("[data-assistant-clear]").addEventListener("click", () => this.clearMessages());
      this.el.querySelector("[data-assistant-nudge-close]").addEventListener("click", event => {
        event.stopPropagation();
        this.closeNudge();
      });
      this.nudge.addEventListener("click", () => this.open());
      this.sendBtn.addEventListener("click", () => this.sendCurrent());
      this.input.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          this.sendCurrent();
        }
      });
      this.input.addEventListener("input", () => this.autoResizeInput());
      this.el.querySelectorAll("[data-assistant-prompt]").forEach(button => {
        button.addEventListener("click", () => {
          const prompt = button.dataset.assistantPrompt || button.textContent.trim();
          this.sendMessage(prompt);
        });
      });
      this.header.addEventListener("pointerdown", event => this.startDrag(event));
      window.addEventListener("pointermove", event => this.onDrag(event));
      window.addEventListener("pointerup", () => this.endDrag());
    }

    template() {
      return `
        <button class="assistant-launcher" type="button" aria-label="打开杨帆AI助手">
          <span class="assistant-launcher-person">
            ${this.personHtml("full", "assistant-person-img")}
          </span>
          <span class="assistant-launcher-copy">
            <strong>${this.options.name}</strong>
            <span>AI 助手</span>
          </span>
        </button>

        <div class="assistant-nudge" role="status">
          <button type="button" aria-label="关闭提示" data-assistant-nudge-close>×</button>
          你好，需要我帮你推荐岗位吗？
        </div>

        <section class="assistant-panel" aria-label="杨帆AI助手">
          <header class="assistant-header">
            <div class="assistant-head-copy">
              <strong>${this.options.name}<span style="color:#667085;font-weight:800;"> · ${this.options.title}</span></strong>
              <span class="assistant-status"><span class="assistant-status-text">${STATUS_LABELS[this.status]}</span></span>
            </div>
            <div class="assistant-actions">
              <button class="assistant-icon-btn" type="button" title="清空聊天" aria-label="清空聊天" data-assistant-clear>
                ${this.icon("refresh")}
              </button>
              <button class="assistant-icon-btn" type="button" title="最小化" aria-label="最小化" data-assistant-minimize>
                ${this.icon("minus")}
              </button>
              <button class="assistant-icon-btn" type="button" title="关闭" aria-label="关闭" data-assistant-close>
                ${this.icon("close")}
              </button>
            </div>
          </header>

          <div class="assistant-welcome">
            <div class="assistant-welcome-copy">
              <h3>你好，我是杨帆。</h3>
              <p>你可以直接问我岗位方向、专业匹配、公告重点和备考安排。</p>
              <ul class="assistant-capabilities">
                <li>岗位推荐</li>
                <li>专业分析</li>
                <li>公告解读</li>
                <li>学习规划</li>
              </ul>
            </div>
            <div class="assistant-quick-actions">
              <button type="button" data-assistant-prompt="帮我推荐岗位">推荐岗位</button>
              <button type="button" data-assistant-prompt="帮我查询岗位">查询岗位</button>
              <button type="button" data-assistant-prompt="帮我分析专业">分析专业</button>
              <button type="button" data-assistant-prompt="帮我做学习规划">学习规划</button>
            </div>
          </div>

          <div class="assistant-messages" aria-live="polite"></div>

          <div class="assistant-input-wrap">
            <div class="assistant-input-box">
              <button class="assistant-icon-btn" type="button" title="附件，预留" aria-label="附件，预留">${this.icon("paperclip")}</button>
              <button class="assistant-icon-btn" type="button" title="语音，预留" aria-label="语音，预留">${this.icon("mic")}</button>
              <textarea class="assistant-input" rows="1" placeholder="输入你的问题..."></textarea>
              <button class="assistant-send" type="button" aria-label="发送">${this.icon("send")}</button>
            </div>
          </div>
        </section>
      `;
    }

    personHtml(variant = "bust", className = "assistant-person-img") {
      const srcMap = {
        full: "assets/assistant/yangfan-full-cutout.png",
        bust: "assets/assistant/yangfan-bust-cutout.png",
        thinking: "assets/assistant/yangfan-thinking-cutout.png"
      };
      const alt = variant === "thinking" ? "杨帆思考状态" : "杨帆AI助手形象";
      return `
        <img class="${className}" src="${srcMap[variant] || srcMap.bust}" alt="${alt}" loading="lazy">
      `;
    }

    icon(name) {
      const icons = {
        close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        minus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        refresh: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4 17v-5h5M18.5 9A7 7 0 0 0 6.1 6.8M5.5 15a7 7 0 0 0 12.4 2.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        paperclip: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.5l-8.5 8.5a6 6 0 0 1-8.5-8.5L13 3.5a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 1 1-2.8-2.8l8.2-8.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        mic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 14a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v4a4 4 0 0 0 4 4zM19 10a7 7 0 0 1-14 0M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        send: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      };
      return icons[name] || "";
    }

    open() {
      if (this.isOpen || this.isOpening) return;
      this.isOpening = true;
      this.launcher.classList.add("is-waving");
      setTimeout(() => {
        this.launcher.classList.remove("is-waving");
        this.isOpen = true;
        this.isOpening = false;
        this.el.classList.add("is-open");
        this.panel.classList.remove("is-minimized");
        this.closeNudge();
        setTimeout(() => this.input.focus(), 60);
        this.scrollToBottom();
      }, 360);
    }

    close() {
      this.isOpen = false;
      this.el.classList.remove("is-open");
      this.panel.classList.remove("is-minimized");
    }

    toggleMinimize() {
      this.panel.classList.toggle("is-minimized");
    }

    closeNudge() {
      sessionStorage.setItem(NUDGE_KEY, "1");
      this.nudge.classList.remove("is-visible");
    }

    scheduleNudge() {
      if (sessionStorage.getItem(NUDGE_KEY)) return;
      setTimeout(() => {
        if (this.isOpen || sessionStorage.getItem(NUDGE_KEY)) return;
        this.launcher.classList.add("is-pulse");
        this.nudge.classList.add("is-visible");
        setTimeout(() => this.launcher.classList.remove("is-pulse"), 1500);
      }, 3000);
    }

    scheduleBreath() {
      setInterval(() => {
        if (this.isOpen) return;
        this.launcher.classList.add("is-pulse");
        setTimeout(() => this.launcher.classList.remove("is-pulse"), 1500);
      }, 20000);
    }

    setupScrollInertia() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      this.scrollMotion = {
        lastY: window.scrollY,
        target: 0,
        current: 0,
        raf: null
      };
      window.addEventListener("scroll", () => this.onPageScroll(), { passive: true });
    }

    onPageScroll() {
      if (!this.scrollMotion) return;
      const nextY = window.scrollY;
      const delta = Math.max(-1, Math.min(1, (nextY - this.scrollMotion.lastY) / 120));
      this.scrollMotion.lastY = nextY;
      this.scrollMotion.target = delta * -7;
      if (!this.scrollMotion.raf) this.scrollMotion.raf = requestAnimationFrame(() => this.animateScrollInertia());
    }

    animateScrollInertia() {
      if (!this.scrollMotion) return;
      this.scrollMotion.current += (this.scrollMotion.target - this.scrollMotion.current) * 0.16;
      this.el.style.setProperty("--assistant-scroll-y", `${this.scrollMotion.current.toFixed(2)}px`);
      this.scrollMotion.target *= 0.86;
      if (Math.abs(this.scrollMotion.current) > 0.08 || Math.abs(this.scrollMotion.target) > 0.08) {
        this.scrollMotion.raf = requestAnimationFrame(() => this.animateScrollInertia());
      } else {
        this.scrollMotion.current = 0;
        this.scrollMotion.target = 0;
        this.scrollMotion.raf = null;
        this.el.style.setProperty("--assistant-scroll-y", "0px");
      }
    }

    sendCurrent() {
      const text = this.input.value.trim();
      if (!text) return;
      this.input.value = "";
      this.autoResizeInput();
      this.sendMessage(text);
    }

    async sendMessage(text) {
      this.addMessage({ role: "user", content: text });
      this.setStatus("thinking");
      const thinkingId = this.addThinkingMessage();
      const response = await this.askAI(text);
      this.removeMessage(thinkingId);
      if (response.success) {
        this.addMessage({ role: "assistant", content: response.message });
        this.setStatus("done");
        setTimeout(() => this.setStatus("online"), 900);
      } else {
        this.addMessage({ role: "assistant", content: response.message || "暂时没有生成成功，请稍后再试。" });
        this.setStatus("error");
      }
    }

    askAI(text) {
      return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;";
        overlay.innerHTML = `
          <div style="background:#fff;border-radius:16px;padding:32px 28px 24px;max-width:380px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <h3 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1a1a1a;">杨帆 AI</h3>
            <p style="margin:0 0 8px;font-size:15px;color:#333;line-height:1.6;">AI 助手正在升级中。</p>
            <p style="margin:0 0 16px;font-size:14px;color:#666;line-height:1.7;">
              目前网站已开放：<br>岗位查询、岗位百科、考试科目、真题中心、政策解读、AI 推荐等功能。
            </p>
            <p style="margin:0 0 20px;font-size:14px;color:#888;line-height:1.6;">
              杨帆 AI 将在后续版本开放。<br>感谢您的理解。
            </p>
            <button style="display:inline-block;padding:10px 36px;font-size:15px;font-weight:600;color:#fff;background:#1a73e8;border:none;border-radius:8px;cursor:pointer;" id="assistant-upgrade-ok">我知道了</button>
          </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector("#assistant-upgrade-ok").addEventListener("click", () => {
          overlay.remove();
          resolve({ success: false, message: "" });
        });
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) { overlay.remove(); resolve({ success: false, message: "" }); }
        });
      });
    }

    mockAsk(text) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ...MOCK_REPLY,
            message: this.buildMockReply(text)
          });
        }, this.options.mockDelay);
      });
    }

    buildMockReply(text) {
      if (/岗位|推荐/.test(text)) {
        return "这是模拟回复，后续将接入AI。\n\n我会根据你的**学历、专业、地区和岗位偏好**，帮你筛出更适合优先关注的岗位。";
      }
      if (/专业|学科|门类/.test(text)) {
        return "这是模拟回复，后续将接入AI。\n\n未来这里会识别你的专业名称，并匹配到专业类、学科门类和可报岗位方向。";
      }
      if (/公告|政策|解读/.test(text)) {
        return "这是模拟回复，后续将接入AI。\n\n我会把公告里的关键条件、时间节点和容易踩坑的位置整理成考生能看懂的版本。";
      }
      if (/学习|备考|规划/.test(text)) {
        return "这是模拟回复，后续将接入AI。\n\n| 阶段 | 重点 |\n| --- | --- |\n| 第一步 | 确认考试科目 |\n| 第二步 | 刷历年真题 |\n| 第三步 | 按薄弱模块复盘 |";
      }
      return MOCK_REPLY.message;
    }

    addThinkingMessage() {
      const id = `thinking-${Date.now()}`;
      this.messages.push({ id, role: "assistant", thinking: true, createdAt: Date.now() });
      this.renderMessages(false);
      return id;
    }

    addMessage(message) {
      this.messages.push({
        id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: Date.now(),
        ...message
      });
      this.saveMessages();
      this.renderMessages();
    }

    removeMessage(id) {
      this.messages = this.messages.filter(message => message.id !== id);
      this.renderMessages(false);
    }

    clearMessages() {
      this.messages = [];
      localStorage.removeItem(STORAGE_KEY);
      this.renderMessages();
      this.setStatus("online");
    }

    loadMessages() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").slice(-30);
      } catch {
        return [];
      }
    }

    saveMessages() {
      const persisted = this.messages.filter(message => !message.thinking).slice(-30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }

    renderMessages(save = true) {
      this.messagesEl.innerHTML = this.messages.map(message => this.messageHtml(message)).join("");
      if (save) this.saveMessages();
      this.scrollToBottom();
    }

    messageHtml(message) {
      const isUser = message.role === "user";
      const avatar = isUser
        ? '<span class="assistant-msg-avatar assistant-user-avatar">我</span>'
        : `<span class="assistant-msg-avatar assistant-yangfan-avatar">${this.personHtml("bust", "assistant-msg-person")}</span>`;
      const content = message.thinking
        ? `<span class="assistant-thinking">${this.personHtml("thinking", "assistant-thinking-person")}杨帆正在思考<span class="assistant-dots"><i></i><i></i><i></i></span></span>`
        : this.renderMarkdown(message.content);
      return `
        <div class="assistant-message ${isUser ? "is-user" : "is-assistant"}">
          ${avatar}
          <div class="assistant-bubble-wrap">
            <div class="assistant-bubble">${content}</div>
            <time class="assistant-time">${this.formatTime(message.createdAt)}</time>
          </div>
        </div>
      `;
    }

    renderMarkdown(markdown = "") {
      const lines = String(markdown).split(/\r?\n/);
      const html = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith("```")) {
          const code = [];
          i++;
          while (i < lines.length && !lines[i].trim().startsWith("```")) {
            code.push(lines[i]);
            i++;
          }
          html.push(`<pre><code>${this.escape(code.join("\n"))}</code></pre>`);
          continue;
        }
        if (line.includes("|") && lines[i + 1] && /^\s*\|?\s*:?-{3,}:?\s*\|/.test(lines[i + 1])) {
          const headers = line.split("|").map(cell => cell.trim()).filter(Boolean);
          i += 2;
          const rows = [];
          while (i < lines.length && lines[i].includes("|")) {
            rows.push(lines[i].split("|").map(cell => cell.trim()).filter(Boolean));
            i++;
          }
          i--;
          html.push(`<table><thead><tr>${headers.map(h => `<th>${this.inline(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${this.inline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
          continue;
        }
        if (line.trim().startsWith(">")) {
          html.push(`<blockquote>${this.inline(line.replace(/^>\s?/, ""))}</blockquote>`);
          continue;
        }
        if (/^\s*[-*]\s+/.test(line)) {
          const items = [];
          while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
            items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
            i++;
          }
          i--;
          html.push(`<ul>${items.map(item => `<li>${this.inline(item)}</li>`).join("")}</ul>`);
          continue;
        }
        if (line.trim()) html.push(`<p>${this.inline(line)}</p>`);
      }
      return html.join("");
    }

    inline(text) {
      return this.escape(text)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, "<code>$1</code>");
    }

    escape(value) {
      const div = document.createElement("div");
      div.textContent = String(value ?? "");
      return div.innerHTML;
    }

    formatTime(time) {
      const date = new Date(time || Date.now());
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }

    setStatus(status) {
      this.status = status;
      this.el.dataset.status = status;
      this.statusText.textContent = STATUS_LABELS[status] || STATUS_LABELS.online;
    }

    autoResizeInput() {
      this.input.style.height = "auto";
      this.input.style.height = `${Math.min(this.input.scrollHeight, 112)}px`;
    }

    scrollToBottom() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }

    startDrag(event) {
      if (event.target.closest("button")) return;
      if (window.matchMedia("(max-width: 768px)").matches) return;
      this.isDragging = true;
      const rect = this.panel.getBoundingClientRect();
      this.dragStart = {
        x: event.clientX,
        y: event.clientY,
        left: rect.left,
        top: rect.top
      };
      this.panel.setPointerCapture?.(event.pointerId);
    }

    onDrag(event) {
      if (!this.isDragging || !this.dragStart) return;
      const nextLeft = this.dragStart.left + event.clientX - this.dragStart.x;
      const nextTop = this.dragStart.top + event.clientY - this.dragStart.y;
      const maxLeft = window.innerWidth - this.panel.offsetWidth - 12;
      const maxTop = window.innerHeight - this.panel.offsetHeight - 12;
      this.panel.style.left = `${Math.max(12, Math.min(maxLeft, nextLeft))}px`;
      this.panel.style.top = `${Math.max(12, Math.min(maxTop, nextTop))}px`;
      this.panel.style.right = "auto";
      this.panel.style.bottom = "auto";
    }

    endDrag() {
      this.isDragging = false;
      this.dragStart = null;
    }
  }

  function initAssistant() {
    if (window.AssistantWidget && document.querySelector(".assistant-widget")) return;
    new AssistantWidget().mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAssistant);
  } else {
    initAssistant();
  }
})();

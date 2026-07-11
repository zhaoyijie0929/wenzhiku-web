(function() {
  const STORAGE_KEY = "welcome_letter_read";
  const IMAGE_SRC = "assets/welcome/welcome-letter.png";

  function isHomePage() {
    const filename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1) || "index.html";
    return filename === "index.html" || filename === "";
  }

  function shouldShow() {
    return isHomePage() && localStorage.getItem(STORAGE_KEY) !== "true";
  }

  function buildWelcomeLetter() {
    const overlay = document.createElement("section");
    overlay.className = "welcome-letter-overlay";
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "致考生一封信");
    overlay.innerHTML = `
      <div class="welcome-letter-stage">
        <div class="welcome-letter-scroll">
          <img class="welcome-letter-image" src="${IMAGE_SRC}" alt="致每一位正在备考军队文职的考生">
        </div>
        <button type="button" class="welcome-letter-start">开始体验</button>
      </div>
    `;
    return overlay;
  }

  function closeWelcome(overlay) {
    localStorage.setItem(STORAGE_KEY, "true");
    overlay.classList.remove("is-active");
    document.body.classList.remove("welcome-letter-locked");
    window.setTimeout(() => overlay.remove(), 260);
  }

  function init() {
    if (!shouldShow()) return;

    const overlay = buildWelcomeLetter();
    document.body.appendChild(overlay);
    document.body.classList.add("welcome-letter-locked");
    overlay.querySelector(".welcome-letter-start").addEventListener("click", () => closeWelcome(overlay));

    window.requestAnimationFrame(() => {
      overlay.classList.add("is-visible");
      window.requestAnimationFrame(() => overlay.classList.add("is-active"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

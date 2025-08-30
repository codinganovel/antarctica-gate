// antarctica-gate.js
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // SSR / non-browser environment: do nothing.
    return;
  }

  const KEY = "antarctica-ok";

  // Embedded CSS for automatic injection (keeps package zero-dep and opt-out free)
  const CSS_TEXT = `
    :root{
      --ant-font: -apple-system, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif;
      --ant-bg: rgba(10,14,20,0.95);
      --ant-text: #e6eef6;
      --ant-primary: #60a5fa;
      --ant-danger: #60a5fa;
      --ant-overlay: rgba(2,6,23,0.75);
      --ant-radius: 10px;
      --ant-shadow: 0 8px 24px rgba(2,6,23,0.6);
    }
    .ant-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:var(--ant-overlay);z-index:9999;backdrop-filter:blur(6px)}
    .ant-card{background:var(--ant-bg);color:var(--ant-text);font-family:var(--ant-font);max-width:420px;padding:1rem;border-radius:var(--ant-radius);box-shadow:var(--ant-shadow);text-align:center;transform-origin:center;animation:ant-pop .16s ease-out;border:1px solid rgba(255,255,255,0.03)}
    @keyframes ant-pop{from{opacity:0;transform:translateY(6px) scale(.995)}to{opacity:1;transform:none}}
    .ant-card h2{margin:0 0 .25rem;font-size:1.125rem;font-weight:600}
    .ant-card p{margin:.25rem 0 1rem;color:var(--ant-text);opacity:.92}
    .ant-actions{display:flex;gap:.5rem;justify-content:center}
    .ant-btn{display:inline-block;border:0;padding:.45rem .85rem;border-radius:8px;cursor:pointer;background:transparent;color:var(--ant-text);transition:transform .08s ease,background-color .12s ease,opacity .12s;outline-offset:3px;border:1px solid rgba(255,255,255,0.04)}
    .ant-btn:hover{opacity:.95}
    .ant-btn:active{transform:translateY(1px)}
    .ant-btn:focus{outline:none;box-shadow:none}
    .ant-btn::-moz-focus-inner{border:0}
    .ant-btn{-webkit-tap-highlight-color:transparent}
    .ant-btn--primary{background:transparent;color:var(--ant-danger);border-color:rgba(248,113,113,0.12)}
    .ant-btn--danger{background:transparent;color:var(--ant-danger);border-color:rgba(248,113,113,0.12)}
    @media (prefers-reduced-motion:reduce){.ant-card{animation:none}}
    @media (prefers-color-scheme:dark){:root{--ant-bg:rgba(6,8,14,0.9);--ant-text:#eef6ff;--ant-overlay:rgba(1,3,6,0.8);--ant-shadow:0 8px 22px rgba(0,0,0,0.6)}}
  `;

  function ensureStyles() {
    if (document.getElementById('ant-styles')) return;
    try {
      const s = document.createElement('style');
      s.id = 'ant-styles';
      s.type = 'text/css';
      s.appendChild(document.createTextNode(CSS_TEXT));
      (document.head || document.documentElement).appendChild(s);
    } catch (_) {
      // ignore if styles can't be injected
    }
  }

  function blockSite() {
    ensureStyles();
    let overlay = document.getElementById("ant-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "ant-overlay";
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="ant-overlay" role="dialog" aria-modal="true" aria-labelledby="ant-blocked-title">
        <div class="ant-card">
          <h2 id="ant-blocked-title">Access Unavailable</h2>
          <p>Sorry, this site isn’t available in your region.</p>
        </div>
      </div>
    `;
    try { document.body.style.overflow = 'hidden'; } catch (_) {}
  }

  function allowSite() {
    const overlay = document.getElementById("ant-overlay");
    if (overlay) overlay.remove();
    try { document.body.style.overflow = ''; } catch (_) {}
  }

  function injectOverlay() {
    ensureStyles();
    if (document.getElementById("ant-overlay")) {
      try { document.body.style.overflow = 'hidden'; } catch (_) {}
      return;
    }
    const overlay = document.createElement("div");
    overlay.id = "ant-overlay";
    overlay.innerHTML = `
      <div class="ant-overlay">
        <div class="ant-card">
          <p>None of the online safety acts apply in Antarctica.<br>Are you in Antarctica?</p>
          <div>
            <button id="ant-yes" class="ant-btn ant-btn--primary" type="button">Yes</button>
            <button id="ant-no" class="ant-btn ant-btn--danger" type="button">No</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    try { document.body.style.overflow = 'hidden'; } catch (_) {}

    const yes = document.getElementById("ant-yes");
    const no = document.getElementById("ant-no");
    if (yes) {
      yes.onclick = () => {
        try { localStorage.setItem(KEY, "true"); } catch (_) {}
        allowSite();
      };
      try { yes.focus(); } catch (_) {}
    }

    if (no) {
      no.onclick = () => {
        try { localStorage.setItem(KEY, "false"); } catch (_) {}
        blockSite();
      };
    }

    // keyboard: escape closes the prompt (considers as allowing)
    function onKey(e) {
      if (e.key === 'Escape') {
        allowSite();
        document.removeEventListener('keydown', onKey);
      }
    }
    document.addEventListener('keydown', onKey);
  }

  function init() {
    let saved;
    try { saved = localStorage.getItem(KEY); } catch (_) { saved = null; }
    if (saved === "true") {
      return;
    } else if (saved === "false") {
      blockSite();
      return;
    }
    injectOverlay();
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (_) {}
    allowSite();
  }

  // Expose a tiny API for convenience
  window.AntarcticaGate = {
    open: init,
    reset,
    allow: allowSite,
    block: blockSite,
  };
  // No auto-init: consumer calls AntarcticaGate.open() when desired
})();

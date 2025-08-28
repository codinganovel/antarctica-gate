// antarctica-gate.js
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // SSR / non-browser environment: do nothing.
    return;
  }

  const KEY = "antarctica-ok";

  function blockSite() {
    let overlay = document.getElementById("ant-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "ant-overlay";
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div role="dialog" aria-modal="true" aria-labelledby="ant-blocked-title"
           style="position:fixed;inset:0;background:rgba(0,0,0,0.7);
                  display:flex;align-items:center;justify-content:center;z-index:9999">
        <div style="background:white;padding:1.5rem;border-radius:.5rem;
                    max-width:360px;text-align:center;font-family:sans-serif">
          <h2 id="ant-blocked-title" style="margin-top:0">Access Unavailable</h2>
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
    if (document.getElementById("ant-overlay")) {
      try { document.body.style.overflow = 'hidden'; } catch (_) {}
      return;
    }
    const overlay = document.createElement("div");
    overlay.id = "ant-overlay";
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);
                  display:flex;align-items:center;justify-content:center;z-index:9999">
        <div style="background:white;padding:1.5rem;border-radius:.5rem;
                    max-width:320px;text-align:center;font-family:sans-serif">
          <p>None of the online safety acts apply in Antarctica.<br>Are you in Antarctica?</p>
          <button id="ant-yes" style="background:#4caf50;color:white;padding:.5rem 1rem;margin:.5rem;border:none;border-radius:.25rem;cursor:pointer">Yes</button>
          <button id="ant-no" style="background:#f44336;color:white;padding:.5rem 1rem;margin:.5rem;border:none;border-radius:.25rem;cursor:pointer">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    try { document.body.style.overflow = 'hidden'; } catch (_) {}

    document.getElementById("ant-yes").onclick = () => {
      try { localStorage.setItem(KEY, "true"); } catch (_) {}
      allowSite();
    };

    document.getElementById("ant-no").onclick = () => {
      try { localStorage.setItem(KEY, "false"); } catch (_) {}
      blockSite();
    };
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

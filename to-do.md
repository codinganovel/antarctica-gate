# CSS Enhancements TODO

Goal: keep the package zero‑dep and framework‑agnostic while allowing easy theming and visual polish.

- Class hooks: add classes to key nodes so styles can live in CSS instead of inline styles.
  - Examples: `.ant-overlay`, `.ant-card`, `.ant-btn`, `.ant-btn--primary`, `.ant-btn--danger`.
- CSS variables: expose theme tokens with sensible defaults; allow users to override.
  - `--ant-font`, `--ant-bg`, `--ant-text`, `--ant-primary`, `--ant-danger`, `--ant-overlay`, `--ant-radius`, `--ant-shadow`.
- Optional stylesheet: ship a tiny CSS file (opt‑in) that applies defaults via the classes/variables above.
  - Keep it small (<1KB gz). Users can copy or import it.
- Typography: switch to a nicer system stack by default.
  - `font-family: var(--ant-font, -apple-system, Segoe UI, Roboto, Inter, sans-serif);`
- Depth/shape: subtle shadow and larger radius on the card.
  - `box-shadow: var(--ant-shadow, 0 10px 30px rgba(0,0,0,.15)); border-radius: var(--ant-radius, 12px);`
- Backdrop polish: semi‑opaque overlay with optional blur.
  - `.ant-overlay { background: rgba(0,0,0,.6); backdrop-filter: blur(4px); }`
- Buttons: hover/active states and transitions; visible focus rings.
  - `transition: background-color .2s, transform .1s; outline: 2px solid var(--ant-primary); outline-offset: 2px;`
- Dark mode: support `prefers-color-scheme: dark` by swapping variables.
- Reduced motion: respect `prefers-reduced-motion` to disable animations.
- Micro‑animation: fade/scale the card on open/close.
- Z-index and scroll lock: keep high `z-index`; ensure body scroll locking is consistent across states.
- Theming API (follow‑up): allow passing a CSS class or data attribute (e.g., `data-ant-theme="dark"`) to toggle themes without JS options.

Notes
- No build step required. If we add a CSS file, keep `package.json#files` minimal and document optional import.
- Current `package.json#files` prevents publishing `test.html` and this `to-do.md`.

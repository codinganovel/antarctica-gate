# antarctica-gate 🐧

A tiny satirical JavaScript popup.

When users visit your site, it asks:
"Are you in Antarctica?"

- **Yes** → site loads normally.
- **No** → blocked with a polite message.
- Remembers choice in `localStorage`.

## Install

```bash
npm i antarctica-gate
```

## Quick start (CDN)

```html
<link rel="stylesheet" href="./antarctica-gate.css"> <!-- optional: import to get improved visuals -->
<script src="https://unpkg.com/antarctica-gate"></script>
<script>
  // call it when you want to ask
  window.AntarcticaGate.open();
  // optional helpers:
  // window.AntarcticaGate.reset();
  // window.AntarcticaGate.block();
  // window.AntarcticaGate.allow();
  </script>
```

This package does not auto-run. Call `AntarcticaGate.open()` to show the prompt. 🐧
the css is backed in the .js, the file is there if you decide you want to edit it.

## Usage (bundlers/SSR)

This package is safe to import in SSR; it no-ops on the server and runs in the browser.

```js
import 'antarctica-gate';
// later, after your app mounts / on user action:
window.AntarcticaGate.open();
```

## License

The Coffee License (see LICENSE.md).

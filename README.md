# Letterhead Composer

A browser-based editor for composing official letters on a custom letterhead. Write in a lightweight-markup rich text editor, preview live pagination onto A4 pages with your letterhead as the page-1 background, and export a print-ready PDF — all client-side, no server or build step required.

## Features

- Rich text editing via `contenteditable`, with a formatting toolbar (headings, bold/italic/underline, lists, indent, blockquote, horizontal rule, undo/redo).
- Lightweight markup shortcuts while typing: `# `, `## `, `### ` for headings, `- ` / `* ` for bullet lists, `1. ` for numbered lists, `> ` for quotes, `---` for a horizontal rule, and inline `**bold**`, `*italic*`, `__underline__`.
- Upload a letterhead PDF — its first page is rendered and used as the background of page 1.
- Upload a custom TTF font, loaded via the `FontFace` API.
- Configurable page-1 top offset, left/right/bottom margins, font size, line spacing, and text alignment.
- Live paginated preview that mirrors the exported PDF exactly.
- One-click export to a print-ready A4 PDF (via `html2canvas` + `jsPDF`).

## Project structure

```
Letterhead-Composer/
│
├── index.html
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js          # Entry point: imports all modules, wires settings panel, starts app
│   ├── state.js         # Shared application state and layout constants
│   ├── editor.js        # Editor element + lightweight markup auto-conversion
│   ├── toolbar.js       # Toolbar button and heading-select wiring
│   ├── pagination.js     # Splits editor content across A4 preview pages
│   ├── pdfExport.js      # Rasterizes preview pages and exports a PDF
│   ├── letterhead.js     # Letterhead PDF upload + rendering (PDF.js)
│   ├── fontLoader.js     # Custom TTF font upload (FontFace API)
│   └── utils.js          # Generic helpers (cm↔px conversion, caret placement)
│
├── LICENSE
├── .gitignore
└── README.md
```

## Running locally

No build tools or dependencies to install. Because the app uses native ES6 modules (`<script type="module">`), it must be served over `http://` rather than opened directly via `file://` in most browsers. From the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

This project uses only relative paths and browser-native ES modules — no bundler or build step is needed. Push the repository and enable GitHub Pages (Settings → Pages → Deploy from branch), pointing at the root of the branch. `index.html` will be served directly.

## Third-party libraries

Loaded via CDN in `index.html`:

- [pdf.js](https://mozilla.github.io/pdf.js/) — renders the uploaded letterhead PDF to an image.
- [html2canvas](https://html2canvas.hertzen.com/) — rasterizes preview pages for export.
- [jsPDF](https://github.com/parallax/jsPDF) — assembles the final PDF.

## License

MIT — see [LICENSE](./LICENSE).
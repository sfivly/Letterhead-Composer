import { state, PAGE_W_CM, PAGE_H_CM } from './state.js';
import { cm } from './utils.js';
import { editor } from './editor.js';

export const previewPages = document.getElementById('previewPages');

/* =====================================================================
   PAGINATION
   Splits the editor's block-level children across A4 pages based on
   the configured margins/top-offset, respecting: letterhead + offset
   on page 1 only, plain 1.5 cm margins + centered "(n)" page numbers
   from page 2 onward.
   ===================================================================== */
let paginateTimer = null;
export function schedulePaginate() {
  clearTimeout(paginateTimer);
  paginateTimer = setTimeout(paginate, 220);
}

export function paginate() {
  const blocks = Array.from(editor.children);
  previewPages.innerHTML = '';

  if (blocks.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Start typing to see the paginated preview.';
    previewPages.appendChild(empty);
    return;
  }

  const pageWpx = cm(PAGE_W_CM);
  const pageHpx = cm(PAGE_H_CM);
  const contentWpx = pageWpx - cm(state.marginLeft) - cm(state.marginRight);

  // Off-screen measuring container mirrors the content-block styling
  const measurer = document.createElement('div');
  measurer.style.position = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.left = '-99999px';
  measurer.style.width = contentWpx + 'px';
  applyTypography(measurer);
  document.body.appendChild(measurer);

  let pageIndex = 0;
  let currentPage = createPageEl(pageIndex);
  let currentContentBlock = currentPage.contentBlock;
  let usedHeight = 0;
  let maxHeight = pageHpx - cm(state.topOffset) - cm(state.marginBottom);

  previewPages.appendChild(currentPage.el);

  blocks.forEach((block) => {
    const clone = block.cloneNode(true);
    measurer.appendChild(clone);
    const h = clone.getBoundingClientRect().height;
    measurer.removeChild(clone);

    if (usedHeight + h > maxHeight && usedHeight > 0) {
      // start a new page
      pageIndex += 1;
      currentPage = createPageEl(pageIndex);
      previewPages.appendChild(currentPage.el);
      currentContentBlock = currentPage.contentBlock;
      usedHeight = 0;
      maxHeight = pageHpx - cm(state.marginBottom) - cm(1.5); // top margin from page 2 on is fixed 1.5cm, already baked into createPageEl top offset
    }
    currentContentBlock.appendChild(block.cloneNode(true));
    usedHeight += h;
  });

  document.body.removeChild(measurer);

  // Add centered page numbers "(n)" from page 2 onward
  const pageEls = Array.from(previewPages.children);
  pageEls.forEach((p, i) => {
    if (i > 0) {
      const num = document.createElement('div');
      num.className = 'page-number';
      num.style.fontFamily = state.fontFamily;
      num.textContent = `(${i + 1})`;
      p.appendChild(num);
    }
  });
}

function applyTypography(el) {
  el.style.fontFamily = state.fontFamily;
  el.style.fontSize = state.fontSize + 'pt';
  el.style.lineHeight = state.lineSpacing;
  el.style.textAlign = state.alignment;
}

function createPageEl(index) {
  const pageWpx = cm(PAGE_W_CM);
  const pageHpx = cm(PAGE_H_CM);
  const isFirst = index === 0;

  const el = document.createElement('div');
  el.className = 'page';
  el.style.width = pageWpx + 'px';
  el.style.height = pageHpx + 'px';

  if (isFirst && state.letterheadDataUrl) {
    const img = document.createElement('img');
    img.src = state.letterheadDataUrl;
    img.className = 'letterhead-bg';
    el.appendChild(img);
  }

  const contentBlock = document.createElement('div');
  contentBlock.className = 'content-block';
  const topCm = isFirst ? state.topOffset : 1.5;
  contentBlock.style.top = cm(topCm) + 'px';
  contentBlock.style.left = cm(state.marginLeft) + 'px';
  contentBlock.style.right = cm(state.marginRight) + 'px';
  contentBlock.style.width = (pageWpx - cm(state.marginLeft) - cm(state.marginRight)) + 'px';
  contentBlock.style.bottom = cm(state.marginBottom) + 'px';
  applyTypography(contentBlock);

  el.appendChild(contentBlock);
  return { el, contentBlock };
}
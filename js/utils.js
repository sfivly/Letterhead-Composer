import { PX_PER_CM } from './state.js';

export function cm(v) { return v * PX_PER_CM; }

export function placeCaretAtStart(node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
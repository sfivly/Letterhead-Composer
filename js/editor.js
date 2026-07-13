import { placeCaretAtStart } from './utils.js';
import { schedulePaginate } from './pagination.js';

export const editor = document.getElementById('editor');

/* =====================================================================
   LIGHTWEIGHT MARKUP AUTO-CONVERSION
   Runs on keydown for space/enter, inspecting the current line's text
   to convert block markers ("# ", "- ", "1. ", "> ", "---") and inline
   markers ("**bold**", "*italic*", "__underline__").
   ===================================================================== */

function getCaretBlock() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return null;
  let node = sel.getRangeAt(0).startContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
  while (node && node !== editor && !/^(P|DIV|H1|H2|H3|LI|BLOCKQUOTE)$/.test(node.tagName)) {
    node = node.parentNode;
  }
  return node === editor ? null : node;
}

editor.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    handleBlockMarker();
  } else if (e.key === 'Enter') {
    // Horizontal rule shortcut: a line that is exactly "---"
    const block = getCaretBlock();
    if (block && block.textContent.trim() === '---') {
      e.preventDefault();
      const hr = document.createElement('hr');
      block.replaceWith(hr);
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      hr.after(p);
      placeCaretAtStart(p);
    }
  }
});

editor.addEventListener('input', () => {
  handleInlineMarkers();
  schedulePaginate();
});

function handleBlockMarker() {
  const block = getCaretBlock();
  if (!block) return;
  const text = block.textContent;
  const map = [
    [/^###\s$/, 'H3'],
    [/^##\s$/, 'H2'],
    [/^#\s$/, 'H1'],
  ];
  for (const [re, tag] of map) {
    if (re.test(text)) {
      const newBlock = document.createElement(tag);
      newBlock.innerHTML = '<br>';
      block.replaceWith(newBlock);
      placeCaretAtStart(newBlock);
      return;
    }
  }
  if (/^[-*]\s$/.test(text)) {
    convertToList(block, 'insertUnorderedList');
    return;
  }
  if (/^1\.\s$/.test(text)) {
    convertToList(block, 'insertOrderedList');
    return;
  }
  if (/^>\s$/.test(text)) {
    const bq = document.createElement('blockquote');
    bq.innerHTML = '<br>';
    block.replaceWith(bq);
    placeCaretAtStart(bq);
    return;
  }
}

function convertToList(block, command) {
  block.textContent = '';
  placeCaretAtStart(block);
  document.execCommand(command, false, null);
}

function handleInlineMarkers() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const node = sel.getRangeAt(0).startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return;
  const text = node.textContent;
  const caret = sel.getRangeAt(0).startOffset;
  const before = text.slice(0, caret);

  const patterns = [
    { re: /\*\*([^*]+)\*\*$/, tag: 'strong' },
    { re: /__([^_]+)__$/, tag: 'u' },
    { re: /(?:^|[^*])\*([^*]+)\*$/, tag: 'em' } // single-asterisk italic, avoids matching inside **
  ];
  for (const p of patterns) {
    const m = before.match(p.re);
    if (m) {
      const matchStart = before.lastIndexOf(m[0]) + (m[0][0] !== '*' && p.tag==='em' ? 1 : 0);
      const fullMatchText = text.slice(matchStart, caret);
      const inner = m[1];
      const wrapper = document.createElement(p.tag);
      wrapper.textContent = inner;
      const range = document.createRange();
      range.setStart(node, matchStart);
      range.setEnd(node, caret);
      range.deleteContents();
      range.insertNode(wrapper);
      // Move caret after the wrapper, add a trailing space placeholder
      const after = document.createTextNode('\u200B');
      wrapper.after(after);
      const r2 = document.createRange();
      r2.setStart(after, 1);
      r2.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r2);
      return;
    }
  }
}
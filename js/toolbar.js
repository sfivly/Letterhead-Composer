import { editor } from './editor.js';
import { schedulePaginate } from './pagination.js';

document.getElementById('toolbar').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-cmd]');
  if (!btn) return;
  editor.focus();
  const cmd = btn.dataset.cmd;
  if (cmd === 'blockquote') {
    document.execCommand('formatBlock', false, 'blockquote');
  } else if (cmd === 'hr') {
    document.execCommand('insertHorizontalRule');
  } else {
    document.execCommand(cmd, false, null);
  }
  schedulePaginate();
});

document.getElementById('headingSelect').addEventListener('change', (e) => {
  editor.focus();
  document.execCommand('formatBlock', false, e.target.value);
  schedulePaginate();
});
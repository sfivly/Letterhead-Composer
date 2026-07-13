import { state } from './state.js';
import { schedulePaginate } from './pagination.js';

// Side-effect modules: these attach their own DOM event listeners on import.
import './editor.js';
import './toolbar.js';
import './letterhead.js';
import './fontLoader.js';
import './pdfExport.js';

/* =====================================================================
   SETTINGS PANEL WIRING
   ===================================================================== */
function bindNumberField(id, key){
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    const v = parseFloat(el.value);
    state[key] = isNaN(v) ? 0 : v;
    schedulePaginate();
  });
}
bindNumberField('topOffset','topOffset');
bindNumberField('marginLeft','marginLeft');
bindNumberField('marginRight','marginRight');
bindNumberField('marginBottom','marginBottom');
bindNumberField('fontSize','fontSize');
bindNumberField('lineSpacing','lineSpacing');

document.getElementById('fontFamily').addEventListener('change', (e) => {
  state.fontFamily = e.target.value;
  schedulePaginate();
});
document.getElementById('alignment').addEventListener('change', (e) => {
  state.alignment = e.target.value;
  schedulePaginate();
});

/* =====================================================================
   INIT
   ===================================================================== */
schedulePaginate();

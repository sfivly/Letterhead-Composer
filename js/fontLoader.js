import { state } from './state.js';
import { schedulePaginate } from './pagination.js';

/* =====================================================================
   CUSTOM FONT UPLOAD (TTF) → FontFace API
   ===================================================================== */
document.getElementById('fontInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const statusEl = document.getElementById('fontStatus');
  statusEl.textContent = 'Loading font…';
  try {
    const buf = await file.arrayBuffer();
    const face = new FontFace('CustomFont', buf);
    await face.load();
    document.fonts.add(face);
    state.customFontLoaded = true;
    statusEl.textContent = `Loaded: ${file.name}`;
    statusEl.classList.remove('empty');
    // Auto-select the custom font once uploaded
    const sel = document.getElementById('fontFamily');
    sel.value = 'CustomFont';
    state.fontFamily = 'CustomFont';
    schedulePaginate();
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Could not load this font file.';
  }
});
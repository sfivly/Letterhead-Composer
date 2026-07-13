import { state, PX_PER_CM, PAGE_W_CM } from './state.js';
import { schedulePaginate } from './pagination.js';

/* =====================================================================
   LETTERHEAD PDF UPLOAD → render page 1 to an image via PDF.js
   ===================================================================== */
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.getElementById('letterheadInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const statusEl = document.getElementById('letterheadStatus');
  statusEl.textContent = 'Rendering letterhead…';
  statusEl.classList.add('empty');
  try {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const page = await pdf.getPage(1);
    // Render at high resolution so it stays crisp when scaled up to page size / PDF export
    const targetWidthPx = PAGE_W_CM * PX_PER_CM * 3; // 3x for sharpness
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = targetWidthPx / baseViewport.width;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    state.letterheadDataUrl = canvas.toDataURL('image/png');
    state.letterheadPxRatio = viewport.width / viewport.height;
    statusEl.textContent = `Loaded: ${file.name}`;
    statusEl.classList.remove('empty');
    schedulePaginate();
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Could not read this PDF.';
  }
});
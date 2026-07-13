import { PAGE_W_CM, PAGE_H_CM } from './state.js';
import { paginate, previewPages } from './pagination.js';

/* =====================================================================
   PDF EXPORT
   Rasterizes each preview page (which already reflects letterhead,
   margins, font, spacing and pagination) via html2canvas, then places
   each as a full-bleed image on an A4 page in a jsPDF document.
   ===================================================================== */
document.getElementById('exportBtn').addEventListener('click', exportPdf);

async function exportPdf() {
  const overlay = document.getElementById('exportOverlay');
  const overlayText = document.getElementById('exportOverlayText');
  overlay.classList.add('show');
  try {
    await document.fonts.ready;
    paginate(); // ensure preview is fully up to date before capture
    await new Promise(r => setTimeout(r, 50));

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'cm', format: 'a4', orientation: 'portrait' });
    const pages = Array.from(previewPages.querySelectorAll('.page'));

    for (let i = 0; i < pages.length; i++) {
      overlayText.textContent = `Rendering page ${i + 1} of ${pages.length}…`;
      const canvas = await html2canvas(pages[i], { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, PAGE_W_CM, PAGE_H_CM);
    }

    overlayText.textContent = 'Saving…';
    pdf.save('letter.pdf');
  } catch (err) {
    console.error(err);
    alert('Something went wrong while exporting the PDF. Please check the console for details.');
  } finally {
    overlay.classList.remove('show');
  }
}
/* =====================================================================
   GLOBAL STATE
   ===================================================================== */
export const state = {
  letterheadDataUrl: null,     // rendered PNG of page 1 of uploaded letterhead
  letterheadPxRatio: null,     // width/height of the rendered letterhead image
  customFontLoaded: false,
  topOffset: 4,
  marginLeft: 1.5,
  marginRight: 1.5,
  marginBottom: 1.5,
  fontFamily: "'Noto Serif', Georgia, 'Times New Roman', serif",
  fontSize: 12,
  lineSpacing: 1.5,
  alignment: 'justify'
};

export const PX_PER_CM = 37.7952755906; // 96dpi CSS px per cm, used for on-screen preview sizing
export const PAGE_W_CM = 21;   // A4 width
export const PAGE_H_CM = 29.7; // A4 height
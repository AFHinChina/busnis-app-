import { jsPDF } from 'jspdf';

// Embed the font directly to avoid network requests
const NOTO_SANS_ARABIC_BASE64 = 'AAEAAAARAQAABAAQR1BPU...'; // Base64 font data

export const addFont = (doc: jsPDF) => {
  try {
    doc.addFileToVFS('NotoSansArabic.ttf', NOTO_SANS_ARABIC_BASE64);
    doc.addFont('NotoSansArabic.ttf', 'NotoSansArabic', 'normal');
    doc.setFont('NotoSansArabic');
    return true;
  } catch (error) {
    console.error('Error adding font:', error);
    return false;
  }
};
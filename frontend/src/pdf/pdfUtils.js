import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  console.log(extractContactInfo(text));
  return text;
}




export function extractContactInfo(text) {
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let name = '';
  if (lines.length > 0) {
    name = lines[0].split(/[\d@|]/)[0].trim();
    name = name.replace(/[^a-zA-Z\s]/g, '').trim();
  }

  const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\d{10}/);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  return {
    name: name,
    phone: phoneMatch ? phoneMatch[0] : '',
    email: emailMatch ? emailMatch[0] : ''
  };
}
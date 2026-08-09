const fs = require('fs');
const path = require('path');

const publicMagDir = path.join(__dirname, 'public', 'magazines');
if (!fs.existsSync(publicMagDir)) {
  fs.mkdirSync(publicMagDir, { recursive: true });
}

// Minimal valid PDF binary content for Ideology of Mahdism Issue #1
const pdfHeader = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length 120
>>
stream
BT
/F1 18 Tf
50 700 Td
(Ideology of Mahdism - Issue 1 - Summer 2025) Tj
/F1 12 Tf
0 -30 Td
(Official Intellectual Magazine) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000280 00000 n 
trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
450
%%EOF`;

const pdfPath = path.join(publicMagDir, 'issue-1-mahdaviyat.pdf');
fs.writeFileSync(pdfPath, Buffer.from(pdfHeader, 'utf-8'));
console.log('Successfully created PDF at:', pdfPath);

const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify');

console.log('Reading assets from dist...');
const cssRaw = fs.readFileSync(path.join(__dirname, 'dist', 'assets', 'index-CkDTN356.css'), 'utf8');
const jsRaw = fs.readFileSync(path.join(__dirname, 'dist', 'assets', 'index-CuXVx2fn.js'), 'utf8');

console.log('Formatting CSS...');
const cssFormatted = beautify.css(cssRaw, {
  indent_size: 2,
  preserve_newlines: true,
  max_preserve_newlines: 2
});

console.log('Adjusting asset paths and formatting JavaScript...');
// Ensure relative paths for all assets
const jsAdjusted = jsRaw
  .replace(/"\/maggi_front\.jpg"/g, '"./maggi_front.jpg"')
  .replace(/"\/maggi_back\.jpg"/g, '"./maggi_back.jpg"')
  .replace(/"\/package_box\.jpg"/g, '"./package_box.jpg"')
  .replace(/'\/maggi_front\.jpg'/g, "'./maggi_front.jpg'")
  .replace(/'\/maggi_back\.jpg'/g, "'./maggi_back.jpg'")
  .replace(/'\/package_box\.jpg'/g, "'./package_box.jpg'");

const jsFormatted = beautify.js(jsAdjusted, {
  indent_size: 2,
  preserve_newlines: true,
  max_preserve_newlines: 2,
  space_in_paren: false,
  break_chained_methods: false
});

console.log('Assembling unified HTML document...');
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Legal Metrology Compliance Checker - Unified Application</title>
  
  <!-- ================================================================= -->
  <!-- GOOGLE FONTS PRECONNECT & STYLESHEETS                           -->
  <!-- ================================================================= -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

  <!-- ================================================================= -->
  <!-- APPLICATION CORE STYLES (INLINED & PROPERLY FORMATTED)          -->
  <!-- ================================================================= -->
  <style>
${cssFormatted}
  </style>
</head>
<body>
  <!-- ================================================================= -->
  <!-- APPLICATION ROOT CONTAINER                                      -->
  <!-- ================================================================= -->
  <div id="root"></div>

  <!-- ================================================================= -->
  <!-- APPLICATION CODE BUNDLE (STANDALONE, FORMATTED & UNIFIED)       -->
  <!-- Includes React 19, Lucide Icons, jsPDF, Tesseract OCR, Rules,   -->
  <!-- Full Screen Navigation, Handbooks, Modals, State & Compliance   -->
  <!-- ================================================================= -->
  <script type="module">
${jsFormatted}
  </script>
</body>
</html>
`;

console.log('Writing LegalMetrology_App.html...');
fs.writeFileSync(path.join(__dirname, 'LegalMetrology_App.html'), htmlTemplate, 'utf8');

console.log('Writing legalmetrology.html (alias)...');
fs.writeFileSync(path.join(__dirname, 'legalmetrology.html'), htmlTemplate, 'utf8');

// Also copy image assets to root so that ./package_box.jpg, etc. resolve directly when opening the HTML locally
const publicDir = path.join(__dirname, 'public');
const assets = ['maggi_front.jpg', 'maggi_back.jpg', 'package_box.jpg', 'favicon.svg', 'icons.svg'];
for (const asset of assets) {
  const src = path.join(publicDir, asset);
  const dest = path.join(__dirname, asset);
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${asset} to root directory.`);
  }
}

console.log('Success! Single file application created and properly arranged.');

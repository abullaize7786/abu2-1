import { jsPDF } from 'jspdf';

export function generateCompliancePDF({
  reportId = 'LMPC-REPORT-001',
  scanDate = new Date().toLocaleDateString('en-GB'),
  productData = {},
  complianceChecks = {},
  flags = [],
  currentUser = 'Inspector'
}) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryColor = [14, 116, 144]; // Deep Teal
    const redColor = [220, 38, 38];
    const greenColor = [22, 163, 74];
    const darkColor = [30, 41, 59];
    const grayColor = [100, 116, 139];
    const lightBg = [248, 250, 252];

    // --- 1. Header Banner ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('LEGAL METROLOGY COMPLIANCE REPORT', pageWidth / 2, 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Government of India  •  Ministry of Consumer Affairs, Food & Public Distribution', pageWidth / 2, 18, { align: 'center' });
    doc.text('Under Legal Metrology (Packaged Commodities) Rules, 2011', pageWidth / 2, 23, { align: 'center' });

    // --- 2. Report & Audit Metadata Box ---
    doc.setFillColor(...lightBg);
    doc.roundedRect(12, 34, pageWidth - 24, 22, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(12, 34, pageWidth - 24, 22, 2, 2, 'S');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Report ID:', 16, 41);
    doc.text('Inspection Date:', 16, 49);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...primaryColor);
    doc.text(reportId || 'LMPC-REPORT-001', 35, 41);
    doc.setTextColor(...darkColor);
    doc.text(scanDate || new Date().toLocaleString(), 42, 49);

    doc.setFont('helvetica', 'bold');
    doc.text('Inspector / Officer:', 115, 41);
    doc.text('Audit Status:', 115, 49);

    doc.setFont('helvetica', 'normal');
    doc.text(currentUser || 'Authorized Inspector (Officer #LM-408)', 146, 41);

    const isCompliant = flags.length === 0;
    if (isCompliant) {
      doc.setTextColor(...greenColor);
      doc.setFont('helvetica', 'bold');
      doc.text('FULLY COMPLIANT', 140, 49);
    } else {
      doc.setTextColor(...redColor);
      doc.setFont('helvetica', 'bold');
      doc.text(`NON-COMPLIANT (${flags.length} Violations)`, 140, 49);
    }

    // --- 3. Product Details Section ---
    let yPos = 64;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text('1. Packaged Commodity Details', 14, yPos);

    yPos += 4;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(14, yPos, pageWidth - 14, yPos);

    yPos += 6;
    const productName = productData?.name || 'Packaged Commodity Item';
    const productVariant = productData?.variant || '-';
    const netQty = productData?.netQuantity || 'Not Declared';
    const mrp = productData?.mrp || 'Not Declared';
    const usp = productData?.unitSalePrice || 'Not Declared';
    const mfg = productData?.mfgDate || 'Not Declared';
    const exp = productData?.bestBefore || 'Not Declared';
    const origin = productData?.countryOfOrigin || 'India';
    const manufacturer = productData?.manufacturer || 'Not Declared';

    const productFields = [
      ['Product Name:', productName, 'Net Quantity:', netQty],
      ['Variant / Pack:', productVariant, 'MRP (incl. taxes):', mrp],
      ['Unit Sale Price:', usp, 'Date of Mfg / Pkg:', mfg],
      ['Best Before:', exp, 'Country of Origin:', origin],
      ['Manufacturer Details:', manufacturer, '', '']
    ];

    doc.setFontSize(8);
    productFields.forEach((row) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...grayColor);
      doc.text(row[0], 16, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkColor);
      doc.text(String(row[1]).substring(0, 42), 52, yPos);

      if (row[2]) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...grayColor);
        doc.text(row[2], 115, yPos);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...darkColor);
        doc.text(String(row[3]).substring(0, 35), 148, yPos);
      }
      yPos += 5.5;
    });

    // --- 4. Verification Summary Box ---
    yPos += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text('2. Rule 6(1) Verification Summary', 14, yPos);

    yPos += 4;
    doc.line(14, yPos, pageWidth - 14, yPos);

    yPos += 6;
    const totalChecks = complianceChecks?.totalChecks || 11;
    const passed = complianceChecks?.passed !== undefined ? complianceChecks.passed : (11 - flags.length);
    const flagged = flags.length;

    // Metrics grid
    const boxW = (pageWidth - 32) / 3;
    // Box 1: Total
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, yPos, boxW, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text(`${totalChecks}`, 14 + boxW / 2, yPos + 6, { align: 'center' });
    doc.setFontSize(7.5);
    doc.setTextColor(...grayColor);
    doc.text('Total Checks', 14 + boxW / 2, yPos + 11, { align: 'center' });

    // Box 2: Passed
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(16 + boxW, yPos, boxW, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...greenColor);
    doc.text(`${passed}`, 16 + boxW + boxW / 2, yPos + 6, { align: 'center' });
    doc.setFontSize(7.5);
    doc.text('Passed Compliantly', 16 + boxW + boxW / 2, yPos + 11, { align: 'center' });

    // Box 3: Flags
    doc.setFillColor(flagged > 0 ? 254 : 240, flagged > 0 ? 242 : 253, flagged > 0 ? 242 : 244);
    doc.roundedRect(18 + boxW * 2, yPos, boxW, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...(flagged > 0 ? redColor : greenColor));
    doc.text(`${flagged}`, 18 + boxW * 2 + boxW / 2, yPos + 6, { align: 'center' });
    doc.setFontSize(7.5);
    doc.text('Flagged Violations', 18 + boxW * 2 + boxW / 2, yPos + 11, { align: 'center' });

    yPos += 20;

    // --- 5. Violations / Flagged Details ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text(`3. Audit Findings & Non-Compliance Items (${flags.length})`, 14, yPos);

    yPos += 4;
    doc.line(14, yPos, pageWidth - 14, yPos);

    yPos += 6;

    if (flags.length === 0) {
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, yPos, pageWidth - 28, 12, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...greenColor);
      doc.text('✓ All mandatory packaging declarations comply with Legal Metrology Rules, 2011.', 18, yPos + 7);
      yPos += 18;
    } else {
      flags.forEach((flag, idx) => {
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(14, yPos, pageWidth - 28, 14, 1.5, 1.5, 'F');
        doc.setDrawColor(254, 202, 202);
        doc.roundedRect(14, yPos, pageWidth - 28, 14, 1.5, 1.5, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...redColor);
        doc.text(`${idx + 1}. ${flag.title || 'Declaration Missing'}`, 18, yPos + 5.5);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...darkColor);
        doc.text(`Rule Citation: ${flag.rule || 'Rule 6(1)'}`, pageWidth - 20, yPos + 5.5, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...grayColor);
        const desc = flag.description || flag.remedy || 'Mandatory declaration must be printed clearly with specified font size.';
        doc.text(desc.substring(0, 95), 18, yPos + 10.5);

        yPos += 17;
      });
    }

    // --- 6. Official Seal & Signatory Box ---
    yPos = Math.max(yPos + 4, 240);
    doc.setDrawColor(203, 213, 225);
    doc.line(14, yPos, pageWidth - 14, yPos);

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...darkColor);
    doc.text('AUTHORIZED INSPECTION SIGNATURE', 16, yPos);
    doc.text('OFFICIAL VERIFICATION EMBLEM', pageWidth - 16, yPos, { align: 'right' });

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...grayColor);
    doc.text('Directorate of Legal Metrology', 16, yPos);
    doc.text('Ministry of Consumer Affairs', 16, yPos + 4);
    doc.text(`Verified Officer ID: #LM-408  •  ${currentUser}`, 16, yPos + 8);

    doc.text('DIGITALLY AUDITED & CERTIFIED', pageWidth - 16, yPos, { align: 'right' });
    doc.text('Legal Metrology Act, 2009', pageWidth - 16, yPos + 4, { align: 'right' });
    doc.text(`Timestamp: ${new Date().toISOString()}`, pageWidth - 16, yPos + 8, { align: 'right' });

    // Download PDF
    const safeFilename = `Legal_Metrology_Report_${reportId.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    doc.save(safeFilename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF via jsPDF:', err);
    // Fallback: trigger print
    window.print();
    return false;
  }
}

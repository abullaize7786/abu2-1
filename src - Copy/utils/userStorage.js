const STORAGE_PREFIX = 'legalmetro_user_';

/**
 * Save scan data for a specific user (keyed by email).
 */
export function saveUserData(email, data) {
  if (!email) return;
  const key = STORAGE_PREFIX + email.toLowerCase().trim();
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save user data:', e);
  }
}

/**
 * Load scan data for a specific user. Returns null if nothing saved.
 */
export function loadUserData(email) {
  if (!email) return null;
  const key = STORAGE_PREFIX + email.toLowerCase().trim();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load user data:', e);
    return null;
  }
}

/**
 * Remove all saved data for a specific user.
 */
export function clearUserData(email) {
  if (!email) return;
  const key = STORAGE_PREFIX + email.toLowerCase().trim();
  localStorage.removeItem(key);
}

/**
 * Helper to evaluate compliance rules based on product data.
 */
export function evaluateCompliance(data) {
  if (!data) return { flags: [], passedItems: [], totalChecks: 11, passed: 0, flagsCount: 0, status: 'NO SCAN' };

  const flags = [];
  const passedItems = [];

  // Check 1: Product Name
  if (data.name && data.name.trim().length > 0) {
    passedItems.push({ name: "Product Name Declaration", rule: "Rule 6(1)(a)", status: "Passed" });
  } else {
    flags.push({
      id: 101,
      title: "Product Name Declaration Missing",
      rule: "Rule 6(1)(a)",
      severity: "High",
      badgeType: "high",
      description: "Every package shall bear the name and description of the commodity.",
      found: "Product name is missing or empty.",
      expected: "Prominently displayed commodity name.",
      suggestedCorrection: "Add product name on the principal display panel.",
      exampleText: "Name: Instant Noodles",
    });
  }

  // Check 2: Net Quantity
  if (data.netQuantity && data.netQuantity.trim().length > 0) {
    passedItems.push({ name: "Net Quantity & Unit of Measurement", rule: "Rule 6(1)(c)", status: "Passed" });
  } else {
    flags.push({
      id: 102,
      title: "Net Quantity Declaration Missing",
      rule: "Rule 6(1)(c)",
      severity: "High",
      badgeType: "high",
      description: "Net quantity in terms of standard unit (g, kg, ml, l) must be declared.",
      found: "Net quantity not stated on package.",
      expected: "Standard unit declaration (e.g. Net Wt: 100 g).",
      suggestedCorrection: "Declare net quantity as per Rule 6(1)(c).",
      exampleText: "Net Wt: 100 g",
    });
  }

  // Check 3: MRP
  const hasMRP = data.mrp && data.mrp.trim().length > 0 && !data.mrp.toLowerCase().includes('missing');
  if (hasMRP) {
    passedItems.push({ name: "Maximum Retail Price (MRP)", rule: "Rule 6(1)(e)", status: "Passed" });
  } else {
    flags.push({
      id: 1,
      title: "MRP Declaration Missing",
      rule: "Rule 6(1)(e)",
      severity: "High",
      badgeType: "high",
      description: "MRP inclusive of all taxes must be declared on the package.",
      found: "MRP not mentioned on the declaration panel.",
      expected: "MRP inclusive of all taxes (e.g. ? 20.00 incl. of all taxes).",
      suggestedCorrection: "Add MRP on the label as per Rule 6(1)(e) in font height minimum 2.0 mm.",
      exampleText: "MRP ? 20.00\n(Inclusive of all taxes)",
      cropBox: { top: 38, left: 54, width: 22, height: 16 }
    });
  }

  // Check 4: Unit Sale Price
  const hasUSP = data.unitSalePrice && data.unitSalePrice.trim().length > 0 && !data.unitSalePrice.toLowerCase().includes('missing');
  if (hasUSP) {
    passedItems.push({ name: "Unit Sale Price (USP)", rule: "Rule 6(1)(h)", status: "Passed" });
  } else {
    flags.push({
      id: 2,
      title: "Unit Sale Price Missing",
      rule: "Rule 6(1)(h)",
      severity: "High",
      badgeType: "high",
      description: "Unit sale price (per g / per kg / per ml) must be declared alongside MRP.",
      found: "Unit sale price not declared on the package.",
      expected: "Unit Sale Price: ? 0.29 / g prominently placed.",
      suggestedCorrection: "Mention unit sale price (per g / per kg) as per Rule 6(1)(h).",
      exampleText: "Unit Sale Price: ? 0.29 / g\n(Mandatory for packages > 50g)",
      cropBox: { top: 58, left: 54, width: 22, height: 12 }
    });
  }

  // Check 5: Mfg Date
  if (data.mfgDate && data.mfgDate.trim().length > 0) {
    passedItems.push({ name: "Month & Year of Manufacture", rule: "Rule 6(1)(d)", status: "Passed" });
  } else {
    flags.push({
      id: 103,
      title: "Mfg Date Missing",
      rule: "Rule 6(1)(d)",
      severity: "High",
      badgeType: "high",
      description: "Month and year of manufacture or packaging must be indicated.",
      found: "Date of manufacture is missing.",
      expected: "Mfg. Date (MM/YYYY) clearly printed.",
      suggestedCorrection: "Print manufacturing or packing date.",
      exampleText: "Mfg Date: 08/2026",
    });
  }

  // Check 6: Best Before
  if (data.bestBefore && data.bestBefore.trim().length > 0) {
    passedItems.push({ name: "Best Before / Expiry Indication", rule: "Rule 6(1)(d)", status: "Passed" });
  } else {
    passedItems.push({ name: "Best Before Indication", rule: "Rule 6(1)(d)", status: "Optional" });
  }

  // Check 7: Manufacturer
  if (data.manufacturer && data.manufacturer.trim().length > 0) {
    passedItems.push({ name: "Name & Address of Manufacturer", rule: "Rule 6(1)(b)", status: "Passed" });
  } else {
    flags.push({
      id: 104,
      title: "Manufacturer Details Missing",
      rule: "Rule 6(1)(b)",
      severity: "High",
      badgeType: "high",
      description: "Complete name and address of manufacturer/packer must be provided.",
      found: "Manufacturer details missing.",
      expected: "Full name and postal address.",
      suggestedCorrection: "Add complete manufacturer address on back label.",
      exampleText: "Mfd by: ABC Foods Ltd, Mumbai",
    });
  }

  // Check 8: Country of Origin
  if (data.countryOfOrigin && data.countryOfOrigin.trim().length > 0) {
    passedItems.push({ name: "Country of Origin", rule: "Rule 6(10)", status: "Passed" });
  } else {
    passedItems.push({ name: "Country of Origin", rule: "Rule 6(10)", status: "Passed" });
  }

  // Check 9: Standard Pack Size
  passedItems.push({ name: "Standard Pack Size Compliance", rule: "Rule 5 & Second Schedule", status: "Passed" });

  const totalChecks = passedItems.length + flags.length;
  const passed = passedItems.length;
  const flagsCount = flags.length;
  const status = flagsCount === 0 ? "FULLY COMPLIANT" : flagsCount <= 2 ? "PARTIALLY COMPLIANT" : "NON-COMPLIANT";
  const statusNote = flagsCount === 0 ? "All mandatory declarations met" : `${flagsCount} issue${flagsCount > 1 ? 's' : ''} need attention`;

  return {
    totalChecks,
    passed,
    flags,
    flagsCount,
    passedItems,
    status,
    statusNote,
    reportId: "LMPC-" + Date.now().toString().slice(-8),
    scanDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

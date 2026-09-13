export const mockProductData = {
  name: "Maggi 2-Minute Noodles",
  variant: "Masala (70g)",
  netQuantity: "70 g",
  mrp: "₹ 20.00 (Declared on front, missing on back specification panel)",
  mrpValue: "₹ 20.00",
  unitSalePrice: "₹ 0.29/g",
  mfgDate: "11-08-2026",
  bestBefore: "10-06-2027",
  manufacturer: "Nestlé India Ltd.",
  countryOfOrigin: "India",
  barcode: "8901058863484",
  batchNo: "B2609A01",
  frontImage: "/maggi_front.jpg",
  backImage: "/maggi_back.jpg",
  packageBoxImage: "/package_box.jpg"
};

export const mockComplianceChecks = {
  totalChecks: 11,
  passed: 7,
  flags: 4,
  na: 0,
  status: "PARTIALLY COMPLIANT",
  statusNote: "4 issues need attention",
  reportId: "LMPC-20260911-001",
  scanDate: "11-09-2026 10:24 AM",
  passedItems: [
    { name: "Product Name Declaration", rule: "Rule 6(1)(a)", status: "Passed" },
    { name: "Net Quantity & Unit of Measurement", rule: "Rule 6(1)(c)", status: "Passed" },
    { name: "Month & Year of Manufacture", rule: "Rule 6(1)(d)", status: "Passed" },
    { name: "Best Before / Expiry Indication", rule: "Rule 6(1)(d)", status: "Passed" },
    { name: "Name & Address of Manufacturer", rule: "Rule 6(1)(b)", status: "Passed" },
    { name: "Country of Origin (if imported)", rule: "Rule 6(10)", status: "Passed" },
    { name: "Standard Pack Size Compliance", rule: "Rule 5 & Second Schedule", status: "Passed" }
  ]
};

export const mockFlags = [
  {
    id: 1,
    title: "MRP Declaration Missing",
    rule: "Rule 6(1)(e)",
    severity: "High",
    badgeType: "high",
    description: "MRP inclusive of all taxes must be declared on the principal display panel & back package.",
    found: "MRP not mentioned on the rear declaration panel.",
    expected: "MRP inclusive of all taxes (e.g. ₹ 20.00 incl. of all taxes).",
    suggestedCorrection: "Add MRP on the label as per Rule 6(1)(e) in font height minimum 2.0 mm.",
    exampleText: "MRP ₹ 20.00\n(Inclusive of all taxes)",
    cropBox: { top: 38, left: 54, width: 22, height: 16 }
  },
  {
    id: 2,
    title: "Unit Sale Price Missing",
    rule: "Rule 6(1)(h)",
    severity: "High",
    badgeType: "high",
    description: "Unit sale price (per g / per kg / per ml) must be declared alongside MRP.",
    found: "Unit sale price not declared on the package.",
    expected: "Unit Sale Price: ₹ 0.29 / g prominently placed.",
    suggestedCorrection: "Mention unit sale price (per g / per kg) as per Rule 6(1)(h).",
    exampleText: "Unit Sale Price: ₹ 0.29 / g\n(Mandatory for packages > 50g)",
    cropBox: { top: 58, left: 54, width: 22, height: 12 }
  },
  {
    id: 3,
    title: "Consumer Care Details Missing",
    rule: "Rule 6(1)(j)",
    severity: "Medium",
    badgeType: "medium",
    description: "Consumer care contact details must be clearly provided on package.",
    found: "Consumer care helpline telephone number and email ID not fully legible.",
    expected: "Complete name, address, telephone no. and email of designated person.",
    suggestedCorrection: "Include toll-free number, email, website as per Rule 6(1)(j).",
    exampleText: "For Consumer Grievance:\nOfficer: Manager Consumer Care\nToll-Free: 1800-103-1947\nEmail: wecare@in.nestle.com",
    cropBox: { top: 68, left: 26, width: 24, height: 14 }
  },
  {
    id: 4,
    title: "Image Quality Low",
    rule: "Validation Check",
    severity: "Low",
    badgeType: "low",
    description: "Image is unclear or has glare. May cause misreading of label information.",
    found: "Slight glare near barcode lower right zone.",
    expected: "Sharp, high contrast label capture with no reflections.",
    suggestedCorrection: "Ensure clear and legible label with all details visible.",
    exampleText: "Lighting Tip:\nAvoid direct flash; hold camera at a 15° slant or use diffuse room light.",
    cropBox: { top: 52, left: 56, width: 20, height: 18 }
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: "MRP missing for Maggi Noodles",
    date: "11-09-2026 10:24 AM",
    type: "flag",
    severity: "high",
    read: false
  },
  {
    id: 2,
    title: "Unit sale price not found",
    date: "11-09-2026 10:24 AM",
    type: "flag",
    severity: "high",
    read: false
  },
  {
    id: 3,
    title: "Consumer care details missing",
    date: "11-09-2026 10:24 AM",
    type: "flag",
    severity: "medium",
    read: false
  },
  {
    id: 4,
    title: "Report generated successfully",
    date: "11-09-2026 10:21 AM",
    type: "system",
    severity: "info",
    read: true
  },
  {
    id: 5,
    title: "New rule update: Legal Metrology amendment",
    date: "10-09-2026 05:12 PM",
    type: "update",
    severity: "info",
    read: true
  }
];

export const legalMetrologyRules = [
  {
    rule: "Rule 6(1)(a)",
    title: "Name and description of the commodity",
    summary: "Every package shall bear the name and specific description of the commodity contained therein on the principal display panel."
  },
  {
    rule: "Rule 6(1)(b)",
    title: "Manufacturer / Packer / Importer Details",
    summary: "The name and complete address of the manufacturer, or where manufacturer is not packer, name and address of manufacturer and packer."
  },
  {
    rule: "Rule 6(1)(c)",
    title: "Net quantity declaration",
    summary: "The net quantity, in terms of standard unit of weight or measure (g, kg, ml, l), of commodity contained in package."
  },
  {
    rule: "Rule 6(1)(d)",
    title: "Month and year of manufacture or packaging",
    summary: "Month and year in which commodity is manufactured or pre-packed or imported shall be clearly indicated."
  },
  {
    rule: "Rule 6(1)(e)",
    title: "Maximum Retail Price (MRP)",
    summary: "The retail sale price of package inclusive of all taxes in format: 'Maximum Retail Price ₹... (inclusive of all taxes)' or 'MRP ₹... incl. of all taxes'."
  },
  {
    rule: "Rule 6(1)(h)",
    title: "Unit Sale Price (USP)",
    summary: "Unit sale price declared in rupees per gram, per kilogram, per millilitre, per litre or per number."
  },
  {
    rule: "Rule 6(1)(j)",
    title: "Consumer Grievance Redressal Mechanism",
    summary: "Name, address, telephone number, and e-mail address of person who can be contacted in case of consumer complaints."
  },
  {
    rule: "Rule 6(10)",
    title: "Country of Origin",
    summary: "For imported products, country of origin or manufacturer country must be prominently displayed."
  }
];

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Edit3, ShieldAlert, Save, RotateCcw, QrCode, Trash2, Sparkles } from 'lucide-react';
import { mockProductData } from '../data/mockData';

export default function ExtractedDetails({
  onNavigate,
  productData,
  onSaveProductData,
  initialEditMode = false
}) {
  const isDefaultEmpty = !productData || !productData.name;
  const [isEditing, setIsEditing] = useState(initialEditMode || isDefaultEmpty);

  const defaultValues = {
    name: productData?.name || '',
    variant: productData?.variant || '',
    netQuantity: productData?.netQuantity || '',
    mrp: productData?.mrp || '',
    unitSalePrice: productData?.unitSalePrice || '',
    mfgDate: productData?.mfgDate || '',
    bestBefore: productData?.bestBefore || '',
    manufacturer: productData?.manufacturer || '',
    countryOfOrigin: productData?.countryOfOrigin || 'India',
    frontImage: productData?.frontImage || '/package_box.jpg',
    barcode: productData?.barcode || '',
    scanFormat: productData?.scanFormat || '',
    rawText: productData?.rawText || ''
  };

  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    if (initialEditMode) {
      setIsEditing(true);
    } else if (productData) {
      setFormData({
        name: productData.name || '',
        variant: productData.variant || '',
        netQuantity: productData.netQuantity || '',
        mrp: productData.mrp || '',
        unitSalePrice: productData.unitSalePrice || '',
        mfgDate: productData.mfgDate || '',
        bestBefore: productData.bestBefore || '',
        manufacturer: productData.manufacturer || '',
        countryOfOrigin: productData.countryOfOrigin || 'India',
        frontImage: productData.frontImage || '/package_box.jpg',
        barcode: productData.barcode || '',
        scanFormat: productData.scanFormat || '',
        rawText: productData.rawText || ''
      });
      if (!initialEditMode && productData.name) {
        setIsEditing(false);
      }
    }
  }, [productData, initialEditMode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      variant: '',
      netQuantity: '',
      mrp: '',
      unitSalePrice: '',
      mfgDate: '',
      bestBefore: '',
      manufacturer: '',
      countryOfOrigin: 'India',
      frontImage: '/package_box.jpg',
      barcode: '',
      scanFormat: '',
      rawText: ''
    });
    setIsEditing(true);
  };

  const handleFillSample = () => {
    setFormData({
      ...mockProductData,
      name: 'Britannia Good Day Biscuits',
      variant: 'Cashew (100g)',
      netQuantity: '100 g',
      mrp: '? 30.00',
      unitSalePrice: '? 0.30 / g',
      mfgDate: '09-2026',
      bestBefore: '03-2027',
      manufacturer: 'Britannia Industries Ltd.',
      countryOfOrigin: 'India',
      frontImage: '/package_box.jpg'
    });
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (onSaveProductData) {
      onSaveProductData(formData);
    }
    setIsEditing(false);
    onNavigate('flag-detection');
  };

  const details = [
    { label: 'Product Name', value: formData.name || 'Not specified' },
    { label: 'Net Quantity', value: formData.netQuantity || 'Not specified' },
    { label: 'MRP (incl. of all taxes)', value: formData.mrp || 'Not declared' },
    { label: 'Unit Sale Price', value: formData.unitSalePrice || 'Not declared' },
    { label: 'Mfg. Date', value: formData.mfgDate || 'Not specified' },
    { label: 'Best Before', value: formData.bestBefore || 'Not specified' },
    { label: 'Manufacturer', value: formData.manufacturer || 'Not specified' },
    { label: 'Country of Origin', value: formData.countryOfOrigin || 'Not specified' },
  ];

  return (
    <div className="screen-container">
      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('dashboard')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">
          {isEditing ? 'Fill Declarations' : 'Extracted Details'}
        </h3>
        <button
          type="button"
          className="icon-circle-btn"
          onClick={() => setIsEditing(!isEditing)}
          title={isEditing ? 'Cancel Edit' : 'Edit Details'}
        >
          <Edit3 size={16} />
        </button>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Scanned QR / Barcode Banner (if came from QR scan) */}
        {formData.rawText && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <QrCode size={24} color="#16a34a" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ display: 'block', fontSize: '0.8rem', color: '#15803d' }}>
                Scanned {formData.scanFormat === 'qr_code' ? 'QR Code' : 'Barcode'}
              </strong>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#166534',
                  wordBreak: 'break-all',
                  display: 'block'
                }}
              >
                {formData.rawText}
              </span>
            </div>
          </div>
        )}

        {/* Product preview card */}
        <div className="extracted-product-header">
          <img
            src={formData.frontImage || '/package_box.jpg'}
            alt="Product"
            className="extracted-thumb"
            onError={(e) => {
              e.target.src = '/package_box.jpg';
            }}
          />
          <div className="extracted-header-text">
            <h4>{formData.name || 'New Packaged Product'}</h4>
            <span className="extracted-sub">
              {formData.rawText ? 'QR Code Scanned Item' : formData.variant || 'Manual Declaration Entry'}
            </span>
          </div>
        </div>

        {isEditing ? (
          /* Manual Edit Form */
          <form
            onSubmit={handleSave}
            className="manual-entry-form"
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Enter Declarations</h4>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="text-link-btn"
                  onClick={handleClearForm}
                  style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  <Trash2 size={12} /> Clear Form
                </button>
                <button
                  type="button"
                  className="text-link-btn"
                  onClick={handleFillSample}
                  style={{ fontSize: '0.8rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  <Sparkles size={12} /> Sample
                </button>
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Product Name</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Parle-G Biscuits"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Variant / Size</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. 250g Family Pack"
                value={formData.variant}
                onChange={(e) => handleChange('variant', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Net Quantity</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. 100 g"
                  value={formData.netQuantity}
                  onChange={(e) => handleChange('netQuantity', e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>MRP (?)</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. ? 20.00"
                  value={formData.mrp}
                  onChange={(e) => handleChange('mrp', e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Unit Sale Price</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. ? 0.20 / g"
                  value={formData.unitSalePrice}
                  onChange={(e) => handleChange('unitSalePrice', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Mfg Date</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. 09-2026"
                  value={formData.mfgDate}
                  onChange={(e) => handleChange('mfgDate', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Best Before</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. 09-2027"
                  value={formData.bestBefore}
                  onChange={(e) => handleChange('bestBefore', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Country of Origin</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. India"
                  value={formData.countryOfOrigin}
                  onChange={(e) => handleChange('countryOfOrigin', e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Manufacturer Name &amp; Address</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Parle Products Pvt Ltd, Mumbai"
                value={formData.manufacturer}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
              />
            </div>

            <div className="action-bottom-wrap" style={{ marginTop: 8 }}>
              <button type="submit" className="btn-primary full-width">
                <Save size={16} />
                <span>Save &amp; Check Compliance</span>
              </button>
            </div>
          </form>
        ) : (
          /* View Mode Table */
          <>
            <div className="extracted-section">
              <div className="section-subtitle-row">
                <h4>Extracted Information</h4>
                <button
                  type="button"
                  className="text-link-btn"
                  onClick={() => setIsEditing(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#3b82f6', fontSize: '0.8rem' }}
                >
                  <Edit3 size={13} /> Edit / Fill
                </button>
              </div>

              <div className="details-card-table">
                {details.map((item, index) => (
                  <div key={index} className="details-row">
                    <span className="details-label">{item.label}</span>
                    <span className="details-val">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="extracted-note">
              <ShieldAlert size={16} />
              <span>Ready for Legal Metrology compliance verification under Rule 6(1).</span>
            </div>

            <div className="action-bottom-wrap">
              <button
                type="button"
                className="btn-primary full-width"
                onClick={() => {
                  if (onSaveProductData) {
                    onSaveProductData(formData);
                  }
                  onNavigate('flag-detection');
                }}
              >
                Check Compliance Flags
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import './App.css';
import { saveUserData, loadUserData, evaluateCompliance } from './utils/userStorage';
import DeviceFrame from './components/DeviceFrame';
import LegalHandbookModal from './components/LegalHandbookModal';
import ExampleModal from './components/ExampleModal';

import Splash from './screens/Splash';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import ScanMethod from './screens/ScanMethod';
import ScanCamera from './screens/ScanCamera';
import CropPreview from './screens/CropPreview';
import ExtractedDetails from './screens/ExtractedDetails';
import FlagDetection from './screens/FlagDetection';
import RuleMapping from './screens/RuleMapping';
import CorrectiveSuggestions from './screens/CorrectiveSuggestions';
import ComplianceResult from './screens/ComplianceResult';
import FlaggedHistory from './screens/FlaggedHistory';
import SingleFlag from './screens/SingleFlag';
import ComplianceReport from './screens/ComplianceReport';
import ReportPreview from './screens/ReportPreview';
import Profile from './screens/Profile';
import Notifications from './screens/Notifications';

import { mockFlags, mockProductData, mockComplianceChecks } from './data/mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [scanMethod, setScanMethod] = useState('camera');
  const [currentUser, setCurrentUser] = useState(null);

  // Per-user scan state
  const [productData, setProductData] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [flags, setFlags] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [complianceChecks, setComplianceChecks] = useState(null);

  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [exampleModalData, setExampleModalData] = useState(null);

  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
  };

  const handleLogin = (email) => {
    const cleanEmail = (email || 'muhammad@email.com').trim().toLowerCase();
    setCurrentUser(cleanEmail);

    // Load per-user data from localStorage
    const saved = loadUserData(cleanEmail);

    if (saved && (saved.productData || saved.scanHistory?.length > 0)) {
      // User has previous saved scan data -> restore it!
      setProductData(saved.productData || null);
      setCapturedImage(saved.capturedImage || null);
      setFlags(saved.flags || []);
      setSelectedFlag(saved.flags?.[0] || null);
      setScanHistory(saved.scanHistory || []);
      setComplianceChecks(saved.complianceChecks || null);
    } else if (cleanEmail === 'muhammad@email.com') {
      // Demo account gets standard initial package
      setProductData(mockProductData);
      setCapturedImage('/maggi_back.jpg');
      setFlags(mockFlags);
      setSelectedFlag(mockFlags[0]);
      setScanHistory([
        {
          id: 'LMPC-20260910-044',
          product: 'Parle-G Biscuits (250g)',
          date: '10-09-2026 03:15 PM',
          status: 'Fully Compliant',
          checks: '11/11 Passed',
          isCompliant: true,
        },
        {
          id: 'LMPC-20260909-012',
          product: 'Tata Salt Vacuum Evaporated (1kg)',
          date: '09-09-2026 11:30 AM',
          status: 'Fully Compliant',
          checks: '11/11 Passed',
          isCompliant: true,
        }
      ]);
      setComplianceChecks(mockComplianceChecks);
    } else {
      // Any new / other email starts completely fresh ("ella na eruka kudadhu")
      setProductData(null);
      setCapturedImage(null);
      setFlags([]);
      setSelectedFlag(null);
      setScanHistory([]);
      setComplianceChecks(null);
    }

    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    // Reset state so next user gets clean slate
    setProductData(null);
    setCapturedImage(null);
    setFlags([]);
    setSelectedFlag(null);
    setScanHistory([]);
    setComplianceChecks(null);
    handleNavigate('login');
  };

  // Helper to persist current user data
  const persistUserData = (override = {}) => {
    if (!currentUser) return;
    const toSave = {
      productData: override.productData !== undefined ? override.productData : productData,
      capturedImage: override.capturedImage !== undefined ? override.capturedImage : capturedImage,
      flags: override.flags !== undefined ? override.flags : flags,
      scanHistory: override.scanHistory !== undefined ? override.scanHistory : scanHistory,
      complianceChecks: override.complianceChecks !== undefined ? override.complianceChecks : complianceChecks,
    };
    saveUserData(currentUser, toSave);
  };

  // When user saves or edits product data manually
  const handleSaveProductData = (newProductData, optionalImage) => {
    const img = optionalImage || capturedImage || '/package_box.jpg';
    setProductData(newProductData);
    setCapturedImage(img);

    const evaluation = evaluateCompliance(newProductData);
    setFlags(evaluation.flags);
    setSelectedFlag(evaluation.flags[0] || null);
    setComplianceChecks(evaluation);

    const scanEntry = {
      id: evaluation.reportId,
      product: `${newProductData.name || 'Product'} ${newProductData.variant ? `(${newProductData.variant})` : ''}`,
      date: evaluation.scanDate,
      status: evaluation.status,
      checks: `${evaluation.passed}/${evaluation.totalChecks} Passed`,
      isCompliant: evaluation.flags.length === 0,
    };

    const updatedHistory = [scanEntry, ...scanHistory.filter((s) => s.id !== scanEntry.id)];
    setScanHistory(updatedHistory);

    if (currentUser) {
      saveUserData(currentUser, {
        productData: newProductData,
        capturedImage: img,
        flags: evaluation.flags,
        scanHistory: updatedHistory,
        complianceChecks: evaluation,
      });
    }
  };

  // When image is captured from camera or uploaded
  const handleImageCaptured = (imageUrl, detectedData) => {
    setCapturedImage(imageUrl);

    if (detectedData) {
      handleSaveProductData(detectedData, imageUrl);
    } else {
      const baseProduct = productData || {
        name: 'Captured Packaging',
        variant: 'Camera Photo',
        netQuantity: '',
        mrp: '',
        unitSalePrice: '',
        mfgDate: '',
        bestBefore: '',
        manufacturer: '',
        countryOfOrigin: 'India',
        frontImage: imageUrl,
        backImage: imageUrl
      };
      handleSaveProductData(baseProduct, imageUrl);
    }
  };

  const handleQRDetected = (qrData, snapshot) => {
    setCapturedImage(snapshot || null);
    handleSaveProductData(qrData, snapshot || null);
  };

  const handleSelectFlag = (flag) => {
    setSelectedFlag(flag);
  };

  const handleShowExample = (item) => {
    setExampleModalData(item);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <Splash onNavigate={handleNavigate} />;

      case 'login':
        return (
          <Login
            onNavigate={handleNavigate}
            onLogin={handleLogin}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onSelectScanMethod={(method) => setScanMethod(method)}
            onOpenHandbook={() => setIsHandbookOpen(true)}
            currentUser={currentUser}
            recentProduct={productData}
            recentFlagsCount={flags.length}
          />
        );

      case 'scan-method':
        return (
          <ScanMethod
            onNavigate={handleNavigate}
            onSelectMethod={(method) => setScanMethod(method)}
            onCustomImageUpload={(url) => handleImageCaptured(url)}
          />
        );

      case 'scan-camera':
        return (
          <ScanCamera
            onNavigate={handleNavigate}
            capturedImage={capturedImage}
            onImageCaptured={handleImageCaptured}
            onQRDetected={handleQRDetected}
          />
        );

      case 'crop-preview':
        return (
          <CropPreview
            onNavigate={handleNavigate}
            imageSrc={capturedImage}
            onCroppedImageSave={(croppedUrl) => {
              setCapturedImage(croppedUrl);
              if (productData) {
                handleSaveProductData(
                  { ...productData, frontImage: croppedUrl, backImage: croppedUrl },
                  croppedUrl
                );
              }
            }}
            onQRDetected={handleQRDetected}
          />
        );

      case 'extracted-details':
        return (
          <ExtractedDetails
            onNavigate={handleNavigate}
            productData={productData}
            onSaveProductData={handleSaveProductData}
            initialEditMode={scanMethod === 'manual'}
          />
        );

      case 'flag-detection':
        return (
          <FlagDetection
            onNavigate={handleNavigate}
            onSelectFlag={handleSelectFlag}
            flags={flags}
          />
        );

      case 'rule-mapping':
        return (
          <RuleMapping
            onNavigate={handleNavigate}
            onSelectFlag={handleSelectFlag}
          />
        );

      case 'corrective-suggestions':
        return (
          <CorrectiveSuggestions
            onNavigate={handleNavigate}
            onShowExample={handleShowExample}
          />
        );

      case 'compliance-result':
        return (
          <ComplianceResult
            onNavigate={handleNavigate}
          />
        );

      case 'flagged-history':
        return (
          <FlaggedHistory
            onNavigate={handleNavigate}
            onSelectFlag={handleSelectFlag}
            flags={flags}
            historyScans={scanHistory}
            currentUser={currentUser}
          />
        );

      case 'single-flag':
        return (
          <SingleFlag
            onNavigate={handleNavigate}
            flag={selectedFlag || flags[0] || mockFlags[0]}
          />
        );

      case 'compliance-report':
        return (
          <ComplianceReport
            onNavigate={handleNavigate}
          />
        );

      case 'report-preview':
        return (
          <ReportPreview
            onNavigate={handleNavigate}
          />
        );

      case 'profile':
        return (
          <Profile
            onNavigate={handleNavigate}
            onOpenHandbook={() => setIsHandbookOpen(true)}
            onLogout={handleLogout}
            currentUser={currentUser}
            scanCount={scanHistory.length}
          />
        );

      case 'notifications':
        return (
          <Notifications
            onNavigate={handleNavigate}
          />
        );

      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
            currentUser={currentUser}
            recentProduct={productData}
            recentFlagsCount={flags.length}
          />
        );
    }
  };

  return (
    <DeviceFrame>
      {renderCurrentScreen()}

      {/* Global Modals */}
      <LegalHandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      <ExampleModal
        isOpen={Boolean(exampleModalData)}
        data={exampleModalData}
        onClose={() => setExampleModalData(null)}
      />
    </DeviceFrame>
  );
}

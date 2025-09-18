"use client";

import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import PatientRegistration from "./components/PatientRegistration";
import ReportUpload from "./components/ReportUpload";
import ReportsListing from "./components/ReportsListing";
import ReportsMain from "./components/ReportsMain";
import DepartmentDetail from "./components/DepartmentDetail";
import ReportDetailsPopup from "./components/ReportDetailsPopup";
import FirmViewing from "./components/FirmViewing";
import SearchFilter from "./components/SearchFilter";
// Import ALL department components including the new ones
import {
  CT,
  MRI,
  ECG,
  USG,
  Xray,
  TMT,
  Holter,
  Biopsy,
  Dialysis,
  Mammography,
  DentalXray,
  EEG,
  Doppler,
} from "./components/DepartmentComponent";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Patient, Report } from "./types";

// Use Report directly
type ExtendedReport = Report;

// FirmData interface
interface FirmData {
  id: string;
  department: string;
  imageUrl: string;
  uploadedAt: string;
  metadata?: string;
  reportId?: string;
}

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [showFirmViewing, setShowFirmViewing] = useState(false);
  
  // Add navigation context state
  const [navigationContext, setNavigationContext] = useState<string>("dashboard");

  // Initialize with empty arrays instead of mock data
  const [patients, setPatients] = useLocalStorage<Patient[]>(
    "hms-patients",
    []
  );
  const [reports, setReports] = useLocalStorage<Report[]>("hms-reports", []);

  // Firm data state
  const [firmData, setFirmData] = useLocalStorage<FirmData[]>(
    "hms-firm-data",
    []
  );

  const handleAddPatient = (patientData: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPatients((prev) => [...prev, newPatient]);
  };

  const handleAddReport = (report: Report) => {
    setReports((prev) => [...prev, report]);

    // Auto-create patient if doesn't exist
    if (!patients.some((pt) => pt.name === report.patient)) {
      handleAddPatient({
        name: report.patient,
        department: report.department,
        number: "—",
      });
    }
  };

const handleAddFirmData = (fd: {
  department: string;
  imageUrl: string;
  metadata?: string;
  reportId?: string;
}) => {
  const newFirm: FirmData = {
    id: Date.now().toString(),
    ...fd,
    uploadedAt: new Date().toISOString(),
  };
  console.log("Adding Firm Data to State:", newFirm); // Log new firm data
  setFirmData((prev) => {
    const newFirmData = [...prev, newFirm]; 
    console.log("Updated Firm Data State:", newFirmData); // Log updated firmData array
    return newFirmData;
  });
};

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setCurrentView("department-detail");
    if (currentView === "reports") {
      setNavigationContext("reports");
    } else {
      setNavigationContext("dashboard");
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const handleFirmView = (report: Report) => {
    setSelectedReport(report);
    setShowFirmViewing(true);
  };

  const handleBackToDepartments = () => {
    if (navigationContext === "reports") {
      setCurrentView("reports");
    } else {
      setCurrentView("dashboard");
    }
    setSelectedDepartment("");
    setNavigationContext("dashboard");
  };

  const handleBackFromFirmViewing = () => {
    setShowFirmViewing(false);
    setSelectedReport(null);
  };

  // Navigation handlers
  const handleNavigateToViewDetails = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedDepartment(report.department);
      setCurrentView("department-detail");
    }
  };

  const handleNavigateToFirmViewing = (firmId: string) => {
    setShowFirmViewing(true);
  };

  // Updated view change handler
  const handleViewChange = (view: string) => {
    const departmentIds = [
      "xray",
      "usg",
      "ecg",
      "ctscan",
      "mri",
      "tmt",
      "holter",
      "biopsy",
      "dialysis",
      "mammography",
      "dentalxray",
      "eye",
      "doppler",
    ];

    if (departmentIds.includes(view)) {
      const departmentNameMap: { [key: string]: string } = {
        xray: "xray",
        usg: "usg",
        ecg: "ecg",
        ctscan: "ctscan",
        mri: "mri",
        tmt: "tmt",
        holter: "holter",
        biopsy: "biopsy",
        dialysis: "dialysis",
        mammography: "mammography",
        dentalxray: "dentalxray",
        eye: "eeg",
        doppler: "doppler",
      };

      setSelectedDepartment(departmentNameMap[view] || view);
      setCurrentView("department-detail");
      setNavigationContext("dashboard");
    } else {
      setCurrentView(view);
      setNavigationContext("dashboard");
    }
  };

  const renderCurrentView = () => {
    if (showFirmViewing && selectedReport) {
      // NEW: Compute firmImages from firmData for this report
      const computedFirmImages = firmData
        .filter((f) => f.reportId === selectedReport.id)
        .map((f) => f.imageUrl)
        .filter((url) => url);  // Filter out any invalid/empty URLs
        console.log("Computed Firm Images for Report ID:", selectedReport.id, computedFirmImages);

      return (
        <FirmViewing 
          report={selectedReport} 
          firmImages={computedFirmImages}  // Pass computed images as prop
          onBack={handleBackFromFirmViewing} 
        />
      );
    }

    if (currentView === "department-detail" && selectedDepartment) {
      return (
        <DepartmentDetail
          department={selectedDepartment}
          onBack={handleBackToDepartments}
          onViewDetails={handleViewDetails}
          onFirmView={handleFirmView}
          reports={reports}
        />
      );
    }

    // Handle legacy department-specific reports view
    if (currentView.startsWith("reports-")) {
      const department = currentView.replace("reports-", "").toUpperCase();
      return (
        <ReportsListing
          patients={patients}
          reports={reports}
          initialDepartmentFilter={department}
        />
      );
    }

    switch (currentView) {
      case "dashboard":
      case "Radiology":
        return <Dashboard patients={patients} reports={reports} />;
      case "patients":
        return <PatientRegistration onAddPatient={handleAddPatient} />;
      case "upload":
        return (
          <ReportUpload
            patients={patients}
            reports={reports}
            onAddReport={handleAddReport}
            onAddFirmData={handleAddFirmData}
            onViewReportDetails={handleViewDetails}
          />
        );
      case "reports":
        return <ReportsMain onDepartmentSelect={handleDepartmentSelect} />;
      case "search":
        return <SearchFilter patients={patients} reports={reports} />;

      // Existing department views (keeping for backward compatibility)
      case "ct":
        return <CT patients={patients} reports={reports} />;
      case "mri":
        return <MRI patients={patients} reports={reports} />;
      case "ecg":
        return <ECG patients={patients} reports={reports} />;
      case "usg":
        return <USG patients={patients} reports={reports} />;
      case "x-ray":
        return <Xray patients={patients} reports={reports} />;
      case "tmt":
        return <TMT patients={patients} reports={reports} />;
      case "holter":
        return <Holter patients={patients} reports={reports} />;

      // NEW department views
      case "biopsy":
        return <Biopsy patients={patients} reports={reports} />;
      case "dialysis":
        return <Dialysis patients={patients} reports={reports} />;
      case "mammography":
        return <Mammography patients={patients} reports={reports} />;
      case "dental-x-ray":
      case "dental-xray":
        return <DentalXray patients={patients} reports={reports} />;
      case "eeg":
        return <EEG patients={patients} reports={reports} />;
      case "doppler":
        return <Doppler patients={patients} reports={reports} />;

      default:
        return <Dashboard patients={patients} reports={reports} />;
    }
  };

  return (
    <>
      <Layout currentView={currentView} onViewChange={handleViewChange}>
        {renderCurrentView()}
      </Layout>

      <ReportDetailsPopup
        report={selectedReport}
        isOpen={showReportDetails}
        onClose={() => {
          setShowReportDetails(false);
          setSelectedReport(null);
        }}
      />
    </>
  );
}

export default App;
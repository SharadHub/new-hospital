// "use client";

// import React, { useState } from "react";
// import Layout from "./components/Layout";
// import Dashboard from "./components/Dashboard";
// import PatientRegistration from "./components/PatientRegistration";
// import ReportUpload from "./components/ReportUpload";
// import ReportsListing from "./components/ReportsListing";
// import ReportsMain from "./components/ReportsMain";
// import DepartmentDetail from "./components/DepartmentDetail";
// import ReportDetailsPopup from "./components/ReportDetailsPopup";
// import FirmViewing from "./components/FirmViewing";
// import SearchFilter from "./components/SearchFilter";
// // Import ALL department components including the new ones
// import {
//   CT,
//   MRI,
//   ECG,
//   USG,
//   Xray,
//   TMT,
//   Holter,
//   Biopsy,
//   Dialysis,
//   Mammography,
//   DentalXray,
//   EEG,
//   Doppler,
// } from "./components/DepartmentComponent";
// import { useLocalStorage } from "./hooks/useLocalStorage";
// import type { Patient, Report } from "./types";

// // Updated interface to match ReportDetailsPopup expectations
// interface ExtendedReport {
//   id: string;
//   serialNumber: number;
//   patient: string;
//   department: string;
//   reportType: string;
//   date: string;
//   doctor: string;
//   uploadedAt: string;
//   extractedText?: string; // Optional for uploaded document text
//   imageUrl?: string; // Optional for uploaded document image
// }

// // Add FirmData interface for future use
// interface FirmData {
//   id: string;
//   department: string;
//   imageUrl: string;
//   uploadedAt: string;
//   metadata: string;
// }

// function App() {
//   const [currentView, setCurrentView] = useState("dashboard");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [selectedReport, setSelectedReport] = useState<ExtendedReport | null>(
//     null
//   );
//   const [showReportDetails, setShowReportDetails] = useState(false);
//   const [showFirmViewing, setShowFirmViewing] = useState(false);

//   // Initialize with empty arrays instead of mock data
//   const [patients, setPatients] = useLocalStorage<Patient[]>(
//     "hms-patients",
//     []
//   );
//   const [reports, setReports] = useLocalStorage<Report[]>("hms-reports", []);

//   // Add firm data state for future use
//   const [firmData, setFirmData] = useLocalStorage<FirmData[]>(
//     "hms-firm-data",
//     []
//   );

//   const handleAddPatient = (patientData: Omit<Patient, "id" | "createdAt">) => {
//     const newPatient: Patient = {
//       ...patientData,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//     };
//     setPatients((prev) => [...prev, newPatient]);
//   };

//   const handleAddReport = (reportData: Omit<Report, "id" | "uploadedAt">) => {
//     const newReport: Report = {
//       ...reportData,
//       id: Date.now().toString(),
//       uploadedAt: new Date().toISOString(),
//     };
//     setReports((prev) => [...prev, newReport]);
//   };

//   // Add firm data handler for future use
//   const handleAddFirmData = (
//     firmDataInput: Omit<FirmData, "id" | "uploadedAt">
//   ) => {
//     const newFirmData: FirmData = {
//       ...firmDataInput,
//       id: Date.now().toString(),
//       uploadedAt: new Date().toISOString(),
//     };
//     setFirmData((prev) => [...prev, newFirmData]);
//   };

//   const handleDepartmentSelect = (department: string) => {
//     setSelectedDepartment(department);
//     setCurrentView("department-detail");
//   };

//   const handleViewDetails = (report: ExtendedReport) => {
//     setSelectedReport(report);
//     setShowReportDetails(true);
//   };

//   const handleFirmView = (report: ExtendedReport) => {
//     setSelectedReport(report);
//     setShowFirmViewing(true);
//   };

//   const handleBackToDepartments = () => {
//     setCurrentView("reports");
//     setSelectedDepartment("");
//   };

//   const handleBackFromFirmViewing = () => {
//     setShowFirmViewing(false);
//     setSelectedReport(null);
//   };

//   // Navigation handlers for future upload system
//   const handleNavigateToViewDetails = (reportId: string) => {
//     const report = reports.find((r) => r.id === reportId);
//     if (report) {
//       setSelectedDepartment(report.department.toLowerCase());
//       setCurrentView("department-detail");
//     }
//   };

//   const handleNavigateToFirmViewing = (firmId: string) => {
//     setShowFirmViewing(true);
//   };

//   const renderCurrentView = () => {
//     if (showFirmViewing && selectedReport) {
//       return (
//         <FirmViewing
//           report={selectedReport}
//           onBack={handleBackFromFirmViewing}
//         />
//       );
//     }

//     if (currentView === "department-detail" && selectedDepartment) {
//       return (
//         <DepartmentDetail
//           department={selectedDepartment}
//           onBack={handleBackToDepartments}
//           onViewDetails={handleViewDetails}
//           onFirmView={handleFirmView}
//         />
//       );
//     }

//     // Handle legacy department-specific reports view
//     if (currentView.startsWith("reports-")) {
//       const department = currentView.replace("reports-", "").toUpperCase();
//       return (
//         <ReportsListing
//           patients={patients}
//           reports={reports}
//           initialDepartmentFilter={department}
//         />
//       );
//     }

//     switch (currentView) {
//       case "dashboard":
//       case "Radiology":
//         return <Dashboard patients={patients} reports={reports} />;
//       case "patients":
//         return <PatientRegistration onAddPatient={handleAddPatient} />;
//       case "upload":
//         return (
//           <ReportUpload patients={patients} onAddReport={handleAddReport} />
//         );
//       case "reports":
//         return <ReportsMain onDepartmentSelect={handleDepartmentSelect} />;
//       case "search":
//         return <SearchFilter patients={patients} reports={reports} />;

//       // Existing department views
//       case "ct":
//         return <CT patients={patients} reports={reports} />;
//       case "mri":
//         return <MRI patients={patients} reports={reports} />;
//       case "ecg":
//         return <ECG patients={patients} reports={reports} />;
//       case "usg":
//         return <USG patients={patients} reports={reports} />;
//       case "x-ray":
//         return <Xray patients={patients} reports={reports} />;
//       case "tmt":
//         return <TMT patients={patients} reports={reports} />;
//       case "holter":
//         return <Holter patients={patients} reports={reports} />;

//       // NEW department views
//       case "biopsy":
//         return <Biopsy patients={patients} reports={reports} />;
//       case "dialysis":
//         return <Dialysis patients={patients} reports={reports} />;
//       case "mammography":
//         return <Mammography patients={patients} reports={reports} />;
//       case "dental-x-ray":
//       case "dental-xray":
//         return <DentalXray patients={patients} reports={reports} />;
//       case "eeg":
//         return <EEG patients={patients} reports={reports} />;
//       case "doppler":
//         return <Doppler patients={patients} reports={reports} />;

//       default:
//         return <Dashboard patients={patients} reports={reports} />;
//     }
//   };

//   return (
//     <>
//       <Layout currentView={currentView} onViewChange={setCurrentView}>
//         {renderCurrentView()}
//       </Layout>

//       <ReportDetailsPopup
//         report={selectedReport}
//         isOpen={showReportDetails}
//         onClose={() => {
//           setShowReportDetails(false);
//           setSelectedReport(null);
//         }}
//       />
//     </>
//   );
// }

// export default App;
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

// Updated interface to match ReportDetailsPopup expectations
interface ExtendedReport {
  id: string;
  serialNumber: number;
  patient: string;
  department: string;
  reportType: string;
  date: string;
  doctor: string;
  uploadedAt: string;
  extractedText?: string; // Optional for uploaded document text
  imageUrl?: string; // Optional for uploaded document image
}

// Add FirmData interface for future use
interface FirmData {
  id: string;
  department: string;
  imageUrl: string;
  uploadedAt: string;
  metadata: string;
}

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<ExtendedReport | null>(
    null
  );
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [showFirmViewing, setShowFirmViewing] = useState(false);

  // Initialize with empty arrays instead of mock data
  const [patients, setPatients] = useLocalStorage<Patient[]>(
    "hms-patients",
    []
  );
  const [reports, setReports] = useLocalStorage<Report[]>("hms-reports", []);

  // Add firm data state for future use
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

  const handleAddReport = (reportData: Omit<Report, "id" | "uploadedAt">) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
    };
    setReports((prev) => [...prev, newReport]);
  };

  // Add firm data handler for future use
  const handleAddFirmData = (
    firmDataInput: Omit<FirmData, "id" | "uploadedAt">
  ) => {
    const newFirmData: FirmData = {
      ...firmDataInput,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
    };
    setFirmData((prev) => [...prev, newFirmData]);
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setCurrentView("department-detail");
  };

  const handleViewDetails = (report: ExtendedReport) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const handleFirmView = (report: ExtendedReport) => {
    setSelectedReport(report);
    setShowFirmViewing(true);
  };

  const handleBackToDepartments = () => {
    setCurrentView("reports");
    setSelectedDepartment("");
  };

  const handleBackFromFirmViewing = () => {
    setShowFirmViewing(false);
    setSelectedReport(null);
  };

  // Navigation handlers for future upload system
  const handleNavigateToViewDetails = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedDepartment(report.department.toLowerCase());
      setCurrentView("department-detail");
    }
  };

  const handleNavigateToFirmViewing = (firmId: string) => {
    setShowFirmViewing(true);
  };

  // FIXED: Updated view change handler to route departments to DepartmentDetail
  const handleViewChange = (view: string) => {
    // Check if the view is a department ID (from sidebar dropdown)
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
      // Convert department ID to proper department name
      const departmentNameMap: { [key: string]: string } = {
        xray: "X-Ray",
        usg: "USG",
        ecg: "ECG",
        ctscan: "CT Scan",
        mri: "MRI",
        tmt: "TMT",
        holter: "Holter",
        biopsy: "Biopsy",
        dialysis: "Dialysis",
        mammography: "Mammography",
        dentalxray: "Dental X-Ray",
        eye: "EEG", // Assuming "eye" maps to EEG based on your departments
        doppler: "Doppler",
      };

      // Set the selected department and route to DepartmentDetail (NOT ReportsListing)
      setSelectedDepartment(departmentNameMap[view] || view);
      setCurrentView("department-detail");
    } else {
      setCurrentView(view);
    }
  };

  const renderCurrentView = () => {
    if (showFirmViewing && selectedReport) {
      return (
        <FirmViewing
          report={selectedReport}
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
          <ReportUpload patients={patients} onAddReport={handleAddReport} />
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

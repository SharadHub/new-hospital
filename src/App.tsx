import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import PatientRegistration from "./components/PatientRegistration";
import ReportUpload from "./components/ReportUpload";
import ReportsListing from "./components/ReportsListing";
import SearchFilter from "./components/SearchFilter";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Patient, Report } from "./types";
import { mockPatients, mockReports } from "./utils/mockData";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [patients, setPatients] = useLocalStorage<Patient[]>(
    "hms-patients",
    mockPatients
  );
  const [reports, setReports] = useLocalStorage<Report[]>(
    "hms-reports",
    mockReports
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

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard patients={patients} reports={reports} />;
      case "patients":
        return <PatientRegistration onAddPatient={handleAddPatient} />;
      case "upload":
        return (
          <ReportUpload patients={patients} onAddReport={handleAddReport} />
        );
      case "reports":
        return <ReportsListing patients={patients} reports={reports} />;
      case "search":
        return <SearchFilter patients={patients} reports={reports} />;
      default:
        return <Dashboard patients={patients} reports={reports} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;

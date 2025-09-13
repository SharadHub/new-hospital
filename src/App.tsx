"use client"

import React, { useState } from "react"
import Layout from "./components/Layout"
import Dashboard from "./components/Dashboard"
import PatientRegistration from "./components/PatientRegistration"
import ReportUpload from "./components/ReportUpload"
import ReportsListing from "./components/ReportsListing"
import ReportsMain from "./components/ReportsMain"
import DepartmentDetail from "./components/DepartmentDetail"
import ReportDetailsPopup from "./components/ReportDetailsPopup"
import FirmViewing from "./components/FirmViewing"
import SearchFilter from "./components/SearchFilter"
// Import the department components from App1
import {
  CT,
  MRI,
  ECG,
  USG,
  Xray,
  TMT,
  Holter,
} from "./components/DepartmentComponent"
import { useLocalStorage } from "./hooks/useLocalStorage"
import type { Patient, Report } from "./types"
import { mockPatients, mockReports } from "./utils/mockData"

interface ExtendedReport {
  id: string
  serialNumber: number
  patient: string
  department: string
  reportType: string
  date: string
  doctor: string
  uploadedAt: string
}

function App() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedReport, setSelectedReport] = useState<ExtendedReport | null>(null)
  const [showReportDetails, setShowReportDetails] = useState(false)
  const [showFirmViewing, setShowFirmViewing] = useState(false)
  const [patients, setPatients] = useLocalStorage<Patient[]>("hms-patients", mockPatients)
  const [reports, setReports] = useLocalStorage<Report[]>("hms-reports", mockReports)

  const handleAddPatient = (patientData: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setPatients((prev) => [...prev, newPatient])
  }

  const handleAddReport = (reportData: Omit<Report, "id" | "uploadedAt">) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
    }
    setReports((prev) => [...prev, newReport])
  }

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department)
    setCurrentView("department-detail")
  }

  const handleViewDetails = (report: ExtendedReport) => {
    setSelectedReport(report)
    setShowReportDetails(true)
  }

  const handleFirmView = (report: ExtendedReport) => {
    setSelectedReport(report)
    setShowFirmViewing(true)
  }

  const handleBackToDepartments = () => {
    setCurrentView("reports")
    setSelectedDepartment("")
  }

  const handleBackFromFirmViewing = () => {
    setShowFirmViewing(false)
    setSelectedReport(null)
  }

  const renderCurrentView = () => {
    if (showFirmViewing && selectedReport) {
      return <FirmViewing report={selectedReport} onBack={handleBackFromFirmViewing} />
    }

    if (currentView === "department-detail" && selectedDepartment) {
      return (
        <DepartmentDetail
          department={selectedDepartment}
          onBack={handleBackToDepartments}
          onViewDetails={handleViewDetails}
          onFirmView={handleFirmView}
        />
      )
    }

    // Handle legacy department-specific reports view from App2
    if (currentView.startsWith("reports-")) {
      const department = currentView.replace("reports-", "").toUpperCase()
      return <ReportsListing patients={patients} reports={reports} initialDepartmentFilter={department} />
    }

    switch (currentView) {
      case "dashboard":
      case "Radiology": // Handle Radiology click from App1
        return <Dashboard patients={patients} reports={reports} />
      case "patients":
        return <PatientRegistration onAddPatient={handleAddPatient} />
      case "upload":
        return <ReportUpload patients={patients} onAddReport={handleAddReport} />
      case "reports":
        return <ReportsMain onDepartmentSelect={handleDepartmentSelect} />
      case "search":
        return <SearchFilter patients={patients} reports={reports} />
      // Department-specific views from App1
      case "ct":
        return <CT patients={patients} reports={reports} />
      case "mri":
        return <MRI patients={patients} reports={reports} />
      case "ecg":
        return <ECG patients={patients} reports={reports} />
      case "usg":
        return <USG patients={patients} reports={reports} />
      case "x-ray":
        return <Xray patients={patients} reports={reports} />
      case "tmt":
        return <TMT patients={patients} reports={reports} />
      case "holter":
        return <Holter patients={patients} reports={reports} />
      default:
        return <Dashboard patients={patients} reports={reports} />
    }
  }

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderCurrentView()}
      </Layout>

      <ReportDetailsPopup
        report={selectedReport}
        isOpen={showReportDetails}
        onClose={() => {
          setShowReportDetails(false)
          setSelectedReport(null)
        }}
      />
    </>
  )
}

export default App
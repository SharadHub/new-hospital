"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Search, Eye, FileText } from "lucide-react"
import type { Patient, Report } from "../hospital-management/src/types"

interface DepartmentReportsProps {
  departmentName: string
  patients: Patient[]
  reports: Report[]
  onBack: () => void
  onViewDetails: (report: any) => void
  onFirmView: (report: any) => void
}

const DepartmentReports: React.FC<DepartmentReportsProps> = ({
  departmentName,
  patients,
  reports,
  onBack,
  onViewDetails,
  onFirmView,
}) => {
  const [searchPatient, setSearchPatient] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Filter reports for this department
  const departmentReports = reports.filter((report) => report.department.toLowerCase() === departmentName.toLowerCase())

  // Apply search filters
  const filteredReports = departmentReports.filter((report) => {
    const patient = patients.find((p) => p.id === report.patientId)
    const patientName = patient?.name.toLowerCase() || ""

    const matchesPatient = searchPatient === "" || patientName.includes(searchPatient.toLowerCase())

    let matchesDateRange = true
    if (fromDate || toDate) {
      const reportDate = new Date(report.uploadedAt)
      if (fromDate) {
        matchesDateRange = matchesDateRange && reportDate >= new Date(fromDate)
      }
      if (toDate) {
        matchesDateRange = matchesDateRange && reportDate <= new Date(toDate)
      }
    }

    return matchesPatient && matchesDateRange
  })

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? patient.name : "Unknown Patient"
  }

  const handleSearch = () => {
    // Search is handled automatically through filteredReports
  }

  // Generate sample data if no reports exist
  const sampleReports =
    filteredReports.length > 0
      ? filteredReports
      : [
          {
            id: "1",
            patientId: "sample1",
            department: departmentName,
            reportType: `${departmentName} Report`,
            uploadedAt: "2024-01-15T00:00:00Z",
            uploadedBy: "Dr. Smith",
            reportText: `Sample ${departmentName} report`,
          },
          {
            id: "2",
            patientId: "sample2",
            department: departmentName,
            reportType: `${departmentName} Report`,
            uploadedAt: "2024-01-14T00:00:00Z",
            uploadedBy: "Dr. Johnson",
            reportText: `Sample ${departmentName} report`,
          },
          {
            id: "3",
            patientId: "sample3",
            department: departmentName,
            reportType: `${departmentName} Report`,
            uploadedAt: "2024-01-13T00:00:00Z",
            uploadedBy: "Dr. Wilson",
            reportText: `Sample ${departmentName} report`,
          },
        ]

  const samplePatients = [
    { id: "sample1", name: "John Doe" },
    { id: "sample2", name: "Jane Smith" },
    { id: "sample3", name: "Mike Wilson" },
  ]

  const getSamplePatientName = (patientId: string) => {
    if (filteredReports.length > 0) {
      return getPatientName(patientId)
    }
    const samplePatient = samplePatients.find((p) => p.id === patientId)
    return samplePatient ? samplePatient.name : "Unknown Patient"
  }

  return (
    <div className="department-reports">
      <style>{`
        .department-reports {
          min-height: 100vh;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%);
          padding: 1.5rem;
        }

        .reports-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .reports-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .back-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .reports-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .search-section {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .search-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .search-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          height: fit-content;
        }

        .search-button:hover {
          background: #2563eb;
        }

        .reports-table-container {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .reports-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-header th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .table-row {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .table-cell {
          padding: 1rem;
          color: #374151;
          font-size: 0.875rem;
        }

        .serial-number {
          font-weight: 600;
          color: #1f2937;
        }

        .patient-name {
          font-weight: 500;
          color: #1f2937;
        }

        .department-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .view-details-btn {
          color: #3b82f6;
          border-color: #3b82f6;
          background: white;
        }

        .view-details-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .firm-view-btn {
          color: #10b981;
          border-color: #10b981;
          background: white;
        }

        .firm-view-btn:hover {
          background: #10b981;
          color: white;
        }

        @media (min-width: 640px) {
          .search-form {
            grid-template-columns: 2fr 1fr 1fr auto;
          }
        }

        @media (min-width: 768px) {
          .search-form {
            grid-template-columns: 2fr 1fr 1fr auto;
          }
        }
      `}</style>

      <div className="reports-container">
        <div className="reports-header">
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            Back to Departments
          </button>
          <h1 className="reports-title">{departmentName.toUpperCase()} Reports</h1>
        </div>

        <div className="search-section">
          <div className="search-form">
            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter patient name"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-input"
                placeholder="mm/dd/yyyy"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-input"
                placeholder="mm/dd/yyyy"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <button onClick={handleSearch} className="search-button">
              <Search size={16} />
              Search
            </button>
          </div>
        </div>

        <div className="reports-table-container">
          <table className="reports-table">
            <thead className="table-header">
              <tr>
                <th>S.N</th>
                <th>Patient</th>
                <th>Department</th>
                <th>Report Type</th>
                <th>Date</th>
                <th>View Details</th>
                <th>Firm Viewing</th>
              </tr>
            </thead>
            <tbody>
              {sampleReports.map((report, index) => (
                <tr key={report.id} className="table-row">
                  <td className="table-cell">
                    <span className="serial-number">{index + 1}</span>
                  </td>
                  <td className="table-cell">
                    <span className="patient-name">{getSamplePatientName(report.patientId)}</span>
                  </td>
                  <td className="table-cell">
                    <span className="department-badge">{departmentName.toUpperCase()}</span>
                  </td>
                  <td className="table-cell">{report.reportType}</td>
                  <td className="table-cell">{new Date(report.uploadedAt).toLocaleDateString()}</td>
                  <td className="table-cell">
                    <button onClick={() => onViewDetails(report)} className="action-button view-details-btn">
                      <Eye size={14} />
                      View Details
                    </button>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => onFirmView(report)} className="action-button firm-view-btn">
                      <FileText size={14} />
                      Firm View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DepartmentReports
"use client"

import type React from "react"
import { X, Printer, User, FileText } from "lucide-react"

interface Report {
  id: string
  serialNumber: number
  patient: string
  department: string
  reportType: string
  date: string
  doctor: string
  uploadedAt: string
}

interface ReportDetailsPopupProps {
  report: Report | null
  isOpen: boolean
  onClose: () => void
}

const ReportDetailsPopup: React.FC<ReportDetailsPopupProps> = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null

  const handlePrint = () => {
    window.print()
  }

  // Mock detailed report data
  const reportDetails = {
    patientAge: "45 years",
    patientGender: "Male",
    patientId: "P-2024-001",
    referringDoctor: report.doctor,
    reportDate: report.date,
    studyDate: report.date,
    findings:
      "The examination shows normal anatomical structures with no significant abnormalities detected. All parameters are within normal limits.",
    impression: "Normal study. No acute findings.",
    recommendations: "Follow-up as clinically indicated.",
    technician: "Tech. Sarah Johnson",
    reportedBy: report.doctor,
    verifiedBy: "Dr. Michael Chen, MD",
  }

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <style>{`
            .popup-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              padding: 1rem;
            }

            .popup-content {
              background: white;
              border-radius: 12px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
              max-width: 800px;
              width: 100%;
              max-height: 90vh;
              overflow-y: auto;
              position: relative;
            }

            .popup-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1.5rem;
              border-bottom: 2px solid #e2e8f0;
              background: #f8fafc;
              border-radius: 12px 12px 0 0;
            }

            .popup-title {
              font-size: 1.5rem;
              font-weight: bold;
              color: #1e293b;
              margin: 0;
            }

            .popup-actions {
              display: flex;
              gap: 0.5rem;
            }

            .action-btn {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 600;
              transition: all 0.2s;
            }

            .print-btn {
              background: #10b981;
              color: white;
            }

            .print-btn:hover {
              background: #059669;
            }

            .close-btn {
              background: #ef4444;
              color: white;
            }

            .close-btn:hover {
              background: #dc2626;
            }

            .popup-body {
              padding: 2rem;
            }

            /* Hospital report header section */
            .report-header {
              text-align: center;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 2px solid #e2e8f0;
            }

            .hospital-name {
              font-size: 1.5rem;
              font-weight: bold;
              color: #1e293b;
              margin: 0 0 0.5rem 0;
            }

            .hospital-address {
              font-size: 0.875rem;
              color: #64748b;
              margin: 0 0 1rem 0;
            }

            .report-title {
              font-size: 1.25rem;
              font-weight: 600;
              color: #3b82f6;
              margin: 0;
            }

            /* Patient and study information grid */
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
              margin-bottom: 2rem;
            }

            .info-section {
              background: #f8fafc;
              padding: 1.5rem;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }

            .info-section h3 {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 1rem;
              font-weight: 600;
              color: #1e293b;
              margin: 0 0 1rem 0;
            }

            .info-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.75rem;
            }

            .info-item:last-child {
              margin-bottom: 0;
            }

            .info-label {
              font-weight: 600;
              color: #374151;
            }

            .info-value {
              color: #64748b;
            }

            /* Report content sections */
            .report-section {
              margin-bottom: 2rem;
            }

            .section-title {
              font-size: 1.125rem;
              font-weight: 600;
              color: #1e293b;
              margin: 0 0 1rem 0;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid #e2e8f0;
            }

            .section-content {
              background: #f8fafc;
              padding: 1.5rem;
              border-radius: 8px;
              line-height: 1.6;
              color: #374151;
            }

            .signature-section {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 2rem;
              margin-top: 3rem;
              padding-top: 2rem;
              border-top: 2px solid #e2e8f0;
            }

            .signature-box {
              text-align: center;
            }

            .signature-line {
              border-bottom: 1px solid #9ca3af;
              height: 3rem;
              margin-bottom: 0.5rem;
            }

            .signature-label {
              font-size: 0.875rem;
              font-weight: 600;
              color: #374151;
            }

            /* Print styles */
            @media print {
              .popup-overlay {
                position: static;
                background: none;
                padding: 0;
              }

              .popup-content {
                box-shadow: none;
                max-width: none;
                max-height: none;
                overflow: visible;
              }

              .popup-header {
                background: white;
                border-bottom: 2px solid #000;
              }

              .popup-actions {
                display: none;
              }

              .popup-body {
                padding: 1rem;
              }
            }

            /* Responsive design */
            @media (max-width: 768px) {
              .popup-content {
                margin: 0;
                border-radius: 0;
                max-height: 100vh;
              }

              .info-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
              }

              .signature-section {
                grid-template-columns: 1fr;
                gap: 1rem;
              }
            }
          `}</style>

          <div className="popup-header">
            <h2 className="popup-title">Report Details</h2>
            <div className="popup-actions">
              <button className="action-btn print-btn" onClick={handlePrint}>
                <Printer size={16} />
                Print
              </button>
              <button className="action-btn close-btn" onClick={onClose}>
                <X size={16} />
                Close
              </button>
            </div>
          </div>

          <div className="popup-body">
            <div className="report-header">
              <h1 className="hospital-name">Bhaktapur International Hospital</h1>
              <h2 className="report-title">{report.reportType}</h2>
            </div>

            <div className="info-grid">
              <div className="info-section">
                <h3>
                  <User size={18} />
                  Patient Information
                </h3>
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{report.patient}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Patient ID:</span>
                  <span className="info-value">{reportDetails.patientId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age:</span>
                  <span className="info-value">{reportDetails.patientAge}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{reportDetails.patientGender}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>
                  <FileText size={18} />
                  Study Information
                </h3>
                <div className="info-item">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{report.department}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Study Date:</span>
                  <span className="info-value">{new Date(reportDetails.studyDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Report Date:</span>
                  <span className="info-value">{new Date(reportDetails.reportDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Referring Doctor:</span>
                  <span className="info-value">{reportDetails.referringDoctor}</span>
                </div>
              </div>
            </div>

            <div className="signature-section">
              <div className="signature-box">
                <div className="signature-line"></div>
                <div className="signature-label">
                  Technician
                  <br />
                  {reportDetails.technician}
                </div>
              </div>
              <div className="signature-box">
                <div className="signature-line"></div>
                <div className="signature-label">
                  Reported By
                  <br />
                  {reportDetails.reportedBy}
                </div>
              </div>
              <div className="signature-box">
                <div className="signature-line"></div>
                <div className="signature-label">
                  Verified By
                  <br />
                  {reportDetails.verifiedBy}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportDetailsPopup
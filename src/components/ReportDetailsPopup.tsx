"use client";

import type React from "react";
import { X, Printer, User, FileText, Image, CheckCircle } from "lucide-react";

interface Report {
  id: string;
  serialNumber: number;
  patient: string;
  department: string;
  reportType: string;
  date: string;
  doctor: string;
  uploadedAt: string;
  extractedText?: string;
  imageUrl?: string;
}

interface ReportDetailsPopupProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReportDetailsPopup: React.FC<ReportDetailsPopupProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportDetails = {
    referringDoctor: report.doctor,
    reportDate: report.date,
    studyDate: report.date,
    findings:
      report.extractedText ||
      "The examination shows normal anatomical structures with no significant abnormalities detected.",
    impression: report.extractedText
      ? "Auto-scanned document content - please review extracted text above for detailed findings."
      : "Normal study. No acute findings.",
    recommendations: report.extractedText
      ? "Please correlate with clinical findings and consider follow-up."
      : "Follow-up as clinically indicated.",
    technician: "Tech. Sarah Johnson",
    reportedBy: report.doctor,
    verifiedBy: "Dr. Michael Chen, MD",
    hasUploadedDocument: !!report.extractedText,
    uploadedImageUrl: report.imageUrl,
  };

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
              max-width: 900px;
              width: 100%;
              max-height: 90vh;
              overflow-y: auto;
              position: relative;
              display: flex;
              flex-direction: column;
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

            .popup-body {
              padding: 2rem;
              flex: 1;
            }

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

            .report-title {
              font-size: 1.25rem;
              font-weight: 600;
              color: #3b82f6;
              margin: 0;
            }

            .document-placeholder {
              width: 100%;
              max-width: 400px;
              height: 200px;
              margin: 2rem auto;
              border: 2px dashed #3b82f6;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #3b82f6;
              font-weight: 600;
              font-size: 1rem;
            }

            .print-container {
              display: flex;
              justify-content: center;
              margin-bottom: 2rem;
            }

            .print-btn {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem 1.5rem;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            }

            .print-btn:hover {
              background: #2563eb;
            }

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

              .print-container {
                display: none;
              }
            }
          `}</style>

          <div className="popup-header">
            <h2 className="popup-title">Report Details</h2>
            <button className="action-btn close-btn" onClick={onClose}>
              <X size={16} />
              Close
            </button>
          </div>

          <div className="popup-body">
            <div className="report-header">
              <h1 className="hospital-name">
                Bhaktapur International Hospital
              </h1>
              <h2 className="report-title">{report.reportType}</h2>
            </div>

            {/* Uploaded Document Section */}
            {reportDetails.hasUploadedDocument && (
              <div className="document-section">
                <h4>Auto-Extracted Text:</h4>
                <div className="document-text">{reportDetails.findings}</div>
              </div>
            )}

            {/* Image Placeholder */}
            <div className="document-placeholder">
              Document/Image Placeholder
            </div>
          </div>

          {/* Print Button at Bottom Center */}
          <div className="print-container">
            <button className="print-btn" onClick={handlePrint}>
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportDetailsPopup;

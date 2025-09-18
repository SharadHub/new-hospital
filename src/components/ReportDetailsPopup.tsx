"use client";

import type React from "react";
import { X, Printer, User, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";

import type { Report } from "../types";  // Use shared Report type

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

            .close-btn {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.5rem 1rem;
              background: #ef4444;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
              transition: background 0.2s;
            }

            .close-btn:hover {
              background: #dc2626;
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

            .patient-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 1rem 0;
              padding: 1rem;
              background: #f8fafc;
              border-radius: 8px;
            }

            .info-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              color: #374151;
            }

            .document-section {
              margin: 2rem 0;
              text-align: center;
            }

            .document-image {
              max-width: 100%;
              max-height: 400px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              margin: 1rem 0;
            }

            .no-image-placeholder {
              width: 100%;
              max-width: 400px;
              height: 200px;
              margin: 2rem auto;
              border: 2px dashed #d1d5db;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #6b7280;
              font-weight: 500;
              font-size: 1rem;
            }

            .print-container {
              display: flex;
              justify-content: center;
              margin: 2rem;
              padding-top: 1rem;
              border-top: 1px solid #e2e8f0;
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
                position: static !important;
                background: none !important;
                padding: 0 !important;
              }

              .popup-content {
                box-shadow: none !important;
                max-width: none !important;
                max-height: none !important;
                overflow: visible !important;
              }

              .popup-header {
                background: white !important;
                border-bottom: 2px solid #000 !important;
                -webkit-print-color-adjust: exact;
              }

              .close-btn,
              .print-container {
                display: none !important;
              }

              .document-image {
                max-height: none !important;
                page-break-inside: avoid;
              }

              .patient-info {
                background: #f8fafc !important;
                -webkit-print-color-adjust: exact;
              }
            }

            @media (max-width: 768px) {
              .popup-content {
                margin: 0;
                max-height: 100vh;
                border-radius: 0;
              }

              .popup-header {
                padding: 1rem;
              }

              .popup-body {
                padding: 1rem;
              }

              .patient-info {
                flex-direction: column;
                gap: 0.5rem;
                align-items: flex-start;
              }
            }
          `}</style>

          <div className="popup-header">
            <h2 className="popup-title">Report Details - {report.reportType}</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={16} />
              Close
            </button>
          </div>

          <div className="popup-body">
            <div className="report-header">
              <h1 className="hospital-name">Bhaktapur International Hospital</h1>
              <p style={{ color: "#6b7280", margin: "0.5rem 0" }}>
                Department: {report.department} | Serial No: {report.serialNumber}
              </p>
            </div>

            {/* Patient and Report Info */}
            <div className="patient-info">
              <div className="info-item">
                <User size={16} />
                <span><strong>Patient:</strong> {report.patient}</span>
              </div>
              <div className="info-item">
                <FileText size={16} />
                <span><strong>Doctor:</strong> {report.doctor}</span>
              </div>
              <div className="info-item">
                <ImageIcon size={16} />
                <span><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Uploaded Document/Image Section */}
            <div className="document-section">
              <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#1e293b" }}>
                Uploaded Document/Image
              </h3>
              {report.imageUrl ? (
                <img
                  src={report.imageUrl}
                  alt={`Report image for ${report.patient} - ${report.reportType}`}
                  className="document-image"
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <div className="no-image-placeholder">
                  <ImageIcon size={48} style={{ color: "#d1d5db", marginBottom: "0.5rem" }} />
                  No image uploaded for this report
                </div>
              )}
              {report.imageUrl && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <CheckCircle size={20} style={{ color: "#10b981", display: "inline" }} />
                  <span style={{ marginLeft: "0.5rem", color: "#059669" }}>Image loaded successfully</span>
                </div>
              )}
            </div>
          </div>

          {/* Print Button at Bottom Center */}
          <div className="print-container">
            <button className="print-btn" onClick={handlePrint}>
              <Printer size={16} />
              Print Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportDetailsPopup;
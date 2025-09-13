import React, { useState } from "react";
import {
  FileText,
  User,
  Calendar,
  Eye,
  Printer,
  Download,
  Building2,
  Activity,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Patient, Report } from "../types";

interface DepartmentViewProps {
  patients: Patient[];
  reports: Report[];
  departmentName: string;
  departmentIcon?: React.ComponentType<any>;
  onUpdateReport?: (updatedReport: Report) => void; // Callback to handle report updates
}

const DepartmentView: React.FC<DepartmentViewProps> = ({
  patients,
  reports,
  departmentName,
  departmentIcon: DepartmentIcon = Activity,
  onUpdateReport,
}) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState<Partial<Report>>({});

  // Filter data for this specific department
  const departmentReports = reports.filter(
    (report) => report.department === departmentName
  );

  // Example firms data - in real app, this would come from props or API
  const firms = [
    `${departmentName} Firm A`,
    `${departmentName} Firm B`,
    `${departmentName} Firm C`,
  ];

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  const getPatientNumber = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.number : "N/A";
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    setEditForm({ ...report });
  };

  const handleSaveEdit = () => {
    if (editingReport && editForm) {
      const updatedReport = { ...editingReport, ...editForm };

      // Call the update callback if provided
      if (onUpdateReport) {
        onUpdateReport(updatedReport);
      }

      // Close edit mode
      setEditingReport(null);
      setEditForm({});

      // If this report was being viewed in modal, update it
      if (selectedReport && selectedReport.id === editingReport.id) {
        setSelectedReport(updatedReport);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
    setEditForm({});
  };

  const handleFormChange = (field: keyof Report, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrintReport = (report: Report) => {
    const patient = patients.find((p) => p.id === report.patientId);
    const printContent = `
      <html>
        <head>
          <title>${departmentName} Report - ${report.reportType}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .patient-info { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .report-content { margin: 30px 0; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bhaktapur International Hospital</h1>
            <h2>Radiology Department - ${departmentName}</h2>
          </div>
          <div class="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${patient?.name || "N/A"}</p>
            <p><strong>Patient Number:</strong> ${patient?.number || "N/A"}</p>
            <p><strong>Department:</strong> ${report.department}</p>
            <p><strong>Report Type:</strong> ${report.reportType}</p>
            <p><strong>Date:</strong> ${new Date(
              report.uploadedAt
            ).toLocaleDateString()}</p>
            <p><strong>Doctor:</strong> ${report.uploadedBy}</p>
          </div>
          <div class="report-content">
            <h3>Report Details</h3>
            <p>${report.reportText}</p>
          </div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Placeholder image URLs based on department
  const getPlaceholderImage = (dept: string) => {
    const images: { [key: string]: string } = {
      CT: "https://via.placeholder.com/150/3b82f6/ffffff?text=CT+Scan",
      MRI: "https://via.placeholder.com/150/10b981/ffffff?text=MRI+Scan",
      ECG: "https://via.placeholder.com/150/8b5cf6/ffffff?text=ECG+Graph",
      USG: "https://via.placeholder.com/150/f97316/ffffff?text=Ultrasound",
      "X-ray": "https://via.placeholder.com/150/ef4444/ffffff?text=X-Ray",
      TMT: "https://via.placeholder.com/150/06b6d4/ffffff?text=TMT+Report",
      Holter:
        "https://via.placeholder.com/150/84cc16/ffffff?text=Holter+Monitor",
    };
    return (
      images[dept] ||
      "https://via.placeholder.com/150/6b7280/ffffff?text=Medical+Image"
    );
  };

  return (
    <div className="background-container">
      <div className="department-view">
        <style>{`
          .background-container {
            background: linear-gradient(135deg, #3b82f6 0%, #93c5fd 25%, #ffffff 50%, #dbeafe 75%, #1e40af 100%);
            min-height: 100vh;
            padding: 1rem;
          }

          .department-view {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .content-section {
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
          }

          .section-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            background-color: #f9fafb;
          }

          .section-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .empty-state {
            padding: 3rem;
            text-align: center;
          }

          .empty-icon {
            width: 3rem;
            height: 3rem;
            color: #9ca3af;
            margin: 0 auto 1rem auto;
          }

          .empty-title {
            font-size: 1.125rem;
            font-weight: 500;
            color: #111827;
            margin: 0 0 0.5rem 0;
          }

          .empty-description {
            color: #6b7280;
            margin: 0;
          }

          .reports-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .report-card {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            transition: all 0.2s ease;
          }

          .report-card:hover {
            background-color: #f3f4f6;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .report-card.editing {
            background-color: #fef3c7;
            border-color: #f59e0b;
          }

          .report-field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .report-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
          }

          .report-value {
            font-size: 0.875rem;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .edit-input {
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            width: 100%;
            background-color: white;
          }

          .edit-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px #3b82f6;
          }

          .edit-textarea {
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            width: 100%;
            background-color: white;
            min-height: 80px;
            resize: vertical;
            font-family: inherit;
          }

          .edit-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px #3b82f6;
          }

          .edit-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          .edit-button {
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .edit-button.save {
            background-color: #059669;
            color: white;
          }

          .edit-button.save:hover {
            background-color: #047857;
          }

          .edit-button.cancel {
            background-color: #6b7280;
            color: white;
          }

          .edit-button.cancel:hover {
            background-color: #4b5563;
          }

          .department-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.125rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            background-color: #dbeafe;
            color: #1e40af;
          }

          .actions-cell {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          .action-button {
            padding: 0.25rem;
            border-radius: 0.25rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            background: none;
          }

          .action-button:hover {
            transform: scale(1.1);
          }

          .action-button.view {
            color: #2563eb;
          }

          .action-button.view:hover {
            color: #1d4ed8;
          }

          .action-button.edit {
            color: #f59e0b;
          }

          .action-button.edit:hover {
            color: #d97706;
          }

          .action-button.print {
            color: #059669;
          }

          .action-button.print:hover {
            color: #047857;
          }

          .action-button.download {
            color: #7c3aed;
          }

          .action-button.download:hover {
            color: #6d28d9;
          }

          .firms-table {
            width: 100%;
            border-collapse: collapse;
          }

          .table-head {
            background-color: #f9fafb;
          }

          .table-head th {
            padding: 0.75rem 1.5rem;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e5e7eb;
          }

          .table-body tr {
            border-bottom: 1px solid #e5e7eb;
            transition: background-color 0.2s;
          }

          .table-body tr:hover {
            background-color: #f9fafb;
          }

          .table-body td {
            padding: 1rem 1.5rem;
            white-space: nowrap;
            vertical-align: middle;
          }

          .firm-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .main-content {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .content-section {
            flex: 1;
            min-height: 200px;
          }

          .modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            z-index: 50;
          }

          .modal-content {
            background-color: white;
            border-radius: 0.75rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 56rem;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin: 0;
          }

          .modal-close {
            color: #9ca3af;
            font-size: 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            transition: color 0.2s;
          }

          .modal-close:hover {
            color: #6b7280;
          }

          .modal-body {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .patient-info-section {
            background-color: #f9fafb;
            border-radius: 0.5rem;
            padding: 1rem;
          }

          .info-section-title {
            font-weight: 500;
            color: #111827;
            margin: 0 0 0.75rem 0;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            font-size: 0.875rem;
          }

          .info-item {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .info-label {
            color: #6b7280;
          }

          .info-value {
            font-weight: 500;
            color: #111827;
          }

          .report-details-section h4 {
            font-weight: 500;
            color: #111827;
            margin: 0 0 0.75rem 0;
          }

          .report-content {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
          }

          .report-text {
            color: #374151;
            line-height: 1.6;
            white-space: pre-wrap;
            margin: 0;
          }

          .report-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.875rem;
            color: #6b7280;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .meta-info {
            color: #111827;
            font-weight: 500;
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            flex-wrap: wrap;
          }

          .modal-button {
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .modal-button.print {
            background-color: #059669;
            color: white;
          }

          .modal-button.print:hover {
            background-color: #047857;
          }

          .modal-button.close {
            background-color: #6b7280;
            color: white;
          }

          .modal-button.close:hover {
            background-color: #4b5563;
          }

          @media (min-width: 640px) {
            .background-container {
              padding: 1.5rem;
            }

            .info-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .main-content {
              flex-direction: row;
            }

            .report-field {
              flex-direction: row;
              justify-content: space-between;
            }

            .report-label {
              flex: 1;
            }

            .report-value {
              flex: 2;
            }
          }

          @media (min-width: 768px) {
            .department-view {
              gap: 2rem;
            }
          }
        `}</style>

        {/* Main Content with Reports and Firms */}
        <div className="main-content">
          {/* Reports Section */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">
                <FileText size={20} color="#059669" />
                {departmentName} Reports Listing
              </h3>
            </div>

            {departmentReports.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} className="empty-icon" />
                <h3 className="empty-title">
                  No {departmentName} reports found
                </h3>
                <p className="empty-description">
                  No reports have been uploaded for {departmentName} department
                  yet
                </p>
              </div>
            ) : (
              <div className="reports-list">
                {departmentReports.map((report) => (
                  <div
                    key={report.id}
                    className={`report-card ${
                      editingReport?.id === report.id ? "editing" : ""
                    }`}
                  >
                    {editingReport?.id === report.id ? (
                      // Edit Mode
                      <>
                        <div className="report-field">
                          <span className="report-label">Report Type</span>
                          <input
                            type="text"
                            value={editForm.reportType || ""}
                            onChange={(e) =>
                              handleFormChange("reportType", e.target.value)
                            }
                            className="edit-input"
                            placeholder="Enter report type"
                          />
                        </div>
                        <div className="report-field">
                          <span className="report-label">Doctor</span>
                          <input
                            type="text"
                            value={editForm.uploadedBy || ""}
                            onChange={(e) =>
                              handleFormChange("uploadedBy", e.target.value)
                            }
                            className="edit-input"
                            placeholder="Enter doctor name"
                          />
                        </div>
                        <div className="report-field">
                          <span className="report-label">Report Content</span>
                          <textarea
                            value={editForm.reportText || ""}
                            onChange={(e) =>
                              handleFormChange("reportText", e.target.value)
                            }
                            className="edit-textarea"
                            placeholder="Enter report details"
                          />
                        </div>
                        <div className="edit-actions">
                          <button
                            onClick={handleSaveEdit}
                            className="edit-button save"
                          >
                            <Save size={16} />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="edit-button cancel"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <div className="report-field">
                          <span className="report-label">Patient</span>
                          <div className="report-value">
                            <User size={16} color="#9ca3af" />
                            {getPatientName(report.patientId)} (
                            {getPatientNumber(report.patientId)})
                          </div>
                        </div>
                        <div className="report-field">
                          <span className="report-label">Department</span>
                          <span className="report-value department-badge">
                            {report.department}
                          </span>
                        </div>
                        <div className="report-field">
                          <span className="report-label">Report Type</span>
                          <span className="report-value">
                            {report.reportType}
                          </span>
                        </div>
                        <div className="report-field">
                          <span className="report-label">Date</span>
                          <div className="report-value">
                            <Calendar size={16} />
                            {new Date(report.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="report-field">
                          <span className="report-label">Doctor</span>
                          <span className="report-value">
                            {report.uploadedBy}
                          </span>
                        </div>
                        <div className="actions-cell">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="action-button view"
                            title="View Report"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditReport(report)}
                            className="action-button edit"
                            title="Edit Report"
                            style={{ color: "#f59e0b" }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handlePrintReport(report)}
                            className="action-button print"
                            title="Print Report"
                          >
                            <Printer size={16} />
                          </button>
                          {report.reportUrl && (
                            <button
                              className="action-button download"
                              title="Download File"
                            >
                              <Download size={16} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Partner Firms Section */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">
                <Building2 size={20} color="#8b5cf6" />
                {departmentName} Firm Listing
              </h3>
            </div>
            <div className="table-wrapper">
              <table className="firms-table">
                <thead className="table-head">
                  <tr>
                    <th>Patient</th>
                    <th>Department</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {firms.map((firm, index) => (
                    <tr key={index}>
                      <td>{firm}</td>
                      <td>
                        <span className="department-badge">
                          {departmentName}
                        </span>
                      </td>
                      <td>
                        <img
                          src={getPlaceholderImage(departmentName)}
                          alt={`${departmentName} Sample`}
                          className="firm-image"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{departmentName} Report Details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                {/* Patient Info */}
                <div className="patient-info-section">
                  <h4 className="info-section-title">Patient Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">
                        {getPatientName(selectedReport.patientId)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Number:</span>
                      <span className="info-value">
                        {getPatientNumber(selectedReport.patientId)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Department:</span>
                      <span className="info-value">
                        {selectedReport.department}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Report Type:</span>
                      <span className="info-value">
                        {selectedReport.reportType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div className="report-details-section">
                  <h4>Report Details</h4>
                  <div className="report-content">
                    <p className="report-text">{selectedReport.reportText}</p>
                  </div>
                </div>

                {/* Report Meta */}
                <div className="report-meta">
                  <div>
                    Uploaded by:{" "}
                    <span className="meta-info">
                      {selectedReport.uploadedBy}
                    </span>
                  </div>
                  <div>
                    Date:{" "}
                    <span className="meta-info">
                      {new Date(selectedReport.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-actions">
                  <button
                    onClick={() => handlePrintReport(selectedReport)}
                    className="modal-button print"
                  >
                    <Printer size={16} />
                    Print Report
                  </button>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="modal-button close"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentView;

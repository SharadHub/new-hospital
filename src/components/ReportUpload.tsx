import React, { useState } from "react";
import {
  Upload,
  FileText,
  User,
  Building2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Patient, Report, Department } from "../types";

interface ReportUploadProps {
  patients: Patient[];
  onAddReport: (report: Omit<Report, "id" | "uploadedAt">) => void;
}

const ReportUpload: React.FC<ReportUploadProps> = ({
  patients,
  onAddReport,
}) => {
  const [formData, setFormData] = useState({
    patientId: "",
    department: "" as Department | "",
    reportType: "",
    reportText: "",
    uploadedBy: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const departments: Department[] = [
    "CT",
    "MRI",
    "ECG",
    "USG",
    "X-ray",
    "TMT",
    "Holter",
  ];

  const reportTypes = {
    CT: [
      "CT Scan - Chest",
      "CT Scan - Abdomen",
      "CT Scan - Head",
      "CT Scan - Pelvis",
    ],
    MRI: ["MRI - Brain", "MRI - Spine", "MRI - Knee", "MRI - Shoulder"],
    ECG: ["ECG - 12 Lead", "ECG - Stress Test", "ECG - Holter"],
    USG: [
      "Ultrasound - Abdomen",
      "Ultrasound - Pelvis",
      "Ultrasound - Cardiac",
    ],
    "X-ray": ["X-ray - Chest", "X-ray - Spine", "X-ray - Extremities"],
    TMT: ["Treadmill Test - Standard", "Treadmill Test - Modified"],
    Holter: ["24-hour Holter", "48-hour Holter"],
  };

  const filteredPatients = formData.department
    ? patients.filter((p) => p.department === formData.department)
    : patients;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = "Please select a patient";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    if (!formData.reportType) {
      newErrors.reportType = "Please select a report type";
    }

    if (!formData.reportText.trim()) {
      newErrors.reportText = "Report text is required";
    }

    if (!formData.uploadedBy.trim()) {
      newErrors.uploadedBy = "Doctor name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate file upload and API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onAddReport({
        patientId: formData.patientId,
        department: formData.department as Department,
        reportType: formData.reportType,
        reportText: formData.reportText.trim(),
        uploadedBy: formData.uploadedBy.trim(),
        reportUrl: file ? `uploads/${file.name}` : undefined,
      });

      // Reset form
      setFormData({
        patientId: "",
        department: "",
        reportType: "",
        reportText: "",
        uploadedBy: "",
      });
      setFile(null);
      setErrors({});

      alert("Report uploaded successfully!");
    } catch (error) {
      console.error("Error uploading report:", error);
      alert("Error uploading report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset dependent fields
    if (field === "department") {
      setFormData((prev) => ({ ...prev, patientId: "", reportType: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Please select a PDF or image file");
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  return (
    <div className="background-container">
      <div className="report-upload">
        <style>{`
          .background-container {
            background: linear-gradient(135deg, #3b82f6 0%, #93c5fd 25%, #ffffff 50%, #dbeafe 75%, #1e40af 100%);
            min-height: 100vh;
            padding: 1rem;
          }

          .report-upload {
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
          }

          .form-container {
            background-color: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            padding: 1.5rem;
          }

          .form-header {
            margin-bottom: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #111827;
            margin: 0 0 0.5rem 0;
          }

          .form-subtitle {
            color: #6b7280;
            margin: 0;
            font-size: 0.875rem;
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s;
            box-sizing: border-box;
            background-color: white;
          }

          .form-input:focus {
            outline: none;
            ring: 2px solid #3b82f6;
            border-color: transparent;
          }

          .form-input:disabled {
            background-color: #f3f4f6;
            cursor: not-allowed;
          }

          .form-input.error {
            border-color: #fca5a5;
            background-color: #fef2f2;
          }

          .form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s;
            background-color: white;
            box-sizing: border-box;
          }

          .form-select:focus {
            outline: none;
            ring: 2px solid #3b82f6;
            border-color: transparent;
          }

          .form-select:disabled {
            background-color: #f3f4f6;
            cursor: not-allowed;
          }

          .form-select.error {
            border-color: #fca5a5;
            background-color: #fef2f2;
          }

          .form-textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s;
            resize: none;
            font-family: inherit;
            box-sizing: border-box;
            background-color: white;
          }

          .form-textarea:focus {
            outline: none;
            ring: 2px solid #3b82f6;
            border-color: transparent;
          }

          .form-textarea.error {
            border-color: #fca5a5;
            background-color: #fef2f2;
          }

          .error-message {
            margin-top: 0.25rem;
            font-size: 0.875rem;
            color: #dc2626;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .file-upload-area {
            border: 2px dashed #d1d5db;
            border-radius: 0.5rem;
            padding: 1.5rem;
            text-align: center;
            transition: border-color 0.2s;
            cursor: pointer;
          }

          .file-upload-area:hover {
            border-color: #9ca3af;
          }

          .file-upload-input {
            display: none;
          }

          .file-upload-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .file-selected {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: #059669;
          }

          .file-selected-info {
            text-align: center;
          }

          .file-selected-name {
            font-weight: 500;
            margin: 0;
          }

          .file-selected-size {
            font-size: 0.875rem;
            color: #6b7280;
            margin: 0;
          }

          .file-upload-text {
            color: #6b7280;
            margin: 0;
          }

          .file-upload-subtext {
            font-size: 0.875rem;
            color: #6b7280;
            margin: 0.25rem 0 0 0;
          }

          .submit-section {
            padding-top: 1rem;
          }

          .submit-button {
            width: 100%;
            background-color: #2563eb;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 1rem;
          }

          .submit-button:hover:not(:disabled) {
            background-color: #1d4ed8;
          }

          .submit-button:focus {
            outline: none;
            ring: 2px solid #3b82f6;
            ring-offset: 2px;
          }

          .submit-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .loading-spinner {
            width: 1.25rem;
            height: 1.25rem;
            border: 2px solid white;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (min-width: 640px) {
            .background-container {
              padding: 1.5rem;
            }

            .report-upload {
              padding: 0 1rem;
            }

            .form-container {
              padding: 2rem;
            }

            .form-header {
              margin-bottom: 2rem;
            }

            .form-title {
              font-size: 1.875rem;
            }

            .form-subtitle {
              font-size: 1rem;
            }
          }

          @media (min-width: 768px) {
            .form-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .report-upload {
              max-width: 56rem;
            }

            .form-container {
              padding: 2rem;
            }
          }
        `}</style>

        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Report Upload</h2>
            <p className="form-subtitle">Upload medical reports for patients</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              {/* Department Selection */}
              <div className="form-group">
                <label className="form-label">
                  <Building2 size={16} />
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  className={`form-select ${errors.department ? "error" : ""}`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="error-message">
                    <AlertCircle size={16} />
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Patient Selection */}
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Patient
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) =>
                    handleInputChange("patientId", e.target.value)
                  }
                  disabled={!formData.department}
                  className={`form-select ${errors.patientId ? "error" : ""}`}
                >
                  <option value="">Select patient</option>
                  {filteredPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.number})
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="error-message">
                    <AlertCircle size={16} />
                    {errors.patientId}
                  </p>
                )}
              </div>
            </div>

            {/* Report Type */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Report Type
              </label>
              <select
                value={formData.reportType}
                onChange={(e) =>
                  handleInputChange("reportType", e.target.value)
                }
                disabled={!formData.department}
                className={`form-select ${errors.reportType ? "error" : ""}`}
              >
                <option value="">Select report type</option>
                {formData.department &&
                  reportTypes[formData.department as Department]?.map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
              </select>
              {errors.reportType && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.reportType}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label className="form-label">
                <Upload size={16} />
                Report File (Optional)
              </label>
              <div className="file-upload-area">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="file-upload-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-content">
                  {file ? (
                    <div className="file-selected">
                      <CheckCircle size={32} />
                      <div className="file-selected-info">
                        <p className="file-selected-name">{file.name}</p>
                        <p className="file-selected-size">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} color="#9ca3af" />
                      <p className="file-upload-text">
                        Click to upload or drag and drop
                      </p>
                      <p className="file-upload-subtext">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Report Text */}
            <div className="form-group">
              <label className="form-label">Report Details</label>
              <textarea
                value={formData.reportText}
                onChange={(e) =>
                  handleInputChange("reportText", e.target.value)
                }
                rows={6}
                className={`form-textarea ${errors.reportText ? "error" : ""}`}
                placeholder="Enter detailed report findings, observations, and recommendations..."
              />
              {errors.reportText && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.reportText}
                </p>
              )}
            </div>

            {/* Doctor Name */}
            <div className="form-group">
              <label className="form-label">Uploaded By (Doctor)</label>
              <input
                type="text"
                value={formData.uploadedBy}
                onChange={(e) =>
                  handleInputChange("uploadedBy", e.target.value)
                }
                className={`form-input ${errors.uploadedBy ? "error" : ""}`}
                placeholder="Enter doctor's name"
              />
              {errors.uploadedBy && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.uploadedBy}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Uploading Report...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Upload Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportUpload;

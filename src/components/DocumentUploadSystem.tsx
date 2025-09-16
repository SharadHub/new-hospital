import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import {
  Upload,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  Building2,
  Scan,
  Save,
  Eye,
} from "lucide-react";

interface DocumentState {
  file: File | null;
  image: string | null;
  text: string;
  loading: boolean;
  error: string | null;
  saved: boolean;
  savedReportId?: string;
}

interface Patient {
  id: string;
  name: string;
  number: string;
}

interface SavedReport {
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

interface DocumentUploadSystemProps {
  patients?: Patient[];
  onAddReport?: (report: SavedReport) => void;
  onViewReportDetails?: (report: SavedReport) => void;
}

export default function DocumentUploadSystem({
  patients = [],
  onAddReport,
  onViewReportDetails,
}: DocumentUploadSystemProps) {
  // Document upload state
  const [documentState, setDocumentState] = useState<DocumentState>({
    file: null,
    image: null,
    text: "",
    loading: false,
    error: null,
    saved: false,
  });

  // Firm data upload state
  const [firmState, setFirmState] = useState<DocumentState>({
    file: null,
    image: null,
    text: "",
    loading: false,
    error: null,
    saved: false,
  });

  const [documentDepartment, setDocumentDepartment] = useState<string>("CT");
  const [firmDepartment, setFirmDepartment] = useState<string>("CT");

  // Document specific fields
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [reportType, setReportType] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");

  // Store saved reports for viewing
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  const documentFileInputRef = useRef<HTMLInputElement>(null);
  const firmFileInputRef = useRef<HTMLInputElement>(null);

  const departments = [
    "CT",
    "MRI",
    "ECG",
    "USG",
    "X-ray",
    "TMT",
    "Holter",
    "Biopsy",
    "Dialysis",
    "Mammography",
    "Dental X-Ray",
    "EEG",
    "Doppler",
  ];

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (documentState.image) URL.revokeObjectURL(documentState.image);
      if (firmState.image) URL.revokeObjectURL(firmState.image);
    };
  }, [documentState.image, firmState.image]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "document" | "firm"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const setState = type === "document" ? setDocumentState : setFirmState;
      const currentState = type === "document" ? documentState : firmState;

      // Cleanup previous blob URL
      if (currentState.image) {
        URL.revokeObjectURL(currentState.image);
      }

      setState({
        file: file,
        image: URL.createObjectURL(file),
        text: "",
        loading: false,
        error: null,
        saved: false,
      });
    }
  };

  const handleUploadClick = (type: "document" | "firm") => {
    if (type === "document") {
      documentFileInputRef.current?.click();
    } else {
      firmFileInputRef.current?.click();
    }
  };

  const handleAutoScan = (type: "document" | "firm") => {
    const currentState = type === "document" ? documentState : firmState;
    const setState = type === "document" ? setDocumentState : setFirmState;
    const department =
      type === "document" ? documentDepartment : firmDepartment;

    if (!currentState.image || !currentState.file) return;

    setState((prev) => ({
      ...prev,
      loading: true,
      text: "",
      error: null,
      saved: false,
    }));

    // Auto-scan with department-specific processing
    Tesseract.recognize(currentState.image, "eng", {
      logger: (m: any) => console.log(`${department} ${type} Auto-Scan:`, m),
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?-()[]{}/ ",
    })
      .then(({ data: { text } }) => {
        // Format extracted text with metadata
        const processedText =
          `[${department} ${type.toUpperCase()} AUTO-SCAN]\n` +
          `File: ${currentState.file?.name}\n` +
          `Department: ${department}\n` +
          `Processed: ${new Date().toLocaleString()}\n` +
          `Type: ${
            type === "document" ? "Medical Document" : "Firm Data"
          }\n\n` +
          `EXTRACTED CONTENT:\n${text}`;

        setState((prev) => ({
          ...prev,
          text: processedText,
          loading: false,
        }));
      })
      .catch((err) => {
        console.error(`${type} Auto-Scan Error:`, err);
        setState((prev) => ({
          ...prev,
          error: `Failed to auto-scan ${type}. Please try again.`,
          loading: false,
        }));
      });
  };

  const handleSaveDocument = (type: "document" | "firm") => {
    const currentState = type === "document" ? documentState : firmState;
    const setState = type === "document" ? setDocumentState : setFirmState;
    const department =
      type === "document" ? documentDepartment : firmDepartment;

    if (!currentState.file || !currentState.text) return;

    // Validation for document type
    if (
      type === "document" &&
      (!selectedPatient || !reportType || !doctorName)
    ) {
      setState((prev) => ({
        ...prev,
        error: "Please fill all required fields (Patient, Report Type, Doctor)",
      }));
      return;
    }

    if (type === "document") {
      // Create report for document upload
      const selectedPatientData = patients.find(
        (p) => p.id === selectedPatient
      );
      const reportId = Date.now().toString();

      const newReport: SavedReport = {
        id: reportId,
        serialNumber: savedReports.length + 1,
        patient: selectedPatientData?.name || "Unknown Patient",
        department: department,
        reportType: reportType,
        date: new Date().toISOString().split("T")[0],
        doctor: doctorName,
        uploadedAt: new Date().toISOString(),
        extractedText: currentState.text,
        imageUrl: currentState.image || undefined,
      };

      // Add to saved reports
      setSavedReports((prev) => [...prev, newReport]);

      // Call parent callback if provided
      if (onAddReport) {
        onAddReport(newReport);
      }

      setState((prev) => ({
        ...prev,
        saved: true,
        savedReportId: reportId,
      }));

      console.log("Document saved and ready for view details:", newReport);
    } else {
      // Handle firm data save
      setState((prev) => ({ ...prev, saved: true }));
      console.log(`Saving ${type} to ${department} department:`, {
        file: currentState.file,
        extractedText: currentState.text,
        department: department,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleViewDetails = () => {
    if (documentState.savedReportId) {
      const savedReport = savedReports.find(
        (r) => r.id === documentState.savedReportId
      );
      if (savedReport && onViewReportDetails) {
        onViewReportDetails(savedReport);
      }
    }
  };

  const UploadBlock = ({
    title,
    description,
    type,
    state,
    department,
    setDepartment,
    icon: Icon,
    color,
  }: {
    title: string;
    description: string;
    type: "document" | "firm";
    state: DocumentState;
    department: string;
    setDepartment: (dept: string) => void;
    icon: any;
    color: string;
  }) => (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        border: `2px solid ${color}`,
        flex: "1",
        minWidth: "450px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <Icon size={24} style={{ color }} />
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#374151",
              margin: "0",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "4px 0 0 0",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Department Selection */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Department: <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            backgroundColor: "white",
          }}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Document-specific fields */}
      {type === "document" && (
        <>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Patient: <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
              }}
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.number})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Report Type: <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              placeholder="e.g., CT Scan Report, MRI Study"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Doctor Name: <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="e.g., Dr. John Smith"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
          </div>
        </>
      )}

      {/* File Upload Area */}
      <div
        style={{
          border: `2px dashed ${color}`,
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: `${color}08`,
          transition: "background-color 0.3s ease",
        }}
        onClick={() => handleUploadClick(type)}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = `${color}15`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = `${color}08`;
        }}
      >
        <input
          type="file"
          accept={
            type === "document"
              ? "image/*,application/pdf,.doc,.docx,.txt"
              : "image/*"
          }
          onChange={(e) => handleFileChange(e, type)}
          ref={type === "document" ? documentFileInputRef : firmFileInputRef}
          style={{ display: "none" }}
        />

        <Upload size={32} style={{ margin: "0 auto", color }} />
        <p style={{ marginTop: "8px", fontSize: "14px", color: "#374151" }}>
          Click to upload{" "}
          {type === "document" ? "documents & photos" : "photos only"}
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          {type === "document"
            ? "PDF, DOC, DOCX, TXT, PNG, JPG, JPEG"
            : "PNG, JPG, JPEG"}
        </p>
      </div>

      {/* File Info */}
      {state.file && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f9fafb",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: "0", fontSize: "14px", color: "#374151" }}>
            <strong>File:</strong> {state.file.name}
          </p>
          <p
            style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}
          >
            Size: {(state.file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      {/* Image Preview */}
      {state.image && (
        <div style={{ marginTop: "16px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "500",
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Preview:
          </h3>
          <img
            src={state.image}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "contain",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      )}

      {/* Auto-Scan Button */}
      {state.image && !state.saved && (
        <button
          onClick={() => handleAutoScan(type)}
          disabled={state.loading}
          style={{
            width: "100%",
            marginTop: "16px",
            backgroundColor: state.loading ? "#9ca3af" : color,
            color: "white",
            padding: "12px 16px",
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "14px",
            border: "none",
            cursor: state.loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background-color 0.3s ease",
          }}
        >
          {state.loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Auto-scanning...
            </>
          ) : (
            <>
              <Scan size={16} />
              Auto-Scan {type === "document" ? "Document" : "Firm Data"}
            </>
          )}
        </button>
      )}

      {/* Save Document Button */}
      {state.text && !state.saved && (
        <button
          onClick={() => handleSaveDocument(type)}
          style={{
            width: "100%",
            marginTop: "12px",
            backgroundColor: "#059669",
            color: "white",
            padding: "12px 16px",
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background-color 0.3s ease",
          }}
        >
          <Save size={16} />
          Save {type === "document" ? "Document" : "Firm Data"}
        </button>
      )}

      {/* View Details Button (only for documents) */}
      {type === "document" && state.saved && state.savedReportId && (
        <button
          onClick={handleViewDetails}
          style={{
            width: "100%",
            marginTop: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "12px 16px",
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background-color 0.3s ease",
          }}
        >
          <Eye size={16} />
          View Details
        </button>
      )}

      {/* Error Display */}
      {state.error && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            color: "#b91c1c",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <XCircle size={16} /> {state.error}
        </div>
      )}

      {/* Success/Saved State */}
      {state.saved && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            color: "#065f46",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            padding: "12px",
            borderRadius: "6px",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <CheckCircle2 size={16} />
          {type === "document" ? "Document" : "Firm data"} saved successfully to{" "}
          {department} department!
          {type === "document" && (
            <>
              <br />
              <small>Click "View Details" to see the saved report.</small>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "24px",
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "8px",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          Document & Firm Data Upload System
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          Auto-scan and save documents with department-specific processing
        </p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <UploadBlock
            title="Upload Document"
            description="Auto-scan medical documents and save to department"
            type="document"
            state={documentState}
            department={documentDepartment}
            setDepartment={setDocumentDepartment}
            icon={FileText}
            color="#2563eb"
          />

          <UploadBlock
            title="Upload Firm Data"
            description="Auto-scan firm data and save to department"
            type="firm"
            state={firmState}
            department={firmDepartment}
            setDepartment={setFirmDepartment}
            icon={Building2}
            color="#7c3aed"
          />
        </div>
      </div>
    </div>
  );
}

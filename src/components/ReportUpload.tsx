import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import {
  Upload,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  Building2,
  Save,
  Eye,
  RefreshCw,
  User,
  Calendar,
  ClipboardList,
} from "lucide-react";

interface DocumentState {
  file: File | null;
  image: string | null;
  text: string;
  formattedData: any;
  loading: boolean;
  error: string | null;
  saved: boolean;
  savedReportId?: string;
  showFormattedView: boolean;
  autoScanned: boolean;
}

interface SavedReport {
  id: string;
  serialNumber: number;
  patientName: string;
  department: string;
  reportType: string;
  date: string;
  uploadedAt: string;
  extractedText?: string;
  formattedData?: any;
  imageUrl?: string;
}

interface DocumentUploadSystemProps {
  onAddReport?: (report: SavedReport) => void;
  onViewReportDetails?: (report: SavedReport) => void;
}

export default function DocumentUploadSystem({
  onAddReport,
  onViewReportDetails,
}: DocumentUploadSystemProps) {
  // Document upload state
  const [documentState, setDocumentState] = useState<DocumentState>({
    file: null,
    image: null,
    text: "",
    formattedData: null,
    loading: false,
    error: null,
    saved: false,
    showFormattedView: false,
    autoScanned: false,
  });

  // Firm data upload state
  const [firmState, setFirmState] = useState<DocumentState>({
    file: null,
    image: null,
    text: "",
    formattedData: null,
    loading: false,
    error: null,
    saved: false,
    showFormattedView: false,
    autoScanned: false,
  });

  // Auto-extracted form fields
  const [documentDepartment, setDocumentDepartment] = useState<string>("");
  const [firmDepartment, setFirmDepartment] = useState<string>("CT");
  const [extractedPatientName, setExtractedPatientName] = useState<string>("");
  const [extractedReportType, setExtractedReportType] = useState<string>("");
  const [extractedDate, setExtractedDate] = useState<string>("");

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

  // Enhanced report type patterns for better extraction
  const reportTypePatterns = [
    // CT Scan variations
    {
      pattern: /ct\s*scan\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i,
      type: "CT Scan of",
    },
    {
      pattern: /computed\s*tomography\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i,
      type: "CT Scan of",
    },
    {
      pattern: /contrast\s*ct\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i,
      type: "CT Scan of",
    },

    // MRI variations
    { pattern: /mri\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i, type: "MRI of" },
    {
      pattern:
        /magnetic\s*resonance\s*imaging\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i,
      type: "MRI of",
    },

    // X-ray variations
    {
      pattern: /x[-\s]*ray\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i,
      type: "X-ray of",
    },
    {
      pattern: /radiograph\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i,
      type: "X-ray of",
    },
    { pattern: /chest\s*x[-\s]*ray/i, type: "X-ray of Chest" },

    // USG variations
    { pattern: /usg\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i, type: "USG of" },
    { pattern: /ultrasound\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i, type: "USG of" },
    { pattern: /sonography\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i, type: "USG of" },
    {
      pattern: /doppler\s*study\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i,
      type: "Doppler Study of",
    },

    // ECG variations
    { pattern: /electrocardiogram/i, type: "ECG Report" },
    { pattern: /ecg\s*report/i, type: "ECG Report" },
    { pattern: /ekg\s*report/i, type: "ECG Report" },

    // Other specific tests
    { pattern: /treadmill\s*test|tmt\s*report/i, type: "TMT Report" },
    {
      pattern: /holter\s*monitoring|24\s*hour\s*ecg/i,
      type: "Holter Monitoring Report",
    },
    { pattern: /mammography\s*report/i, type: "Mammography Report" },
    { pattern: /biopsy\s*report/i, type: "Biopsy Report" },
    { pattern: /eeg\s*report|electroencephalogram/i, type: "EEG Report" },

    // General patterns for body parts
    { pattern: /study\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i, type: "Study of" },
    { pattern: /report\s*of\s*([\w\s,]+?)(?=\n|$|[.:])/i, type: "Report of" },
  ];

  // Enhanced patient name patterns for better extraction
  const patientNamePatterns = [
    /(?:patient['"]?s?[-:\s|]+name|name[-:\s]+of[-:\s]+patient)\s*[:\-|=]?\s*([A-Za-z][A-Za-z\.]{1,20}(?:\s+[A-Za-z][A-Za-z\.]{1,20}){0,2})/i,
    /(?:^|\n)\s*patient[-:\s]*([A-Za-z][A-Za-z\.]{1,20}(?:\s+[A-Za-z][A-Za-z\.]{1,20}){0,3})/im,
    /(?:mr\.?|mrs\.?|ms\.?|dr\.?)\s+([A-Za-z][A-Za-z\.]{1,20}(?:\s+[A-Za-z][A-Za-z\.]{1,20}){0,3})/i,
    /(?:insured['"]?s?[-:\s]+name|subscriber['"]?s?[-:\s]+name)[:\-\s]*([A-Za-z][A-Za-z\.]{1,20}(?:\s+[A-Za-z][A-Za-z\.]{1,20}){0,3})/i,
  ];

  // Enhanced date patterns
  const datePatterns = [
    /(?:date\s*[:=\-]?)\s*(\d{4}[\/\.\-]\d{1,2}[\/\.\-]\d{1,2})/i, // For BS like 2082/5/30
    /(?:date\s*of\s*service|dos|service\s*date)\s*[:=\-]?\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /(?:report\s*date|date\s*of\s*report)\s*[:=\-]?\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /(?:study\s*date|date\s*of\s*study|exam\s*date|date\s*of\s*exam)\s*[:=\-]?\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /(?:date\s*of\s*birth|dob)\s*[:=\-]?\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
  ];
  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (documentState.image) URL.revokeObjectURL(documentState.image);
      if (firmState.image) URL.revokeObjectURL(firmState.image);
    };
  }, [documentState.image, firmState.image]);

  // Enhanced smart text parsing function
  const parseExtractedText = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const lowerText = text.toLowerCase();

    const parsed: any = {
      rawText: text,
      extractedFields: {},
      observations: [],
      //findings: [],
      recommendation: "",
      autoFilledData: {
        department: "",
        patientName: "",
        reportType: "",
        date: "",
      },
      metadata: {
        scanDate: new Date().toLocaleDateString(),
        scanTime: new Date().toLocaleTimeString(),
        confidence: "Medium",
      },
    };

    // Auto-detect department based on keywords
    const departmentKeywords = {
      CT: ["ct scan", "computed tomography", "ct report", "contrast ct"],
      MRI: ["mri", "magnetic resonance", "mri scan", "mri report"],
      ECG: ["ecg", "electrocardiogram", "ekg", "heart rhythm"],
      USG: ["ultrasound", "usg", "sonography", "doppler"],
      "X-ray": ["x-ray", "xray", "radiograph", "chest x-ray"],
      TMT: ["tmt", "treadmill test", "stress test", "exercise test"],
      Holter: ["holter", "24 hour monitoring", "holter monitor"],
      Biopsy: ["biopsy", "tissue sample", "histopathology"],
      Dialysis: ["dialysis", "hemodialysis", "peritoneal dialysis"],
      Mammography: ["mammography", "breast imaging", "mammogram"],
      "Dental X-Ray": ["dental", "orthopantomogram", "opg", "dental x-ray"],
      EEG: ["eeg", "electroencephalogram", "brain waves"],
      Doppler: ["doppler", "vascular study", "blood flow"],
    };

    // Auto-detect department
    for (const [dept, keywords] of Object.entries(departmentKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        parsed.autoFilledData.department = dept;
        break;
      }
    }

    // Enhanced report type extraction
    let reportType = "";
    for (const { pattern, type } of reportTypePatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1]) {
          // Body part was captured
          const bodyPart = match[1].trim().replace(/[^\w\s]/g, "");
          reportType = `${type} ${bodyPart}`;
        } else {
          // Use the type as is
          reportType = type;
        }
        break;
      }
    }

    if (reportType) {
      parsed.autoFilledData.reportType = reportType;
    }

    function cleanPatientName(rawName: string): string {
      return rawName
        .replace(/[\|,:]+$/, "") // remove trailing | , :
        .replace(/\s{2,}/g, " ") // collapse multiple spaces
        .trim()
        .split(" ")
        .map((w) =>
          w.length === 1 || w.endsWith(".")
            ? w.toUpperCase() // initials -> uppercase
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join(" ");
    }

    let patientName = "";

    for (const pattern of patientNamePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let extractedName = match[1]
          .trim()
          .replace(/[^\w\s\.]/g, "")
          .replace(/\s+/g, " ")
          .trim();

        // Remove OCR tails anywhere in name
        const OCR_TAILS = [
          "Tr",
          "Dr",
          "Mr",
          "Ms",
          "Mrs",
          "Tones",
          "EE",
          "RR",
          "NG",
          "NA",
        ];
        extractedName = extractedName
          .split(" ")
          .filter((w) => !OCR_TAILS.includes(w))
          .join(" ");

        // Remove trailing 1-2 letter uppercase words
        extractedName = extractedName.replace(/\b[A-Z]{1,2}\b$/, "");

        // Split into words for validation
        const words = extractedName.split(" ").filter((w) => w.length > 1);

        if (
          extractedName.length >= 3 &&
          extractedName.length <= 40 &&
          /^[A-Za-z\s\.]+$/.test(extractedName) &&
          words.length >= 1 &&
          words.length <= 5 &&
          ![
            "page",
            "report",
            "hospital",
            "clinic",
            "medical",
            "name",
            "patient",
            "mr",
            "mrs",
            "ms",
          ].includes(extractedName.toLowerCase())
        ) {
          // Format properly
          patientName = cleanPatientName(extractedName);
          if (patientName.length >= 3 && words.length >= 1) {
            break;
          }
        }
      }
    }

    if (patientName) {
      parsed.autoFilledData.patientName = patientName;
    }

    // Enhanced date extraction - simplified and more reliable
    let extractedDate = "";
    console.log("OCR output:", text);
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let dateStr = match[1].trim();

        // Clean common OCR misreads
        dateStr = dateStr
          .replace(/[Oo]/g, "0")
          .replace(/[Ss]/g, "5")
          .replace(/[lI]/g, "1");

        try {
          let day: number, month: number, year: number;

          // Detect separator
          let separator: string;
          if (dateStr.includes("/")) separator = "/";
          else if (dateStr.includes("-")) separator = "-";
          else separator = ".";

          const parts = dateStr.split(separator).map((p) => p.trim());

          if (parts.length === 3) {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);

            // Handle 2-digit years
            if (year < 100) year = year < 50 ? 2000 + year : 1900 + year;

            // Validate Nepali date ranges
            if (
              day >= 1 &&
              day <= 31 &&
              month >= 1 &&
              month <= 12 &&
              year >= 2000 &&
              year <= 2100
            ) {
              extractedDate = `${year}-${month
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
              break;
            }

            // Try MM/DD/YYYY fallback
            day = parseInt(parts[1], 10);
            month = parseInt(parts[0], 10);
            if (
              day >= 1 &&
              day <= 31 &&
              month >= 1 &&
              month <= 12 &&
              year >= 2000 &&
              year <= 2100
            ) {
              extractedDate = `${year}-${month
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
              break;
            }
          }

          // Last-resort Date parsing (may fail for Nepali years, but safe fallback)
          if (!extractedDate) {
            const parsedDate = new Date(dateStr);
            if (
              !isNaN(parsedDate.getTime()) &&
              parsedDate.getFullYear() >= 2000 &&
              parsedDate.getFullYear() <= 2100
            ) {
              extractedDate = parsedDate.toISOString().split("T")[0];
              break;
            }
          }
        } catch (e) {
          console.log("Date parsing error:", e);
        }

        // Fallback for messy OCR
        if (!extractedDate) {
          const fallbackParts = dateStr
            .split(/[\/\-\.\s]/)
            .map((p) => p.trim());
          if (fallbackParts.length === 3) {
            let fDay = fallbackParts[0].padStart(2, "0");
            let fMonth = fallbackParts[1].padStart(2, "0");
            let fYear = fallbackParts[2];
            if (fYear.length === 2)
              fYear = fYear < "50" ? "20" + fYear : "19" + fYear;
            extractedDate = `${fYear}-${fMonth}-${fDay}`;
            break;
          }
        }
      }
    }

    if (extractedDate) {
      parsed.autoFilledData.date = extractedDate;
    }
    // Extract measurements and values
    const measurements = text.match(
      /(\d+(?:\.\d+)?\s*(?:mm|cm|ml|mg|kg|lbs?|bpm|mmhg))/gi
    );
    if (measurements) {
      parsed.measurements = measurements;
    }

    return parsed;
  };

  // Auto-scan immediately when file is uploaded
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

      const imageUrl = URL.createObjectURL(file);

      setState({
        file: file,
        image: imageUrl,
        text: "",
        formattedData: null,
        loading: true,
        error: null,
        saved: false,
        showFormattedView: false,
        autoScanned: false,
      });

      // Auto-scan immediately after file upload
      setTimeout(() => {
        performAutoScan(file, imageUrl, type);
      }, 100);
    }
  };

  // Perform auto-scan function
  const performAutoScan = (
    file: File,
    imageUrl: string,
    type: "document" | "firm"
  ) => {
    const setState = type === "document" ? setDocumentState : setFirmState;

    Tesseract.recognize(imageUrl, "eng", {
      logger: (m: any) => console.log(`${type} Auto-Scan:`, m),
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?-()[]{}/ ",
    })
      .then(({ data: { text } }) => {
        // Parse and format the extracted text
        console.log("OCR Extracted Text:", text.substring(0, 500));
        const formattedData = parseExtractedText(text);

        // Auto-fill form fields for documents
        if (type === "document" && formattedData.autoFilledData) {
          if (formattedData.autoFilledData.department) {
            setDocumentDepartment(formattedData.autoFilledData.department);
          }
          if (formattedData.autoFilledData.patientName) {
            setExtractedPatientName(formattedData.autoFilledData.patientName);
          }
          if (formattedData.autoFilledData.reportType) {
            setExtractedReportType(formattedData.autoFilledData.reportType);
          }
          if (formattedData.autoFilledData.date) {
            setExtractedDate(formattedData.autoFilledData.date);
          }
        }

        // Format extracted text with metadata
        const processedText =
          `[${
            formattedData.autoFilledData.department || "GENERAL"
          } ${type.toUpperCase()} AUTO-SCAN]\n` +
          `File: ${file.name}\n` +
          `Auto-detected Department: ${
            formattedData.autoFilledData.department || "Not detected"
          }\n` +
          `Auto-extracted Patient: ${
            formattedData.autoFilledData.patientName || "Not detected"
          }\n` +
          `Auto-extracted Report Type: ${
            formattedData.autoFilledData.reportType || "Not detected"
          }\n` +
          `Auto-extracted Date: ${
            formattedData.autoFilledData.date || "Not detected"
          }\n` +
          `Processed: ${new Date().toLocaleString()}\n` +
          `Type: ${
            type === "document" ? "Medical Document" : "Firm Data"
          }\n\n` +
          `EXTRACTED CONTENT:\n${text}`;

        setState((prev) => ({
          ...prev,
          text: processedText,
          formattedData: formattedData,
          loading: false,
          showFormattedView: true,
          autoScanned: true,
        }));
      })
      .catch((err) => {
        console.error(`${type} Auto-Scan Error:`, err);
        setState((prev) => ({
          ...prev,
          error: `Failed to auto-scan ${type}. Please try again.`,
          loading: false,
          autoScanned: false,
        }));
      });
  };

  const handleUploadClick = (type: "document" | "firm") => {
    if (type === "document") {
      documentFileInputRef.current?.click();
    } else {
      firmFileInputRef.current?.click();
    }
  };

  const handleReScan = (type: "document" | "firm") => {
    const currentState = type === "document" ? documentState : firmState;
    const setState = type === "document" ? setDocumentState : setFirmState;

    if (!currentState.image || !currentState.file) return;

    setState((prev) => ({ ...prev, loading: true }));
    performAutoScan(currentState.file, currentState.image, type);
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
      (!extractedPatientName || !extractedReportType || !extractedDate)
    ) {
      setState((prev) => ({
        ...prev,
        error:
          "Please ensure Patient Name, Report Type, and Date are extracted/filled",
      }));
      return;
    }

    if (type === "document") {
      // Create report for document upload
      const reportId = Date.now().toString();

      const newReport: SavedReport = {
        id: reportId,
        serialNumber: savedReports.length + 1,
        patientName: extractedPatientName,
        department: department,
        reportType: extractedReportType,
        date: extractedDate,
        uploadedAt: new Date().toISOString(),
        extractedText: currentState.text,
        formattedData: currentState.formattedData,
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
        error: null,
      }));

      console.log("Document saved and ready for view details:", newReport);
    } else {
      // Handle firm data save
      setState((prev) => ({ ...prev, saved: true, error: null }));
      console.log(`Saving ${type} to ${department} department:`, {
        file: currentState.file,
        extractedText: currentState.text,
        formattedData: currentState.formattedData,
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

  // Formatted Text Display Component
  const FormattedTextDisplay = ({
    formattedData,
    type,
  }: {
    formattedData: any;
    type: "document" | "firm";
  }) => {
    if (!formattedData) return null;

    return (
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
        }}
      >
        {formattedData.autoFilledData && (
          <div style={{ marginBottom: "12px" }}>
            {formattedData.autoFilledData.department && (
              <div style={{ marginBottom: "8px" }}>
                <strong>Department:</strong>{" "}
                {formattedData.autoFilledData.department}
              </div>
            )}
            {formattedData.autoFilledData.patientName && (
              <div style={{ marginBottom: "8px" }}>
                <strong>Patient Name:</strong>{" "}
                {formattedData.autoFilledData.patientName}
              </div>
            )}
            {formattedData.autoFilledData.reportType && (
              <div style={{ marginBottom: "8px" }}>
                <strong>Report Type:</strong>{" "}
                {formattedData.autoFilledData.reportType}
              </div>
            )}
            {formattedData.autoFilledData.date && (
              <div style={{ marginBottom: "8px" }}>
                <strong>Date:</strong> {formattedData.autoFilledData.date}
              </div>
            )}
          </div>
        )}

        {formattedData.findings && (
          <div style={{ marginBottom: "12px" }}>
            <h5
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              Findings:
            </h5>
            <p style={{ margin: 0, fontSize: "14px", color: "#4b5563" }}>
              {formattedData.findings}
            </p>
          </div>
        )}

        {formattedData.impression && (
          <div>
            <h5
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              Impression:
            </h5>
            <p style={{ margin: 0, fontSize: "14px", color: "#4b5563" }}>
              {formattedData.impression}
            </p>
          </div>
        )}
      </div>
    );
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
  }) => {
    const setState = type === "document" ? setDocumentState : setFirmState;

    return (
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
                color: "#1f2937",
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

        {/* File Upload Area */}
        <div
          style={{
            border: `2px dashed ${color}`,
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            cursor: state.loading ? "not-allowed" : "pointer",
            backgroundColor: state.loading ? `${color}05` : `${color}08`,
            transition: "background-color 0.3s ease",
            opacity: state.loading ? 0.7 : 1,
          }}
          onClick={() => !state.loading && handleUploadClick(type)}
          onMouseOver={(e) => {
            if (!state.loading) {
              e.currentTarget.style.backgroundColor = `${color}15`;
            }
          }}
          onMouseOut={(e) => {
            if (!state.loading) {
              e.currentTarget.style.backgroundColor = `${color}08`;
            }
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
            disabled={state.loading}
          />

          {state.loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Loader2 className="animate-spin" size={32} style={{ color }} />
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  color: "#374151",
                  fontWeight: "500",
                }}
              >
                Auto-scanning document...
              </p>
              <p style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}>
                Extracting patient name, report type, department, and date
              </p>
            </div>
          ) : (
            <>
              <Upload size={32} style={{ margin: "0 auto", color }} />
              <p
                style={{ marginTop: "8px", fontSize: "14px", color: "#374151" }}
              >
                Click to upload and auto-extract{" "}
                {type === "document" ? "patient & report details" : "firm data"}
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                {type === "document"
                  ? "PDF, DOC, DOCX, TXT, PNG, JPG, JPEG - Auto-extracts patient name, report type, department & date"
                  : "PNG, JPG, JPEG"}
              </p>
            </>
          )}
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
              style={{
                margin: "4px 0 0 0",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              Size: {(state.file.size / 1024).toFixed(1)} KB
            </p>
            {state.autoScanned && (
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#059669",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                <CheckCircle2 size={14} />
                Auto-scan completed - Data extracted
              </div>
            )}
          </div>
        )}

        {/* Image Preview */}
        {state.image && (
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  margin: "0",
                  color: "#374151",
                }}
              >
                Preview:
              </h3>
              {state.autoScanned && !state.loading && (
                <button
                  onClick={() => handleReScan(type)}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    border: "1px solid #d1d5db",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }}
                >
                  <RefreshCw size={12} />
                  Re-scan
                </button>
              )}
            </div>
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

        {/* Auto-extracted Department */}
        {state.autoScanned && (
          <div style={{ marginTop: "16px" }}>
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
              {department && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "12px",
                    color: "#059669",
                    backgroundColor: "#ecfdf5",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "600",
                  }}
                >
                  Auto-detected
                </span>
              )}
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: department ? "2px solid #10b981" : "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: department ? "#ecfdf5" : "white",
              }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Document-specific auto-extracted fields */}
        {type === "document" && state.autoScanned && (
          <div style={{ marginTop: "16px" }}>
            {/* Patient Name Field */}
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Patient Name: <span style={{ color: "#ef4444" }}>*</span>
                {extractedPatientName && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "12px",
                      color: "#059669",
                      backgroundColor: "#ecfdf5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Auto-extracted
                  </span>
                )}
              </label>
              <input
                type="text"
                value={extractedPatientName}
                onChange={(e) => setExtractedPatientName(e.target.value)}
                placeholder="Patient name will be auto-extracted from document"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: extractedPatientName
                    ? "2px solid #10b981"
                    : "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: extractedPatientName ? "#ecfdf5" : "white",
                }}
              />
            </div>

            {/* Report Type Field */}
            <div style={{ marginBottom: "12px" }}>
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
                {extractedReportType && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "12px",
                      color: "#059669",
                      backgroundColor: "#ecfdf5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Auto-extracted
                  </span>
                )}
              </label>
              <input
                type="text"
                value={extractedReportType}
                onChange={(e) => setExtractedReportType(e.target.value)}
                placeholder="Report type will be auto-extracted (e.g., USG of Pelvis, X-ray of Hand)"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: extractedReportType
                    ? "2px solid #10b981"
                    : "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: extractedReportType ? "#ecfdf5" : "white",
                }}
              />
            </div>

            {/* Date Field */}
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
                Report Date: <span style={{ color: "#ef4444" }}>*</span>
                {extractedDate && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "12px",
                      color: "#059669",
                      backgroundColor: "#ecfdf5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Auto-extracted
                  </span>
                )}
              </label>
              <input
                type="date"
                value={extractedDate}
                onChange={(e) => setExtractedDate(e.target.value)}
                placeholder="Report date will be auto-extracted from document"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: extractedDate
                    ? "2px solid #10b981"
                    : "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: extractedDate ? "#ecfdf5" : "white",
                }}
              />
            </div>
          </div>
        )}

        {/* Formatted Text Display */}
        {state.formattedData && state.showFormattedView && (
          <FormattedTextDisplay
            formattedData={state.formattedData}
            type={type}
          />
        )}

        {/* Save Document Button */}
        {state.text && !state.saved && (
          <button
            onClick={() => handleSaveDocument(type)}
            disabled={
              type === "document" &&
              (!extractedPatientName || !extractedReportType || !extractedDate)
            }
            style={{
              width: "100%",
              marginTop: "12px",
              backgroundColor:
                type === "document" &&
                (!extractedPatientName ||
                  !extractedReportType ||
                  !extractedDate)
                  ? "#9ca3af"
                  : "#059669",
              color: "white",
              padding: "12px 16px",
              borderRadius: "6px",
              fontWeight: "500",
              fontSize: "14px",
              border: "none",
              cursor:
                type === "document" &&
                (!extractedPatientName ||
                  !extractedReportType ||
                  !extractedDate)
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background-color 0.3s ease",
              opacity:
                type === "document" &&
                (!extractedPatientName ||
                  !extractedReportType ||
                  !extractedDate)
                  ? 0.6
                  : 1,
            }}
          >
            <Save size={16} />
            Save {type === "document" ? "Document" : "Firm Data"}
            {type === "document" &&
              (!extractedPatientName ||
                !extractedReportType ||
                !extractedDate) && (
                <span style={{ fontSize: "12px", marginLeft: "4px" }}>
                  (Fill required fields)
                </span>
              )}
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
            {type === "document" ? "Document" : "Firm data"} saved successfully
            to {department} department!
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
  };

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
          Smart Document Upload & Auto-Extract System
        </h1>
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <UploadBlock
            title="Upload Medical Document"
            description="Auto-extract patient name, report type, department, and date"
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

        {/* Saved Reports Preview Table */}
        {savedReports.length > 0 && (
          <div>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb" }}>
                    <th>S.No.</th>
                    <th>Patient Name</th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Department
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Report Type
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Report Date
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {savedReports.map((report, index) => (
                    <tr
                      key={report.id}
                      style={{
                        borderBottom:
                          "1px solid " +
                          (index % 2 === 0 ? "#f3f4f6" : "#e5e7eb"),
                        backgroundColor: index % 2 === 0 ? "white" : "#fafbfc",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}
                      >
                        #{report.serialNumber}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#374151",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <User size={16} style={{ color: "#6b7280" }} />
                          {report.patientName}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#4b5563" }}>
                        <span
                          style={{
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {report.department}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#4b5563" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <ClipboardList
                            size={14}
                            style={{ color: "#6b7280" }}
                          />
                          {report.reportType}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#4b5563",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Calendar size={14} style={{ color: "#6b7280" }} />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() =>
                            onViewReportDetails && onViewReportDetails(report)
                          }
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#2563eb";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#3b82f6";
                          }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

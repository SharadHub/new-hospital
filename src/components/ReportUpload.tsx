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
  Image as ImageIcon,
  X,
  Plus,
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

interface FirmImageState {
  files: File[];
  images: string[];
  loading: boolean;
  error: string | null;
  saved: boolean;
  uploadProgress: number;
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
  // Document upload state (unchanged)
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

  // Firm images upload state (new multi-image state)
  const [firmState, setFirmState] = useState<FirmImageState>({
    files: [],
    images: [],
    loading: false,
    error: null,
    saved: false,
    uploadProgress: 0,
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
      firmState.images.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
    };
  }, [documentState.image, firmState.images]);

  // Enhanced smart text parsing function
  const parseExtractedText = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const lowerText = text.toLowerCase();

    const parsed: any = {
      rawText: text,
      extractedFields: {},
      observations: [],
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

  // Document file change handler (unchanged)
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Cleanup previous blob URL
      if (documentState.image) {
        URL.revokeObjectURL(documentState.image);
      }

      const imageUrl = URL.createObjectURL(file);

      setDocumentState({
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
        performAutoScan(file, imageUrl);
      }, 100);
    }
  };

  // New multi-image file change handler for firm data
  const handleFirmImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Cleanup previous blob URLs
      firmState.images.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));

      // Create new blob URLs for preview
      const imageUrls = files.map((file) => URL.createObjectURL(file));

      setFirmState({
        files: files,
        images: imageUrls,
        loading: false,
        error: null,
        saved: false,
        uploadProgress: 0,
      });

      console.log(`${files.length} images selected for firm data upload`);
    }
  };

  // Perform auto-scan function (unchanged)
  const performAutoScan = (file: File, imageUrl: string) => {
    Tesseract.recognize(imageUrl, "eng", {
      logger: (m: any) => console.log("Document Auto-Scan:", m),
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?-()[]{}/ ",
    })
      .then(({ data: { text } }) => {
        // Parse and format the extracted text
        console.log("OCR Extracted Text:", text.substring(0, 500));
        const formattedData = parseExtractedText(text);

        // Auto-fill form fields for documents
        if (formattedData.autoFilledData) {
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
          } DOCUMENT AUTO-SCAN]\n` +
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
          `Type: Medical Document\n\n` +
          `EXTRACTED CONTENT:\n${text}`;

        setDocumentState((prev) => ({
          ...prev,
          text: processedText,
          formattedData: formattedData,
          loading: false,
          showFormattedView: true,
          autoScanned: true,
        }));
      })
      .catch((err) => {
        console.error("Document Auto-Scan Error:", err);
        setDocumentState((prev) => ({
          ...prev,
          error: "Failed to auto-scan document. Please try again.",
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

  const handleReScan = () => {
    if (!documentState.image || !documentState.file) return;

    setDocumentState((prev) => ({ ...prev, loading: true }));
    performAutoScan(documentState.file, documentState.image);
  };

  // Remove individual firm image
  const removeFirmImage = (index: number) => {
    const newFiles = firmState.files.filter((_, i) => i !== index);
    const newImages = firmState.images.filter((_, i) => i !== index);

    // Cleanup the removed image URL
    URL.revokeObjectURL(firmState.images[index]);

    setFirmState((prev) => ({
      ...prev,
      files: newFiles,
      images: newImages,
    }));
  };

  const handleSaveDocument = () => {
    if (!documentState.file || !documentState.text) return;

    // Validation for document type
    if (!extractedPatientName || !extractedReportType || !extractedDate) {
      setDocumentState((prev) => ({
        ...prev,
        error:
          "Please ensure Patient Name, Report Type, and Date are extracted/filled",
      }));
      return;
    }

    // Create report for document upload
    const reportId = Date.now().toString();

    const newReport: SavedReport = {
      id: reportId,
      serialNumber: savedReports.length + 1,
      patientName: extractedPatientName,
      department: documentDepartment,
      reportType: extractedReportType,
      date: extractedDate,
      uploadedAt: new Date().toISOString(),
      extractedText: documentState.text,
      formattedData: documentState.formattedData,
      imageUrl: documentState.image || undefined,
    };

    // Add to saved reports
    setSavedReports((prev) => [...prev, newReport]);

    // Call parent callback if provided
    if (onAddReport) {
      onAddReport(newReport);
    }

    setDocumentState((prev) => ({
      ...prev,
      saved: true,
      savedReportId: reportId,
      error: null,
    }));

    console.log("Document saved and ready for view details:", newReport);
  };

  // Save firm images
  const handleSaveFirmImages = () => {
    if (firmState.files.length === 0) {
      setFirmState((prev) => ({
        ...prev,
        error: "Please select at least one image to upload.",
      }));
      return;
    }

    setFirmState((prev) => ({ ...prev, loading: true, uploadProgress: 0 }));

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setFirmState((prev) => {
        const newProgress = prev.uploadProgress + 20;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return {
            ...prev,
            loading: false,
            saved: true,
            error: null,
            uploadProgress: 100,
          };
        }
        return { ...prev, uploadProgress: newProgress };
      });
    }, 200);

    console.log(
      `Saving ${firmState.files.length} images to ${firmDepartment} department:`,
      {
        files: firmState.files.map((f) => f.name),
        department: firmDepartment,
        timestamp: new Date().toISOString(),
      }
    );
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

  // Unified save and upload handler
  const handleSaveAndUploadAll = () => {
    if (!extractedPatientName || !extractedReportType || !extractedDate) {
      setDocumentState((prev) => ({
        ...prev,
        error: "Please ensure Patient Name, Report Type, and Date are extracted/filled",
      }));
      return;
    }
    if (firmState.files.length === 0) {
      setFirmState((prev) => ({
        ...prev,
        error: "Please select at least one image to upload.",
      }));
      return;
    }

    handleSaveDocument();
    handleSaveFirmImages();

    setDocumentState((prev) => ({ ...prev, saved: true, error: null }));
    setFirmState((prev) => ({ ...prev, saved: true, error: null }));
  };

  // Formatted Text Display Component (unchanged)
  const FormattedTextDisplay = ({ formattedData }: { formattedData: any }) => {
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
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }
        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          aspect-ratio: 1;
        }
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-image {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
        }
        .upload-progress {
          width: 100%;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin: 12px 0;
        }
        .upload-progress-bar {
          height: 100%;
          background-color: #10b981;
          transition: width 0.3s ease;
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
          Smart Document Upload & Multi-Image Upload System
        </h1>
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Upload Medical Document Block (unchanged) */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "2px solid #2563eb",
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
              <FileText size={24} style={{ color: "#2563eb" }} />
              <div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  Upload Medical Document
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "4px 0 0 0",
                  }}
                >
                </p>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              style={{
                border: "2px dashed #2563eb",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                cursor: documentState.loading ? "not-allowed" : "pointer",
                backgroundColor: documentState.loading
                  ? "#2563eb05"
                  : "#2563eb08",
                transition: "background-color 0.3s ease",
                opacity: documentState.loading ? 0.7 : 1,
              }}
              onClick={() =>
                !documentState.loading && handleUploadClick("document")
              }
              onMouseOver={(e) => {
                if (!documentState.loading) {
                  e.currentTarget.style.backgroundColor = "#2563eb15";
                }
              }}
              onMouseOut={(e) => {
                if (!documentState.loading) {
                  e.currentTarget.style.backgroundColor = "#2563eb08";
                }
              }}
            >
              <input
                type="file"
                accept="image/*,application/pdf,.doc,.docx,.txt"
                onChange={handleDocumentFileChange}
                ref={documentFileInputRef}
                style={{ display: "none" }}
                disabled={documentState.loading}
              />

              {documentState.loading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Loader2
                    className="animate-spin"
                    size={32}
                    style={{ color: "#2563eb" }}
                  />
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
                  <p
                    style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}
                  >
                    Extracting patient name, report type, department, and date
                  </p>
                </div>
              ) : (
                <>
                  <Upload
                    size={32}
                    style={{ margin: "0 auto", color: "#2563eb" }}
                  />
                  <p
                    style={{
                      marginTop: "8px",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    Click to upload and auto-extract patient & report details
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>
                    PDF, DOC, DOCX, TXT, PNG, JPG, JPEG - Auto-extracts patient
                    name, report type, department & date
                  </p>
                </>
              )}
            </div>

            {/* File Info */}
            {documentState.file && (
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
                  <strong>File:</strong> {documentState.file.name}
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  Size: {(documentState.file.size / 1024).toFixed(1)} KB
                </p>
                {documentState.autoScanned && (
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
            {documentState.image && (
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
                  {documentState.autoScanned && !documentState.loading && (
                    <button
                      onClick={handleReScan}
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
                  src={documentState.image}
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
            {documentState.autoScanned && (
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
                  {documentDepartment && (
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
                  value={documentDepartment}
                  onChange={(e) => setDocumentDepartment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: documentDepartment
                      ? "2px solid #10b981"
                      : "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: documentDepartment ? "#ecfdf5" : "white",
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
            {documentState.autoScanned && (
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
                      backgroundColor: extractedPatientName
                        ? "#ecfdf5"
                        : "white",
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
                      backgroundColor: extractedReportType
                        ? "#ecfdf5"
                        : "white",
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
            {documentState.formattedData && documentState.showFormattedView && (
              <FormattedTextDisplay
                formattedData={documentState.formattedData}
              />
            )}

            {/* View Details Button */}
            {documentState.saved && documentState.savedReportId && (
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
            {documentState.error && (
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
                <XCircle size={16} /> {documentState.error}
              </div>
            )}

            {/* Success/Saved State */}
            {documentState.saved && (
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
                Document saved successfully to {documentDepartment} department!
                <br />
                <small>Click "View Details" to see the saved report.</small>
              </div>
            )}
          </div>

          {/* Upload Firm Images Block (completely new) */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "2px solid #7c3aed",
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
              <Building2 size={24} style={{ color: "#7c3aed" }} />
              <div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  Upload Firm Images
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "4px 0 0 0",
                  }}
                >
                </p>
              </div>
            </div>

            {/* Multi-Image Upload Area */}
            <div
              style={{
                border: "2px dashed #7c3aed",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                cursor: firmState.loading ? "not-allowed" : "pointer",
                backgroundColor: firmState.loading ? "#7c3aed05" : "#7c3aed08",
                transition: "background-color 0.3s ease",
                opacity: firmState.loading ? 0.7 : 1,
              }}
              onClick={() => !firmState.loading && handleUploadClick("firm")}
              onMouseOver={(e) => {
                if (!firmState.loading) {
                  e.currentTarget.style.backgroundColor = "#7c3aed15";
                }
              }}
              onMouseOut={(e) => {
                if (!firmState.loading) {
                  e.currentTarget.style.backgroundColor = "#7c3aed08";
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFirmImagesChange}
                ref={firmFileInputRef}
                style={{ display: "none" }}
                disabled={firmState.loading}
              />

              {firmState.loading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Loader2
                    className="animate-spin"
                    size={32}
                    style={{ color: "#7c3aed" }}
                  />
                  <p
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    Uploading images...
                  </p>
                  <div className="upload-progress">
                    <div
                      className="upload-progress-bar"
                      style={{ width: `${firmState.uploadProgress}%` }}
                    ></div>
                  </div>
                  <p
                    style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}
                  >
                    {firmState.uploadProgress}% complete
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <ImageIcon size={32} style={{ color: "#7c3aed" }} />
                    <Plus size={20} style={{ color: "#7c3aed" }} />
                  </div>
                  <p
                    style={{
                      marginTop: "8px",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    Click to upload multiple images
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>
                    PNG, JPG, JPEG
                  </p>
                </>
              )}
            </div>

            {/* Images Info */}
            {firmState.files.length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  Total Size:{" "}
                  {(
                    firmState.files.reduce(
                      (total, file) => total + file.size,
                      0
                    ) / 1024
                  ).toFixed(1)}{" "}
                  KB
                </p>
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: firmState.files.length >= 5 ? "#059669" : "#d97706",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {firmState.files.length >= 5 ? (
                    <>
                      <CheckCircle2 size={14} />
                    </>
                  ) : (
                    <>
                      <XCircle size={14} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Image Previews Grid */}
            {firmState.images.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    margin: "0 0 12px 0",
                    color: "#374151",
                  }}
                >
                  Preview ({firmState.images.length} images):
                </h3>
                <div className="image-grid">
                  {firmState.images.map((imageUrl, index) => (
                    <div key={index} className="image-preview">
                      <img src={imageUrl} alt={`Preview ${index + 1}`} />
                      <button
                        className="remove-image"
                        onClick={() => removeFirmImage(index)}
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Department Selection */}
            {firmState.files.length > 0 && (
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
                </label>
                <select
                  value={firmDepartment}
                  onChange={(e) => setFirmDepartment(e.target.value)}
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
            )}

            {/* Error Display */}
            {firmState.error && (
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
                <XCircle size={16} /> {firmState.error}
              </div>
            )}

            {/* Success/Saved State */}
            {firmState.saved && (
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
                {firmState.files.length} images uploaded successfully to{" "}
                {firmDepartment} department!
              </div>
            )}
          </div>
        </div>

        {/* Unified Save & Upload Button */}
        {(documentState.text || firmState.files.length > 0) && (
          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              maxWidth: "900px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <button
              onClick={handleSaveAndUploadAll}
              disabled={
                !extractedPatientName ||
                !extractedReportType ||
                !extractedDate ||
                firmState.files.length === 0
              }
              style={{
                width: "100%",
                marginTop: "12px",
                backgroundColor:
                  !extractedPatientName ||
                  !extractedReportType ||
                  !extractedDate ||
                  firmState.files.length === 0
                    ? "#9ca3af"
                    : "#6b21a8",
                color: "white",
                padding: "12px 16px",
                borderRadius: "6px",
                fontWeight: "500",
                fontSize: "14px",
                border: "none",
                cursor:
                  !extractedPatientName ||
                  !extractedReportType ||
                  !extractedDate ||
                  firmState.files.length === 0
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background-color 0.3s ease",
                opacity:
                  !extractedPatientName ||
                  !extractedReportType ||
                  !extractedDate ||
                  firmState.files.length === 0
                    ? 0.6
                    : 1,
              }}
            >
              <Save size={16} />
              Save & Upload All
              {(!extractedPatientName ||
                !extractedReportType ||
                !extractedDate ||
                firmState.files.length === 0) && (
                <span style={{ fontSize: "12px", marginLeft: "4px" }}>
                  (Fill required fields or upload images)
                </span>
              )}
            </button>
          </div>
        )}

        {/* Saved Reports Preview Table */}
        {savedReports.length > 0 && (
          <div style={{ marginTop: "32px" }}>
          </div>
        )}
      </div>
    </div>
  );
}
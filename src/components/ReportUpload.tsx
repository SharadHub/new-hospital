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

import type { Patient, Report } from "../types";

interface DocumentState {
  file: File | null;
  image: string | null;
  text: string;
  formattedData: any;
  loading: boolean;
  error: string | null;
  saved: boolean;
  savedReport?: Report;  // Store full report for viewing
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

interface DocumentUploadSystemProps {
  patients?: Patient[];
  reports: Report[];
  onAddReport?: (report: Report) => void;
  onViewReportDetails?: (report: Report) => void;
  onAddFirmData?: (firmData: {
    department: string;
    imageUrl: string;
    metadata?: string;
    reportId?: string;
  }) => void;
}

const getDepartmentName = (dept: string) => {
  const names: { [key: string]: string } = {
    ctscan: "CT Scan",
    mri: "MRI",
    ecg: "ECG",
    usg: "USG",
    xray: "X-Ray",
    tmt: "TMT",
    holter: "Holter",
    biopsy: "Biopsy",
    dialysis: "Dialysis",
    mammography: "Mammography",
    dentalxray: "Dental X-Ray",
    eeg: "EEG",
    doppler: "Doppler",
  };
  return names[dept.toLowerCase()] || dept.toUpperCase();
};

export default function DocumentUploadSystem({
  patients = [],
  reports = [],
  onAddReport,
  onViewReportDetails,
  onAddFirmData,
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

  // Firm images upload state
  const [firmState, setFirmState] = useState<FirmImageState>({
    files: [],
    images: [],
    loading: false,
    error: null,
    saved: false,
    uploadProgress: 0,
  });

  // Auto-extracted form fields
  const [documentDepartment, setDocumentDepartment] = useState<string>("ctscan");
  const [firmDepartment, setFirmDepartment] = useState<string>("ctscan");
  const [extractedPatientName, setExtractedPatientName] = useState<string>("");
  const [extractedReportType, setExtractedReportType] = useState<string>("");
  const [extractedDate, setExtractedDate] = useState<string>("");

  const documentFileInputRef = useRef<HTMLInputElement>(null);
  const firmFileInputRef = useRef<HTMLInputElement>(null);

  const departments = [
    "ctscan",
    "mri",
    "ecg",
    "usg",
    "xray",
    "tmt",
    "holter",
    "biopsy",
    "dialysis",
    "mammography",
    "dentalxray",
    "eeg",
    "doppler",
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
    /(?:date\s*[:=\-]?)\s*(\d{4}[\/\.\-]\d{1,2}[\/\.\-]\d{1,2})/i,
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

    // Auto-detect department based on keywords and map to key
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

    const deptKeyMap: { [key: string]: string } = {
      "CT": "ctscan",
      "MRI": "mri",
      "ECG": "ecg",
      "USG": "usg",
      "X-ray": "xray",
      "TMT": "tmt",
      "Holter": "holter",
      "Biopsy": "biopsy",
      "Dialysis": "dialysis",
      "Mammography": "mammography",
      "Dental X-Ray": "dentalxray",
      "EEG": "eeg",
      "Doppler": "doppler",
    };

    // Auto-detect department
    let detectedDept = "";
    for (const [dept, keywords] of Object.entries(departmentKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        detectedDept = dept;
        break;
      }
    }

    if (detectedDept) {
      parsed.autoFilledData.department = deptKeyMap[detectedDept] || detectedDept.toLowerCase();
    }

    // Enhanced report type extraction
    let reportType = "";
    for (const { pattern, type } of reportTypePatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1]) {
          const bodyPart = match[1].trim().replace(/[^\w\s]/g, "");
          reportType = `${type} ${bodyPart}`;
        } else {
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
        .replace(/[\|,:]+$/, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .split(" ")
        .map((w) =>
          w.length === 1 || w.endsWith(".")
            ? w.toUpperCase()
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

        extractedName = extractedName.replace(/\b[A-Z]{1,2}\b$/, "");

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

    // Enhanced date extraction
    let extractedDate = "";
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let dateStr = match[1].trim();

        dateStr = dateStr
          .replace(/[Oo]/g, "0")
          .replace(/[Ss]/g, "5")
          .replace(/[lI]/g, "1");

        try {
          let day: number, month: number, year: number;

          let separator: string;
          if (dateStr.includes("/")) separator = "/";
          else if (dateStr.includes("-")) separator = "-";
          else separator = ".";

          const parts = dateStr.split(separator).map((p) => p.trim());

          if (parts.length === 3) {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);

            if (year < 100) year = year < 50 ? 2000 + year : 1900 + year;

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

  // Document file change handler
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    // REMOVED: if (documentState.image) URL.revokeObjectURL(documentState.image);  // No blob to revoke

    // NEW: Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setDocumentState({
        file,
        image: base64,  // Store base64 string
        text: "",
        formattedData: null,
        loading: true,
        error: null,
        saved: false,
        showFormattedView: false,
        autoScanned: false,
      });
      setTimeout(() => performAutoScan(file, base64), 100);  // Pass base64 to OCR (Tesseract accepts Data URLs)
    };
    reader.readAsDataURL(file);  // Triggers onload
  }
};

const handleFirmImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const files = Array.from(e.target.files);
    console.log("Selected Firm Files:", files.map(f => f.name)); // Log file names
    console.log("Number of Selected Files:", files.length); // Log count of files

    // Revoke old blob URLs if any
    firmState.images.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    // Convert to base64
    const readFiles = (index: number) => {
      if (index >= files.length) {
        setFirmState((prev) => {
          console.log("Final Firm State after File Read:", prev); // Log final state
          return {
            ...prev,
            files,
            loading: false,
            error: null,
            saved: false,
            uploadProgress: 0,
          };
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        console.log(`Base64 Image [${index}]:`, base64.substring(0, 30)); // Log base64 snippet
        setFirmState((prev) => {
          const newImages = [...prev.images, base64];
          console.log(`Updated Images after [${index}]:`, newImages); // Log updated images
          return {
            ...prev,
            images: newImages,
          };
        });
        readFiles(index + 1);
      };
      reader.onerror = (error) => {
        console.error(`FileReader Error for File [${index}]:`, error);
        setFirmState((prev) => ({
          ...prev,
          error: `Failed to read file: ${files[index].name}`,
        }));
        readFiles(index + 1);
      };
      reader.readAsDataURL(files[index]);
    };

    readFiles(0);
  } else {
    console.log("No Files Selected in Firm Images Input");
  }
};

  // Perform auto-scan function
  const performAutoScan = (file: File, imageUrl: string) => {
    Tesseract.recognize(imageUrl, "eng", {
      logger: (m: any) => console.log("Document Auto-Scan:", m),
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:!?-()[]{}/ ",
    })
      .then(({ data: { text } }) => {
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
          `[${getDepartmentName(formattedData.autoFilledData.department || "GENERAL")} DOCUMENT AUTO-SCAN]\n` +
          `File: ${file.name}\n` +
          `Auto-detected Department: ${formattedData.autoFilledData.department || "Not detected"}\n` +
          `Auto-extracted Patient: ${formattedData.autoFilledData.patientName || "Not detected"}\n` +
          `Auto-extracted Report Type: ${formattedData.autoFilledData.reportType || "Not detected"}\n` +
          `Auto-extracted Date: ${formattedData.autoFilledData.date || "Not detected"}\n` +
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
        console.error("OCR Error:", err);
        setDocumentState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to process document. Please try again.",
        }));
      });
  };

  const removeFirmImage = (index: number) => {
    const newFiles = firmState.files.filter((_, i) => i !== index);
    const newImages = firmState.images.filter((_, i) => i !== index);
    setFirmState({ ...firmState, files: newFiles, images: newImages });
  };

  const handleViewDetails = () => {
    if (documentState.savedReport && onViewReportDetails) {
      onViewReportDetails(documentState.savedReport);
    }
  };

  // Unified save and upload handler
  const handleSaveAndUploadAll = () => {
    if (
      !extractedPatientName ||
      !extractedReportType ||
      !extractedDate ||
      !documentState.file ||
      firmState.files.length === 0
    ) {
      setDocumentState((prev) => ({
        ...prev,
        error: "Please fill all required fields, upload a document, and add firm images.",
      }));
      return;
    }
    console.log("Firm Images to be Saved:", firmState.images); // Log base64 images
    console.log("Number of Firm Images:", firmState.images.length);

    // Simulate upload progress for firm images
    setFirmState((prev) => ({ ...prev, loading: true, uploadProgress: 0 }));

    // Simulate async upload
    const simulateUpload = () => {
      const interval = setInterval(() => {
        setFirmState((prev) => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 20, 90),
        }));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setFirmState((prev) => ({ ...prev, uploadProgress: 100, loading: false, saved: true }));

        // Create and save report
        const newId = Date.now().toString();
        const newUploadedAt = new Date().toISOString();
        const serialNumber = reports.length > 0 ? Math.max(...reports.map((r) => r.serialNumber || 0)) + 1 : 1;

        const newReport: Report = {
          id: newId,
          serialNumber,
          patient: extractedPatientName,  
          department: documentDepartment,
          reportType: extractedReportType,
          date: extractedDate,
          doctor: "Dr. Auto-Extracted",  // TODO: Extract from OCR if possible
          uploadedAt: newUploadedAt,
          imageUrl: documentState.image!,
        };

        onAddReport?.(newReport);

        // Add firm data for each image
        firmState.files.forEach((file, index) => {
          const firmData = {
            department: firmDepartment,
            imageUrl: firmState.images[index],
            metadata: `Firm image for ${extractedPatientName} - ${extractedReportType}`,
            reportId: newId,
          };
          onAddFirmData?.(firmData);
        });

        // Update document state
        setDocumentState((prev) => ({
          ...prev,
          saved: true,
          savedReport: newReport,
          error: null,
        }));

        // Reset after 3 seconds
        setTimeout(() => {
          setDocumentState({
            file: null,
            image: null,
            text: "",
            formattedData: null,
            loading: false,
            error: null,
            saved: false,
            savedReport: undefined,
            showFormattedView: false,
            autoScanned: false,
          });
          setFirmState({
            files: [],
            images: [],
            loading: false,
            error: null,
            saved: false,
            uploadProgress: 0,
          });
          setExtractedPatientName("");
          setExtractedReportType("");
          setExtractedDate("");
          setDocumentDepartment("ctscan");
          setFirmDepartment("ctscan");
          if (documentFileInputRef.current) documentFileInputRef.current.value = "";
          if (firmFileInputRef.current) firmFileInputRef.current.value = "";
        }, 3000);
      }, 1000);
    };

    simulateUpload();
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          flexDirection: { xs: "column", md: "row" } as any,
        }}
      >
        {/* Document Upload Block */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            border: "2px solid #3b82f6",
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
            <FileText size={24} style={{ color: "#3b82f6" }} />
            <div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                Upload & Scan Document
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "4px 0 0 0",
                }}
              >
                OCR will auto-extract patient info, date, and report type
              </p>
            </div>
          </div>

          {/* Document Upload Area */}
          <div
            style={{
              border: "2px dashed #3b82f6",
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
              cursor: documentState.loading ? "not-allowed" : "pointer",
              backgroundColor: documentState.loading ? "#3b82f605" : "#3b82f608",
              transition: "background-color 0.3s ease",
              opacity: documentState.loading ? 0.7 : 1,
            }}
            onClick={() => !documentState.loading && documentFileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="image/*, application/pdf, .docx, .doc, .txt"
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
                <Loader2 className="animate-spin" size={32} style={{ color: "#3b82f6" }} />
                <p
                  style={{
                    margin: "0",
                    fontSize: "16px",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  Scanning document...
                </p>
              </div>
            ) : documentState.file ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={documentState.image!}
                  alt="Uploaded document"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <p style={{ margin: "0", fontSize: "14px", color: "#059669" }}>
                  {documentState.file.name} - Ready for scan
                </p>
                {documentState.autoScanned && (
                  <CheckCircle2 size={20} style={{ color: "#059669" }} />
                )}
              </div>
            ) : (
              <>
                <Upload size={32} style={{ color: "#3b82f6" }} />
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Click to upload document image
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>PNG, JPG, JPEG, PDF (converted)</p>
              </>
            )}
          </div>

          {/* Auto-Extracted Form Fields */}
          {documentState.autoScanned && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 16px 0", color: "#374151" }}>
                Auto-Extracted Data
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {/* Patient Name Field */}
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
                    value={documentDepartment}
                    onChange={(e) => setDocumentDepartment(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: "white",
                    }}
                  >
                    {departments.map((deptKey) => (
                      <option key={deptKey} value={deptKey}>
                        {getDepartmentName(deptKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Formatted Text Display */}
          {documentState.formattedData && documentState.showFormattedView && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "16px", margin: "0 0 12px 0", color: "#374151" }}>
                Extracted Text Preview
              </h3>
              <pre
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  border: "1px solid #e5e7eb",
                }}
              >
                {documentState.text.substring(0, 1000)}...
              </pre>
            </div>
          )}

          {/* View Details Button */}
          {documentState.saved && (
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
              Document saved successfully to {getDepartmentName(documentDepartment)} department!
              <br />
              <small>Click "View Details" to see the saved report.</small>
            </div>
          )}
        </div>

        {/* Upload Firm Images Block */}
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
                Add multiple images for firm viewing (linked to report)
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
            onClick={() => !firmState.loading && firmFileInputRef.current?.click()}
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
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#7c3aed",
                      width: `${firmState.uploadProgress}%`,
                      transition: "width 0.3s ease",
                    }}
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
                  PNG, JPG, JPEG (Max 5 recommended)
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
                  color: firmState.files.length >= 1 ? "#059669" : "#d97706",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {firmState.files.length >= 1 ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {firmState.files.length} images selected
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "8px",
                }}
              >
                {firmState.images.map((imageUrl, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={imageUrl}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <button
                      onClick={() => removeFirmImage(index)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                      title="Remove image"
                    >
                      <X size={12} style={{ color: "#ef4444" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department Selection for Firm */}
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
                Firm Department: <span style={{ color: "#ef4444" }}>*</span>
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
                {departments.map((deptKey) => (
                  <option key={deptKey} value={deptKey}>
                    {getDepartmentName(deptKey)}
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
              {getDepartmentName(firmDepartment)} department!
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
              firmState.files.length === 0 ||
              !documentState.file
            }
            style={{
              width: "100%",
              marginTop: "12px",
              backgroundColor:
                !extractedPatientName ||
                !extractedReportType ||
                !extractedDate ||
                firmState.files.length === 0 ||
                !documentState.file
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
                firmState.files.length === 0 ||
                !documentState.file
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
                firmState.files.length === 0 ||
                !documentState.file
                  ? 0.6
                  : 1,
            }}
          >
            <Save size={16} />
            Save & Upload All
            {(!extractedPatientName ||
              !extractedReportType ||
              !extractedDate ||
              firmState.files.length === 0 ||
              !documentState.file) && (
              <span style={{ fontSize: "12px", marginLeft: "4px" }}>
                (Complete all fields and uploads)
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
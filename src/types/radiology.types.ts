// src/types/radiology.types.ts
// Updated to match your existing structure with additions for the enhanced component

export interface PatientInfo {
  name: string;
  fileNumber: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface FacilityInfo {
  name: string;
  address: string;
}

export interface ExaminationDetails {
  examType: string;
  clinicalIndication: string;
  studyDate: string;
  reportDate: string;
  reportingDoctor: string;
}

export interface RadiologyFindings {
  primaryObservations: string[];
  impressions: string[];
  recommendations: string[];
}

export interface ReportMetadata {
  reportType: string;
  bodyRegion: string;
  priority: 'Low' | 'Standard' | 'High' | 'Urgent';
  status: 'Draft' | 'Final Report' | 'Amended';
}

export interface RadiologyReport {
  id: string;
  patientInfo: PatientInfo;
  facilityInfo: FacilityInfo;
  examination: ExaminationDetails;
  findings: RadiologyFindings;
  metadata: ReportMetadata;
  uploadedFile?: File;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UploadedFileInfo {
  file: File;
  url: string;
  type: 'image' | 'pdf' | 'document';
}

// Additional interfaces needed for the enhanced document scanner
export interface ProcessingStatus {
  isProcessing: boolean;
  progress: number;
  stage: 'uploading' | 'extracting' | 'parsing' | 'complete' | 'error';
  message: string;
}

export interface OCRResult {
  patientInfo: Partial<PatientInfo>;
  facilityInfo: Partial<FacilityInfo>;
  examination: Partial<ExaminationDetails>;
  findings: Partial<RadiologyFindings>;
  confidence?: number;
  rawText?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// Type alias to match component expectations (maps your RadiologyFindings to expected Findings)
export type Findings = RadiologyFindings;

// Props interface for the ReportUpload component
export interface ReportUploadProps {
  onReportSubmit?: (report: RadiologyReport) => void;
  onClose?: () => void;
  initialData?: RadiologyReport | null;
  mode?: 'create' | 'edit';
}

// Export all for easy importing
export * from './radiology.types';
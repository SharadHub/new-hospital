export interface Patient {
  id: string;
  name: string;
  department: string;
  number: string;
  createdAt: string;
}

export interface Report {
  id: string;
  serialNumber: number;
  patient: string;
  department: string;  // e.g., "ctscan"
  reportType: string;
  date: string;  // ISO date string
  doctor: string;
  uploadedAt: string;
  extractedText?: string;
  imageUrl?: string;
  firmImages?: string[];  // Optional, if storing directly; but using separate firmData for now
}

export interface DashboardStats {
  totalPatients: number;
  totalReports: number;
  departmentBreakdown: Record<string, number>;
  recentActivity: number;
}

export type Department = 'CT' | 'MRI' | 'ECG' | 'USG' | 'X-ray' | 'TMT' | 'Holter';
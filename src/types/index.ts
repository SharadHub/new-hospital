export interface Patient {
  id: string;
  name: string;
  number: string;
  address: string;
  department: string;
  createdAt: string;
}

export interface Report {
  id: string;
  patientId: string;
  department: string;
  reportType: string;
  reportUrl?: string;
  reportText: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalReports: number;
  departmentBreakdown: Record<string, number>;
  recentActivity: number;
}

export type Department = 'CT' | 'MRI' | 'ECG' | 'USG' | 'X-ray' | 'TMT' | 'Holter';
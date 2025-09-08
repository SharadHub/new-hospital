import { Patient, Report } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    number: 'P001',
    address: '123 Main St, City',
    department: 'CT',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    number: 'P002',
    address: '456 Oak Ave, Town',
    department: 'MRI',
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    number: 'P003',
    address: '789 Pine Rd, Village',
    department: 'X-ray',
    createdAt: '2024-01-16T09:15:00Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    number: 'P004',
    address: '321 Elm St, City',
    department: 'USG',
    createdAt: '2024-01-16T11:45:00Z'
  },
  {
    id: '5',
    name: 'David Wilson',
    number: 'P005',
    address: '654 Maple Dr, Town',
    department: 'ECG',
    createdAt: '2024-01-17T08:30:00Z'
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    patientId: '1',
    department: 'CT',
    reportType: 'CT Scan - Chest',
    reportText: 'Normal chest CT scan. No abnormalities detected. Lungs are clear with no signs of infection or masses.',
    uploadedAt: '2024-01-15T11:00:00Z',
    uploadedBy: 'Dr. Anderson'
  },
  {
    id: '2',
    patientId: '2',
    department: 'MRI',
    reportType: 'MRI - Brain',
    reportText: 'Brain MRI shows normal brain structure. No signs of lesions, tumors, or abnormal findings.',
    uploadedAt: '2024-01-15T15:30:00Z',
    uploadedBy: 'Dr. Martinez'
  },
  {
    id: '3',
    patientId: '3',
    department: 'X-ray',
    reportType: 'X-ray - Chest',
    reportText: 'Chest X-ray reveals clear lung fields. Heart size within normal limits. No acute findings.',
    uploadedAt: '2024-01-16T10:00:00Z',
    uploadedBy: 'Dr. Thompson'
  },
  {
    id: '4',
    patientId: '4',
    department: 'USG',
    reportType: 'Ultrasound - Abdomen',
    reportText: 'Abdominal ultrasound shows normal liver, gallbladder, and kidneys. No stones or masses detected.',
    uploadedAt: '2024-01-16T12:15:00Z',
    uploadedBy: 'Dr. Lee'
  },
  {
    id: '5',
    patientId: '5',
    department: 'ECG',
    reportType: 'ECG - 12 Lead',
    reportText: 'Normal sinus rhythm. Heart rate 72 bpm. No signs of arrhythmia or ischemia.',
    uploadedAt: '2024-01-17T09:00:00Z',
    uploadedBy: 'Dr. Patel'
  }
];
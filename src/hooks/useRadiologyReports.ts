import { useState, useCallback } from 'react';
import { RadiologyReport } from '../types/radiology.types';

export const useRadiologyReports = () => {
  const [reports, setReports] = useState<RadiologyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addReport = useCallback((report: RadiologyReport) => {
    try {
      setLoading(true);
      setError(null);
      setReports(prev => [...prev, report]);
      
      // Optional: Save to localStorage for persistence
      const savedReports = [...JSON.parse(localStorage.getItem('radiologyReports') || '[]'), report];
      localStorage.setItem('radiologyReports', JSON.stringify(savedReports));
      
      console.log('Report added successfully:', report.id);
    } catch (err) {
      setError('Failed to add report');
      console.error('Error adding report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReport = useCallback((id: string, updates: Partial<RadiologyReport>) => {
    try {
      setLoading(true);
      setError(null);
      setReports(prev => prev.map(report => 
        report.id === id 
          ? { ...report, ...updates, updatedAt: new Date() }
          : report
      ));

      // Update localStorage
      const savedReports = JSON.parse(localStorage.getItem('radiologyReports') || '[]');
      const updatedReports = savedReports.map((report: RadiologyReport) => 
        report.id === id ? { ...report, ...updates, updatedAt: new Date() } : report
      );
      localStorage.setItem('radiologyReports', JSON.stringify(updatedReports));
      
    } catch (err) {
      setError('Failed to update report');
      console.error('Error updating report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback((id: string) => {
    try {
      setLoading(true);
      setError(null);
      setReports(prev => prev.filter(report => report.id !== id));
      
      // Update localStorage
      const savedReports = JSON.parse(localStorage.getItem('radiologyReports') || '[]');
      const filteredReports = savedReports.filter((report: RadiologyReport) => report.id !== id);
      localStorage.setItem('radiologyReports', JSON.stringify(filteredReports));
      
    } catch (err) {
      setError('Failed to delete report');
      console.error('Error deleting report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getReport = useCallback((id: string) => {
    return reports.find(report => report.id === id);
  }, [reports]);

  const searchReports = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return reports;
    
    return reports.filter(report =>
      report.patientInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientInfo.fileNumber.includes(searchTerm) ||
      report.examination.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.metadata.bodyRegion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.examination.reportingDoctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports]);

  const filterByStatus = useCallback((status: string) => {
    return reports.filter(report => report.metadata.status === status);
  }, [reports]);

  const filterByPriority = useCallback((priority: string) => {
    return reports.filter(report => report.metadata.priority === priority);
  }, [reports]);

  const loadReportsFromStorage = useCallback(() => {
    try {
      const savedReports = JSON.parse(localStorage.getItem('radiologyReports') || '[]');
      setReports(savedReports);
    } catch (err) {
      console.error('Error loading reports from storage:', err);
      setError('Failed to load saved reports');
    }
  }, []);

  const exportReports = useCallback(() => {
    try {
      const dataStr = JSON.stringify(reports, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `radiology_reports_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export reports');
      console.error('Error exporting reports:', err);
    }
  }, [reports]);

  const getReportStats = useCallback(() => {
    return {
      total: reports.length,
      draft: reports.filter(r => r.metadata.status === 'Draft').length,
      final: reports.filter(r => r.metadata.status === 'Final Report').length,
      amended: reports.filter(r => r.metadata.status === 'Amended').length,
      urgent: reports.filter(r => r.metadata.priority === 'Urgent').length,
      high: reports.filter(r => r.metadata.priority === 'High').length
    };
  }, [reports]);

  return {
    reports,
    loading,
    error,
    addReport,
    updateReport,
    deleteReport,
    getReport,
    searchReports,
    filterByStatus,
    filterByPriority,
    loadReportsFromStorage,
    exportReports,
    getReportStats,
    clearError: () => setError(null)
  };
};
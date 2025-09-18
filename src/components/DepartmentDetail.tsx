"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Eye,
  Image as ImageIcon,
  ArrowLeft,
  X,
  Download,
  Printer,
} from "lucide-react";

interface Report {
  id: string;
  serialNumber?: number;
  patient: string;
  department: string;
  reportType: string;
  date: string;
  doctor?: string;
  uploadedAt: string;
}

interface DepartmentDetailProps {
  department: string;
  onBack: () => void;
  onViewDetails: (report: Report) => void;
  onFirmView: (report: Report) => void;
  reports?: Report[]; // Optional prop for external data
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({
  department,
  onBack,
  onViewDetails,
  onFirmView,
  reports: externalReports,
}) => {
  const [searchName, setSearchName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Mock data - fallback when no external reports provided
  const mockReports: Report[] = [
    {
      id: "1",
      serialNumber: 1,
      patient: "John Doe",
      department: department.toUpperCase(),
      reportType: `${department.toUpperCase()} Report`,
      date: "2024-01-15",
      doctor: "Dr. Smith",
      uploadedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      serialNumber: 2,
      patient: "Jane Smith",
      department: department.toUpperCase(),
      reportType: `${department.toUpperCase()} Report`,
      date: "2024-01-14",
      doctor: "Dr. Johnson",
      uploadedAt: "2024-01-14T14:20:00Z",
    },
    {
      id: "3",
      serialNumber: 3,
      patient: "Mike Wilson",
      department: department.toUpperCase(),
      reportType: `${department.toUpperCase()} Report`,
      date: "2024-01-13",
      doctor: "Dr. Brown",
      uploadedAt: "2024-01-13T09:15:00Z",
    },
  ];

  // Use external reports if provided, otherwise use mock data
  const allReports = externalReports || mockReports;

  // Helper function for safe string matching
  const safeIncludes = (str: string | undefined | null, searchTerm: string): boolean => {
    if (!str || !searchTerm) return false;
    return str.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Clear filters function
  const clearFilters = () => {
    setSearchName("");
    setFromDate("");
    setToDate("");
  };

  // Check if any filters are active
  const hasActiveFilters = searchName || fromDate || toDate;

  // Filter and sort reports with improved error handling
  const filteredReports = useMemo(() => {
    if (!allReports || !Array.isArray(allReports)) return [];

    return allReports
      .filter((r) => {
        // Safe department filter - normalize both sides for comparison
        const reportDept = r.department?.toLowerCase() || "";
        const targetDept = department.toLowerCase();
        return reportDept === targetDept || reportDept === targetDept.replace("-", "");
      })
      .filter((report) => {
        // Safe name filter
        const matchesName = !searchName || safeIncludes(report.patient, searchName);

        // Safe date filters with try-catch
        const matchesFromDate = !fromDate || (() => {
          try {
            return new Date(report.date) >= new Date(fromDate);
          } catch {
            return false;
          }
        })();
        
        const matchesToDate = !toDate || (() => {
          try {
            return new Date(report.date) <= new Date(toDate);
          } catch {
            return false;
          }
        })();

        return matchesName && matchesFromDate && matchesToDate;
      })
      .sort((a, b) => {
        try {
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        } catch {
          return 0;
        }
      });
  }, [allReports, department, searchName, fromDate, toDate]);

  const getDepartmentName = (dept: string) => {
    const names: { [key: string]: string } = {
      // Existing departments
      "ct-scan": "CT Scan",
      ctscan: "CT Scan",
      ct: "CT Scan",
      mri: "MRI",
      ecg: "ECG",
      usg: "USG",
      "x-ray": "X-Ray",
      xray: "X-Ray",
      tmt: "TMT",
      holter: "Holter",
      // New departments
      biopsy: "Biopsy",
      dialysis: "Dialysis",
      mammography: "Mammography",
      "dental-x-ray": "Dental X-Ray",
      "dental-xray": "Dental X-Ray",
      dentalxray: "Dental X-Ray",
      eeg: "EEG",
      eye: "Eye",
      doppler: "Doppler",
    };
    return names[dept.toLowerCase()] || dept.toUpperCase();
  };

  // Format date for display (M/D/YYYY format)
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return "Invalid Date";
    }
  };

  // Export to Excel function with proper formatting
  const exportToExcel = () => {
    const formatDateForExcel = (dateString: string) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      } catch {
        return "Invalid Date";
      }
    };

    const headers = [
      "S.N",
      "Patient Name",
      "Department",
      "Report Type",
      "Report Date",
        ];

    const dataRows = filteredReports.map((report, index) => {
      const formattedDate = formatDateForExcel(report.date);
      return [
        report.serialNumber || (index + 1),
        `"${report.patient || "Unknown Patient"}"`,
        `"${getDepartmentName(report.department || "")}"`,
        `"${report.reportType || "Unknown"}"`,
        formattedDate,
      ];
    });

    const csvContent = [
      headers.map((header) => `"${header}"`).join(","),
      ...dataRows.map((row) => row.join(",")),
    ].join("\r\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const fileName = `${getDepartmentName(department)}_Reports_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.setAttribute("download", fileName);

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print function
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${getDepartmentName(department)} Reports</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1e293b; text-align: center; margin-bottom: 30px; }
          .report-info { margin-bottom: 20px; }
          .report-info p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .print-date { text-align: right; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${getDepartmentName(department)} Reports</h1>
        <div class="report-info">
          ${
            searchName
              ? `<p><strong>Patient Filter:</strong> ${searchName}</p>`
              : ""
          }
          ${
            fromDate
              ? `<p><strong>From Date:</strong> ${formatDisplayDate(fromDate)}</p>`
              : ""
          }
          ${
            toDate
              ? `<p><strong>To Date:</strong> ${formatDisplayDate(toDate)}</p>`
              : ""
          }
          <p><strong>Total Records:</strong> ${filteredReports.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Patient</th>
              <th>Department</th>
              <th>Report Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredReports
              .map(
                (report, index) => `
              <tr>
                <td>${report.serialNumber || (index + 1)}</td>
                <td>${report.patient || "Unknown Patient"}</td>
                <td>${getDepartmentName(report.department || "")}</td>
                <td>${report.reportType || "Unknown"}</td>
                <td>${formatDisplayDate(report.date)}</td>
                <td>${report.doctor || "Unknown Doctor"}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="print-date">
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="department-detail">
      <style>{`
        .department-detail {
          background: #f8fafc;
          min-height: 100vh;
          padding: 2rem;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: #2563eb;
        }

        .detail-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }

        /* Search section matching the image design */
        .search-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .search-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .search-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }

        .header-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .clear-filters-btn {
          font-size: 0.875rem;
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 0.2s;
          padding: 0.5rem;
          border-radius: 4px;
        }

        .clear-filters-btn:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .export-print-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .export-btn, .print-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .export-btn {
          background: #10b981;
          color: white;
        }

        .export-btn:hover {
          background: #059669;
        }

        .print-btn {
          background: #f59e0b;
          color: white;
        }

        .print-btn:hover {
          background: #d97706;
        }

        .search-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 1rem;
          align-items: end;
        }

        .search-field {
          display: flex;
          flex-direction: column;
        }

        .search-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .search-input {
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          transition: background 0.2s;
        }

        .search-button:hover {
          background: #2563eb;
        }

        /* Simple table section */
        .table-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-container {
          overflow-x: auto;
        }

        .reports-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: #f1f5f9;
          border-bottom: 2px solid #e2e8f0;
        }

        .table-header th {
          padding: 1rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          border-right: 1px solid #e2e8f0;
        }

        .table-header th:last-child {
          border-right: none;
        }

        .table-row {
          border-bottom: 1px solid #e2e8f0;
          transition: background 0.2s;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .table-cell {
          padding: 1rem;
          font-size: 0.875rem;
          color: #374151;
          border-right: 1px solid #e2e8f0;
        }

        .table-cell:last-child {
          border-right: none;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        .action-button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .action-button.view-details {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .action-button.view-details:hover {
          background: #eff6ff;
        }

        .action-button.firm-view {
          border-color: #10b981;
          color: #10b981;
        }

        .action-button.firm-view:hover {
          background: #ecfdf5;
        }

        .no-reports {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          font-size: 1rem;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .department-detail {
            padding: 1rem;
          }

          .search-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .search-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-buttons {
            width: 100%;
            justify-content: space-between;
          }

          .export-print-buttons {
            flex-wrap: wrap;
          }

          .table-container {
            font-size: 0.75rem;
          }

          .table-header th,
          .table-cell {
            padding: 0.75rem 0.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="detail-title">
          {getDepartmentName(department)} Reports
        </h1>
      </div>

      <div className="search-section">
        <div className="search-header">
          <h3 className="search-title">
            <Search size={20} color="#2563eb" />
            Search & Filter Reports
          </h3>
          <div className="header-buttons">
            <div className="export-print-buttons">
              <button onClick={exportToExcel} className="export-btn">
                <Download size={16} />
                Export Excel
              </button>
              <button onClick={handlePrint} className="print-btn">
                <Printer size={16} />
                Print
              </button>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters-btn">
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="search-grid">
          <div className="search-field">
            <label className="search-label">Patient Name</label>
            <input
              type="text"
              className="search-input"
              placeholder="Enter patient name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="search-field">
            <label className="search-label">From Date</label>
            <input
              type="date"
              className="search-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="search-field">
            <label className="search-label">To Date</label>
            <input
              type="date"
              className="search-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button className="search-button">
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      <div className="table-section">
        <div className="table-container">
          {filteredReports.length === 0 ? (
            <div className="no-reports">
              No reports found matching the criteria.
            </div>
          ) : (
            <table className="reports-table">
              <thead className="table-header">
                <tr>
                  <th>S.N</th>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Report Type</th>
                  <th>Date</th>
                  <th>View Details</th>
                  <th>Firm Viewing</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr key={report.id} className="table-row">
                    <td className="table-cell">{report.serialNumber || (index + 1)}</td>
                    <td className="table-cell">{report.patient || "Unknown Patient"}</td>
                    <td className="table-cell">{getDepartmentName(report.department || "")}</td>
                    <td className="table-cell">{report.reportType || "Unknown"}</td>
                    <td className="table-cell">{formatDisplayDate(report.date)}</td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button
                          className="action-button view-details"
                          onClick={() => onViewDetails(report)}
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button
                          className="action-button firm-view"
                          onClick={() => onFirmView(report)}
                        >
                          <ImageIcon size={14} />
                          Firm View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
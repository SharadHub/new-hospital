;import React, { useState } from "react";
import { ArrowLeft, Search, Eye, FileImage } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  number: string;
}

interface Report {
  id: string;
  patientId: string;
  department: string;
  reportType: string;
  uploadedAt: string;
  uploadedBy: string;
  reportText: string;
  reportUrl?: string;
}

interface ReportsListingProps {
  patients: Patient[];
  reports: Report[];
  initialDepartmentFilter?: string;
  onBackToDepartments?: () => void;
}

const ReportsListing: React.FC<ReportsListingProps> = ({
  patients,
  reports,
  initialDepartmentFilter = "",
  onBackToDepartments,
}) => {
  const [selectedDepartment] = useState<string>(initialDepartmentFilter);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredReports, setFilteredReports] = useState(reports);

  const handleSearch = () => {
    let filtered = reports.filter((report) =>
      selectedDepartment ? report.department === selectedDepartment : true
    );

    if (fromDate) {
      filtered = filtered.filter(
        (report) => new Date(report.uploadedAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (report) => new Date(report.uploadedAt) <= new Date(toDate)
      );
    }

    setFilteredReports(filtered);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setFilteredReports(
      reports.filter((report) =>
        selectedDepartment ? report.department === selectedDepartment : true
      )
    );
  };

  const handleViewDetails = (report: Report) => {
    console.log("View Details:", report);
    // Add your view details logic here
  };

  const handleFirmView = (report: Report) => {
    console.log("Firm View:", report);
    // Add your firm view logic here
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <style>{`
        .table-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .header-section {
          background: #f8f9fa;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #4285f4;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #3367d6;
        }

        .title-text {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .search-section {
          display: grid;
          grid-template-columns: 1fr 1fr auto auto;
          gap: 15px;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }

        .form-input {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #4285f4;
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .search-button:hover {
          background: #3367d6;
        }

        .reset-button {
          padding: 10px 16px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .reset-button:hover {
          background: #5a6268;
        }

        .table-section {
          overflow-x: auto;
        }

        .reports-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .table-header {
          background: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
        }

        .table-header th {
          padding: 15px 12px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          white-space: nowrap;
        }

        .table-body tr {
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s;
        }

        .table-body tr:hover {
          background-color: #f8f9fa;
        }

        .table-body td {
          padding: 12px;
          vertical-align: middle;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .view-details-button {
          background: #4285f4;
          color: white;
        }

        .view-details-button:hover {
          background: #3367d6;
        }

        .firm-view-button {
          background: #34a853;
          color: white;
        }

        .firm-view-button:hover {
          background: #2d8f47;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .no-results-icon {
          width: 48px;
          height: 48px;
          color: #adb5bd;
          margin: 0 auto 16px auto;
        }

        @media (max-width: 768px) {
          .search-section {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .table-section {
            font-size: 12px;
          }

          .table-header th,
          .table-body td {
            padding: 8px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 4px;
          }

          .action-button {
            font-size: 11px;
            padding: 4px 8px;
          }
        }
      `}</style>

      <div className="table-container">
        <div className="header-section">
          <div className="page-title">
            <button className="back-button" onClick={onBackToDepartments}>
              <ArrowLeft size={16} />
              Back to Departments
            </button>
            <h1 className="title-text">
              {selectedDepartment || "All"} Reports
            </h1>
          </div>

          <div className="search-section">
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button className="search-button" onClick={handleSearch}>
              <Search size={16} />
              Search
            </button>

            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <div className="table-section">
          {filteredReports.length === 0 ? (
            <div className="no-results">
              <FileImage className="no-results-icon" />
              <h3>No reports found</h3>
              <p>No reports match your search criteria</p>
            </div>
          ) : (
            <table className="reports-table">
              <thead className="table-header">
                <tr>
                  <th>S.N</th>
                  <th>View Details</th>
                  <th>Firm Viewing</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredReports.map((report, index) => (
                  <tr key={report.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button view-details-button"
                          onClick={() => handleViewDetails(report)}
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button firm-view-button"
                          onClick={() => handleFirmView(report)}
                        >
                          <FileImage size={14} />
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

export default ReportsListing;

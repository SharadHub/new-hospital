import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  FileText,
  X,
} from "lucide-react";
import { Patient, Report } from "../types";

interface SearchFilterProps {
  patients: Patient[];
  reports: Report[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({ patients, reports }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState<"patients" | "reports">(
    "patients"
  );

  const departments = ["CT", "MRI", "ECG", "USG", "X-ray", "TMT", "Holter"];

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        searchTerm === "" ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "" || patient.department === selectedDepartment;

      const matchesDateRange = (() => {
        if (!dateFrom && !dateTo) return true;
        const patientDate = new Date(patient.createdAt);
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;

        if (fromDate && toDate) {
          return patientDate >= fromDate && patientDate <= toDate;
        } else if (fromDate) {
          return patientDate >= fromDate;
        } else if (toDate) {
          return patientDate <= toDate;
        }
        return true;
      })();

      return matchesSearch && matchesDepartment && matchesDateRange;
    });
  }, [patients, searchTerm, selectedDepartment, dateFrom, dateTo]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const patient = patients.find((p) => p.id === report.patientId);

      const matchesSearch =
        searchTerm === "" ||
        (patient &&
          patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (patient &&
          patient.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "" || report.department === selectedDepartment;

      const matchesDateRange = (() => {
        if (!dateFrom && !dateTo) return true;
        const reportDate = new Date(report.uploadedAt);
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;

        if (fromDate && toDate) {
          return reportDate >= fromDate && reportDate <= toDate;
        } else if (fromDate) {
          return reportDate >= fromDate;
        } else if (toDate) {
          return reportDate <= toDate;
        }
        return true;
      })();

      return matchesSearch && matchesDepartment && matchesDateRange;
    });
  }, [reports, patients, searchTerm, selectedDepartment, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    searchTerm || selectedDepartment || dateFrom || dateTo;

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  const getPatientNumber = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.number : "N/A";
  };

  return (
    <div className="background-container">
      <div className="search-filter">
        <style>{`
          .background-container {
            background: linear-gradient(135deg, #3b82f6 0%, #93c5fd 25%, #ffffff 50%, #dbeafe 75%, #1e40af 100%);
            min-height: 100vh;
            padding: 1rem;
          }

          .search-filter {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .filter-section {
            background-color: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            padding: 1.5rem;
          }

          .filter-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
          }

          .filter-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0;
          }

          .clear-filters {
            font-size: 0.875rem;
            color: #6b7280;
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            transition: color 0.2s;
          }

          .clear-filters:hover {
            color: #374151;
          }

          .filter-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .filter-group {
            display: flex;
            flex-direction: column;
          }

          .filter-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
          }

          .search-input-wrapper {
            position: relative;
          }

          .search-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
          }

          .search-input {
            width: 100%;
            padding: 0.5rem 0.75rem 0.5rem 2.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s;
            box-sizing: border-box;
          }

          .search-input:focus {
            outline: none;
            ring: 2px solid #3b82f6;
            border-color: transparent;
          }

          .filter-select,
          .filter-date {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s;
            background-color: white;
            box-sizing: border-box;
          }

          .filter-select:focus,
          .filter-date:focus {
            outline: none;
            ring: 2px solid #3b82f6;
            border-color: transparent;
          }

          .results-section {
            background-color: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            overflow: hidden;
          }

          .tab-navigation {
            border-bottom: 1px solid #e5e7eb;
          }

          .tab-nav {
            display: flex;
          }

          .tab-button {
            padding: 1rem 1.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-bottom: 2px solid transparent;
            background: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .tab-button.active {
            border-bottom-color: #3b82f6;
            color: #2563eb;
            background-color: #eff6ff;
          }

          .tab-button.inactive {
            color: #6b7280;
          }

          .tab-button.inactive:hover {
            color: #374151;
            border-bottom-color: #d1d5db;
          }

          .results-content {
            padding: 1.5rem;
          }

          .empty-state {
            text-align: center;
            padding: 3rem 0;
          }

          .empty-state-icon {
            width: 3rem;
            height: 3rem;
            color: #9ca3af;
            margin: 0 auto 1rem auto;
          }

          .empty-state-title {
            font-size: 1.125rem;
            font-weight: 500;
            color: #111827;
            margin: 0 0 0.5rem 0;
          }

          .empty-state-text {
            color: #6b7280;
            margin: 0;
          }

          .patients-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .patient-card {
            background-color: #f9fafb;
            border-radius: 0.5rem;
            padding: 1rem;
            transition: background-color 0.2s;
          }

          .patient-card:hover {
            background-color: #f3f4f6;
          }

          .patient-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 0.75rem;
          }

          .patient-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .patient-details {
            min-width: 0;
          }

          .patient-name {
            font-weight: 500;
            color: #111827;
            margin: 0;
            font-size: 0.875rem;
          }

          .patient-number {
            font-size: 0.75rem;
            color: #6b7280;
            margin: 0;
          }

          .department-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.125rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            background-color: #dbeafe;
            color: #1e40af;
            flex-shrink: 0;
          }

          .patient-address {
            font-size: 0.75rem;
            color: #6b7280;
            margin: 0 0 0.5rem 0;
          }

          .patient-date {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.75rem;
            color: #6b7280;
          }

          .reports-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .report-card {
            background-color: #f9fafb;
            border-radius: 0.5rem;
            padding: 1rem;
            transition: background-color 0.2s;
          }

          .report-card:hover {
            background-color: #f3f4f6;
          }

          .report-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 0.75rem;
          }

          .report-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .report-details {
            min-width: 0;
          }

          .report-type {
            font-weight: 500;
            color: #111827;
            margin: 0;
            font-size: 0.875rem;
          }

          .report-patient {
            font-size: 0.75rem;
            color: #6b7280;
            margin: 0;
          }

          .report-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.125rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            background-color: #dcfce7;
            color: #166534;
            flex-shrink: 0;
          }

          .report-text {
            font-size: 0.75rem;
            color: #6b7280;
            margin: 0 0 0.75rem 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .report-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #6b7280;
          }

          .report-date {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .report-doctor {
            font-size: 0.75rem;
            color: #6b7280;
          }

          @media (min-width: 640px) {
            .background-container {
              padding: 1.5rem;
            }

            .filter-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .patients-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .tab-button {
              padding: 1rem 1.5rem;
            }
          }

          @media (min-width: 768px) {
            .filter-grid {
              grid-template-columns: repeat(4, 1fr);
            }

            .patients-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .patients-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}</style>

        {/* Search and Filter Controls */}
        <div className="filter-section">
          <div className="filter-header">
            <h3 className="filter-title">
              <Search size={20} color="#2563eb" />
              Search & Filter
            </h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters">
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>

          <div className="filter-grid">
            {/* Search Input */}
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <div className="search-input-wrapper">
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, number, or address..."
                  className="search-input"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="filter-group">
              <label className="filter-label">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div className="filter-group">
              <label className="filter-label">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="filter-date"
              />
            </div>

            {/* Date To */}
            <div className="filter-group">
              <label className="filter-label">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="filter-date"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="results-section">
          <div className="tab-navigation">
            <nav className="tab-nav">
              <button
                onClick={() => setActiveTab("patients")}
                className={`tab-button ${
                  activeTab === "patients" ? "active" : "inactive"
                }`}
              >
                <User size={16} />
                Patients ({filteredPatients.length})
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`tab-button ${
                  activeTab === "reports" ? "active" : "inactive"
                }`}
              >
                <FileText size={16} />
                Reports ({filteredReports.length})
              </button>
            </nav>
          </div>

          {/* Results */}
          <div className="results-content">
            {activeTab === "patients" ? (
              <div>
                {filteredPatients.length === 0 ? (
                  <div className="empty-state">
                    <User className="empty-state-icon" size={48} />
                    <h3 className="empty-state-title">No patients found</h3>
                    <p className="empty-state-text">
                      Try adjusting your search criteria
                    </p>
                  </div>
                ) : (
                  <div className="patients-grid">
                    {filteredPatients.map((patient) => (
                      <div key={patient.id} className="patient-card">
                        <div className="patient-header">
                          <div className="patient-info">
                            <User size={20} color="#9ca3af" />
                            <div className="patient-details">
                              <h4 className="patient-name">{patient.name}</h4>
                              <p className="patient-number">{patient.number}</p>
                            </div>
                          </div>
                          <span className="department-badge">
                            {patient.department}
                          </span>
                        </div>
                        <p className="patient-address">{patient.address}</p>
                        <div className="patient-date">
                          <Calendar size={12} />
                          Registered:{" "}
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {filteredReports.length === 0 ? (
                  <div className="empty-state">
                    <FileText className="empty-state-icon" size={48} />
                    <h3 className="empty-state-title">No reports found</h3>
                    <p className="empty-state-text">
                      Try adjusting your search criteria
                    </p>
                  </div>
                ) : (
                  <div className="reports-list">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="report-card">
                        <div className="report-header">
                          <div className="report-info">
                            <FileText size={20} color="#9ca3af" />
                            <div className="report-details">
                              <h4 className="report-type">
                                {report.reportType}
                              </h4>
                              <p className="report-patient">
                                {getPatientName(report.patientId)} (
                                {getPatientNumber(report.patientId)})
                              </p>
                            </div>
                          </div>
                          <span className="report-badge">
                            {report.department}
                          </span>
                        </div>
                        <p className="report-text">{report.reportText}</p>
                        <div className="report-footer">
                          <div className="report-date">
                            <Calendar size={12} />
                            {new Date(report.uploadedAt).toLocaleDateString()}
                          </div>
                          <div className="report-doctor">
                            By: {report.uploadedBy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;

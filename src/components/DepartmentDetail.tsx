// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Search, Eye, ImageIcon, ArrowLeft } from "lucide-react"

// interface Report {
//   id: string
//   serialNumber: number
//   patient: string
//   department: string
//   reportType: string
//   date: string
//   doctor: string
//   uploadedAt: string
// }

// interface DepartmentDetailProps {
//   department: string
//   onBack: () => void
//   onViewDetails: (report: Report) => void
//   onFirmView: (report: Report) => void
// }

// const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ department, onBack, onViewDetails, onFirmView }) => {
//   const [searchName, setSearchName] = useState("")
//   const [fromDate, setFromDate] = useState("")
//   const [toDate, setToDate] = useState("")

//   // Mock data - replace with actual API call
//   const mockReports: Report[] = [
//     {
//       id: "1",
//       serialNumber: 1,
//       patient: "John Doe",
//       department: department.toUpperCase(),
//       reportType: `${department.toUpperCase()} Report`,
//       date: "2024-01-15",
//       doctor: "Dr. Smith",
//       uploadedAt: "2024-01-15T10:30:00Z",
//     },
//     {
//       id: "2",
//       serialNumber: 2,
//       patient: "Jane Smith",
//       department: department.toUpperCase(),
//       reportType: `${department.toUpperCase()} Report`,
//       date: "2024-01-14",
//       doctor: "Dr. Johnson",
//       uploadedAt: "2024-01-14T14:20:00Z",
//     },
//     {
//       id: "3",
//       serialNumber: 3,
//       patient: "Mike Wilson",
//       department: department.toUpperCase(),
//       reportType: `${department.toUpperCase()} Report`,
//       date: "2024-01-13",
//       doctor: "Dr. Brown",
//       uploadedAt: "2024-01-13T09:15:00Z",
//     },
//   ]

//   // Filter and sort reports (LIFO - latest first)
//   const filteredReports = mockReports
//     .filter((report) => {
//       const matchesName = !searchName || report.patient.toLowerCase().includes(searchName.toLowerCase())
//       const matchesFromDate = !fromDate || new Date(report.date) >= new Date(fromDate)
//       const matchesToDate = !toDate || new Date(report.date) <= new Date(toDate)
//       return matchesName && matchesFromDate && matchesToDate
//     })
//     .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

//   const getDepartmentName = (dept: string) => {
//     const names: { [key: string]: string } = {
//       "ct-scan": "CT Scan",
//       mri: "MRI",
//       ecg: "ECG",
//       usg: "USG",
//       "x-ray": "X-Ray",
//       tmt: "TMT",
//       holter: "Holter",
//     }
//     return names[dept] || dept.toUpperCase()
//   }

//   return (
//     <div className="department-detail">
//       <style>{`
//         .department-detail {
//           background: #f8fafc;
//           min-height: 100vh;
//           padding: 2rem;
//         }

//         .detail-header {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           margin-bottom: 2rem;
//         }

//         .back-button {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           background: #3b82f6;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 0.875rem;
//           transition: background 0.2s;
//         }

//         .back-button:hover {
//           background: #2563eb;
//         }

//         .detail-title {
//           font-size: 2rem;
//           font-weight: bold;
//           color: #1e293b;
//           margin: 0;
//         }

//         /* Search section matching the sketch design */
//         .search-section {
//           background: white;
//           padding: 1.5rem;
//           border-radius: 12px;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           margin-bottom: 2rem;
//         }

//         .search-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr 1fr auto;
//           gap: 1rem;
//           align-items: end;
//         }

//         .search-field {
//           display: flex;
//           flex-direction: column;
//         }

//         .search-label {
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: #374151;
//           margin-bottom: 0.5rem;
//         }

//         .search-input {
//           padding: 0.75rem;
//           border: 2px solid #e5e7eb;
//           border-radius: 8px;
//           font-size: 0.875rem;
//           transition: border-color 0.2s;
//         }

//         .search-input:focus {
//           outline: none;
//           border-color: #3b82f6;
//         }

//         .search-button {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.75rem 1.5rem;
//           background: #3b82f6;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 0.875rem;
//           font-weight: 600;
//           transition: background 0.2s;
//         }

//         .search-button:hover {
//           background: #2563eb;
//         }

//         /* Table section matching the sketch layout */
//         .table-section {
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           overflow: hidden;
//         }

//         .table-container {
//           overflow-x: auto;
//         }

//         .reports-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .table-header {
//           background: #f1f5f9;
//           border-bottom: 2px solid #e2e8f0;
//         }

//         .table-header th {
//           padding: 1rem;
//           text-align: left;
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: #374151;
//           border-right: 1px solid #e2e8f0;
//         }

//         .table-header th:last-child {
//           border-right: none;
//         }

//         .table-row {
//           border-bottom: 1px solid #e2e8f0;
//           transition: background 0.2s;
//         }

//         .table-row:hover {
//           background: #f8fafc;
//         }

//         .table-cell {
//           padding: 1rem;
//           font-size: 0.875rem;
//           color: #374151;
//           border-right: 1px solid #e2e8f0;
//         }

//         .table-cell:last-child {
//           border-right: none;
//         }

//         .action-buttons {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .action-button {
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//           padding: 0.5rem 0.75rem;
//           border: 1px solid #d1d5db;
//           border-radius: 6px;
//           background: white;
//           color: #374151;
//           cursor: pointer;
//           font-size: 0.75rem;
//           transition: all 0.2s;
//         }

//         .action-button:hover {
//           background: #f3f4f6;
//           border-color: #9ca3af;
//         }

//         .action-button.view-details {
//           border-color: #3b82f6;
//           color: #3b82f6;
//         }

//         .action-button.view-details:hover {
//           background: #eff6ff;
//         }

//         .action-button.firm-view {
//           border-color: #10b981;
//           color: #10b981;
//         }

//         .action-button.firm-view:hover {
//           background: #ecfdf5;
//         }

//         /* Responsive design */
//         @media (max-width: 768px) {
//           .department-detail {
//             padding: 1rem;
//           }

//           .search-grid {
//             grid-template-columns: 1fr;
//             gap: 1rem;
//           }

//           .table-container {
//             font-size: 0.75rem;
//           }

//           .table-header th,
//           .table-cell {
//             padding: 0.75rem 0.5rem;
//           }

//           .action-buttons {
//             flex-direction: column;
//           }
//         }
//       `}</style>

//       <div className="detail-header">
//         <button className="back-button" onClick={onBack}>
//           <ArrowLeft size={16} />
//           Back to Departments
//         </button>
//         <h1 className="detail-title">{getDepartmentName(department)} Reports</h1>
//       </div>

//       <div className="search-section">
//         <div className="search-grid">
//           <div className="search-field">
//             <label className="search-label">Patient Name</label>
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Enter patient name"
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//             />
//           </div>
//           <div className="search-field">
//             <label className="search-label">From Date</label>
//             <input
//               type="date"
//               className="search-input"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div>
//           <div className="search-field">
//             <label className="search-label">To Date</label>
//             <input type="date" className="search-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//           </div>
//           <button className="search-button">
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>

//       <div className="table-section">
//         <div className="table-container">
//           <table className="reports-table">
//             <thead className="table-header">
//               <tr>
//                 <th>S.N</th>
//                 <th>Patient</th>
//                 <th>Department</th>
//                 <th>Report Type</th>
//                 <th>Date</th>
//                 <th>Doctor</th>
//                 <th>View Details</th>
//                 <th>Firm Viewing</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReports.map((report) => (
//                 <tr key={report.id} className="table-row">
//                   <td className="table-cell">{report.serialNumber}</td>
//                   <td className="table-cell">{report.patient}</td>
//                   <td className="table-cell">{report.department}</td>
//                   <td className="table-cell">{report.reportType}</td>
//                   <td className="table-cell">{new Date(report.date).toLocaleDateString()}</td>
//                   <td className="table-cell">{report.doctor}</td>
//                   <td className="table-cell">
//                     <div className="action-buttons">
//                       <button className="action-button view-details" onClick={() => onViewDetails(report)}>
//                         <Eye size={14} />
//                         View Details
//                       </button>
//                     </div>
//                   </td>
//                   <td className="table-cell">
//                     <div className="action-buttons">
//                       <button className="action-button firm-view" onClick={() => onFirmView(report)}>
//                         <ImageIcon size={14} />
//                         Firm View
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DepartmentDetail
"use client";

import type React from "react";
import { useState } from "react";
import { Search, Eye, ImageIcon, ArrowLeft } from "lucide-react";

interface Report {
  id: string;
  serialNumber: number;
  patient: string;
  department: string;
  reportType: string;
  date: string;
  doctor: string;
  uploadedAt: string;
}

interface DepartmentDetailProps {
  department: string;
  onBack: () => void;
  onViewDetails: (report: Report) => void;
  onFirmView: (report: Report) => void;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({
  department,
  onBack,
  onViewDetails,
  onFirmView,
}) => {
  const [searchName, setSearchName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Mock data - replace with actual API call
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

  // Filter and sort reports (LIFO - latest first)
  const filteredReports = mockReports
    .filter((report) => {
      const matchesName =
        !searchName ||
        report.patient.toLowerCase().includes(searchName.toLowerCase());
      const matchesFromDate =
        !fromDate || new Date(report.date) >= new Date(fromDate);
      const matchesToDate =
        !toDate || new Date(report.date) <= new Date(toDate);
      return matchesName && matchesFromDate && matchesToDate;
    })
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

  const getDepartmentName = (dept: string) => {
    const names: { [key: string]: string } = {
      // Existing departments
      "ct-scan": "CT Scan",
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
      nmography: "Mammography", // In case the original typo is used
      "dental-x-ray": "Dental X-Ray",
      "dental-xray": "Dental X-Ray",
      dentalxray: "Dental X-Ray",
      eeg: "EEG",
      exe: "EEG", // In case the original typo is used
      doppler: "Doppler",
      dopler: "Doppler", // In case the original typo is used
    };
    return names[dept.toLowerCase()] || dept.toUpperCase();
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

        /* Search section matching the sketch design */
        .search-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
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

        /* Table section matching the sketch layout */
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

        /* Responsive design */
        @media (max-width: 768px) {
          .department-detail {
            padding: 1rem;
          }

          .search-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
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
          Back to Departments
        </button>
        <h1 className="detail-title">
          {getDepartmentName(department)} Reports
        </h1>
      </div>

      <div className="search-section">
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
              {filteredReports.map((report) => (
                <tr key={report.id} className="table-row">
                  <td className="table-cell">{report.serialNumber}</td>
                  <td className="table-cell">{report.patient}</td>
                  <td className="table-cell">{report.department}</td>
                  <td className="table-cell">{report.reportType}</td>
                  <td className="table-cell">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
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
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;

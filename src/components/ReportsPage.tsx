"use client"

import type React from "react"
import { Plus } from "lucide-react"

interface ReportsPageProps {
  onDepartmentSelect?: (department: string) => void
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onDepartmentSelect }) => {
  const departments = [
    { name: "X-Ray", color: "border-red-400" },
    { name: "USG", color: "border-purple-400" },
    { name: "ECG", color: "border-orange-400" },
    { name: "CT Scan", color: "border-blue-400" },
    { name: "MRI", color: "border-green-400" },
    { name: "TMT", color: "border-cyan-400" },
    { name: "Holter", color: "border-lime-400" },
    { name: "Biopsy", color: "border-red-400" },
    { name: "Dialysis", color: "border-cyan-400" },
    { name: "Mammography", color: "border-pink-400" },
    { name: "Dental X-Ray", color: "border-green-400" },
    { name: "Eye", color: "border-yellow-400" },
    { name: "Doppler", color: "border-indigo-400" },
  ]

  const handleDepartmentClick = (departmentName: string) => {
    if (onDepartmentSelect) {
      onDepartmentSelect(departmentName.toLowerCase().replace(/[\s-]/g, ""))
    }
  }

  return (
    <div className="reports-page">
      <style>{`
        .reports-page {
          padding: 2rem;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .reports-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .reports-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .reports-subtitle {
          font-size: 1.125rem;
          color: #64748b;
        }

        .departments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .department-card {
          background: white;
          border-radius: 12px;
          border-top: 4px solid;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }

        .department-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        }

        .card-content {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .department-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .department-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .plus-icon-container {
          width: 40px;
          height: 40px;
          background-color: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .plus-icon {
          color: white;
        }

        @media (max-width: 768px) {
          .reports-page {
            padding: 1rem;
          }

          .reports-title {
            font-size: 2rem;
          }

          .departments-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .card-content {
            padding: 1rem;
          }

          .department-name {
            font-size: 1.125rem;
          }
        }
      `}</style>

      <div className="reports-header">
        <h1 className="reports-title">Reports Departments</h1>
        <p className="reports-subtitle">Select a department to view reports and firm listings</p>
      </div>

      <div className="departments-grid">
        {departments.map((department, index) => (
          <div
            key={index}
            className={`department-card ${department.color}`}
            onClick={() => handleDepartmentClick(department.name)}
          >
            <div className="card-content">
              <div className="department-info">
                <span className="department-name">{department.name}</span>
              </div>
              <div className="plus-icon-container">
                <Plus size={20} className="plus-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportsPage

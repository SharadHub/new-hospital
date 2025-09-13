"use client"

import type React from "react"
import { Activity, Zap, Heart, Waves, Bone, TrendingUp, Clock } from "lucide-react"

interface ReportsMainProps {
  onDepartmentSelect: (department: string) => void
}

const ReportsMain: React.FC<ReportsMainProps> = ({ onDepartmentSelect }) => {
  const departments = [
    { id: "ct-scan", name: "CT Scan", color: "#3b82f6", icon: Activity },
    { id: "mri", name: "MRI", color: "#10b981", icon: Zap },
    { id: "ecg", name: "ECG", color: "#f59e0b", icon: Heart },
    { id: "usg", name: "USG", color: "#8b5cf6", icon: Waves },
    { id: "x-ray", name: "X-Ray", color: "#ef4444", icon: Bone },
    { id: "tmt", name: "TMT", color: "#06b6d4", icon: TrendingUp },
    { id: "holter", name: "Holter", color: "#84cc16", icon: Clock },
  ]

  return (
    <div className="reports-main">
      <style>{`
        .reports-main {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .reports-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .reports-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1e293b;
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(30, 41, 59, 0.1);
        }

        .reports-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0;
        }

        .departments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 800px;
          width: 100%;
        }

        /* Updated department cards to professional rectangular design with circle inside */
        .department-card {
          width: 200px;
          height: 140px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .department-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: var(--dept-color);
        }

        .department-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--dept-color);
        }

        .department-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--dept-color);
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .department-icon {
          color: white;
        }

        .department-name {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          text-align: center;
          margin: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .reports-main {
            padding: 1.5rem;
          }

          .reports-title {
            font-size: 2rem;
          }

          .departments-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            max-width: 500px;
          }

          .department-card {
            width: 180px;
            height: 120px;
          }

          .department-icon-circle {
            width: 50px;
            height: 50px;
          }

          .department-name {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 480px) {
          .departments-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            max-width: 300px;
          }

          .department-card {
            width: 100%;
            height: 100px;
          }

          .department-icon-circle {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>

      <div className="reports-header">
        <h1 className="reports-title">Radiology Departments</h1>
        <p className="reports-subtitle">Select a department to view reports and firm listings</p>
      </div>

      <div className="departments-grid">
        {departments.map((dept) => {
          const IconComponent = dept.icon
          return (
            <button
              key={dept.id}
              className="department-card"
              style={{ "--dept-color": dept.color } as React.CSSProperties}
              onClick={() => onDepartmentSelect(dept.id)}
            >
              <div className="department-icon-circle">
                <IconComponent size={28} className="department-icon" />
              </div>
              <p className="department-name">{dept.name}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ReportsMain

import React from "react";
import {
  Activity,
  Brain,
  Heart,
  Waves,
  X,
  TrendingUp,
  Clock,
  Search,
  Droplets,
  Scan,
  Stethoscope,
  Radio,
  Plus,
} from "lucide-react";

interface ReportsMainProps {
  onDepartmentSelect: (department: string) => void;
}

const ReportsMain: React.FC<ReportsMainProps> = ({ onDepartmentSelect }) => {
  const departments = [
    // Core departments with new icons to match hospital template
    {
      id: "ct-scan",
      name: "CT Scan",
      color: "#3b82f6",
      icon: Scan,
      occupied: 4,
      vacant: 2,
    },
    {
      id: "mri",
      name: "MRI",
      color: "#10b981",
      icon: Brain,
      occupied: 3,
      vacant: 2,
    },
    {
      id: "ecg",
      name: "ECG",
      color: "#f59e0b",
      icon: Heart,
      occupied: 5,
      vacant: 2,
    },
    {
      id: "usg",
      name: "USG",
      color: "#8b5cf6",
      icon: Waves,
      occupied: 2,
      vacant: 2,
    },
    {
      id: "x-ray",
      name: "X-Ray",
      color: "#ef4444",
      icon: X,
      occupied: 6,
      vacant: 2,
    },
    {
      id: "tmt",
      name: "TMT",
      color: "#06b6d4",
      icon: TrendingUp,
      occupied: 2,
      vacant: 1,
    },
    {
      id: "holter",
      name: "Holter",
      color: "#84cc16",
      icon: Clock,
      occupied: 3,
      vacant: 1,
    },

    // Specialized departments
    {
      id: "biopsy",
      name: "Biopsy",
      color: "#dc2626",
      icon: Search,
      occupied: 1,
      vacant: 1,
    },
    {
      id: "dialysis",
      name: "Dialysis",
      color: "#0ea5e9",
      icon: Droplets,
      occupied: 4,
      vacant: 2,
    },
    {
      id: "mammography",
      name: "Mammography",
      color: "#ec4899",
      icon: Activity,
      occupied: 2,
      vacant: 1,
    },
    {
      id: "dental-x-ray",
      name: "Dental X-Ray",
      color: "#16a34a",
      icon: Stethoscope,
      occupied: 2,
      vacant: 2,
    },
    {
      id: "eeg",
      name: "EEG",
      color: "#eab308",
      icon: Brain,
      occupied: 1,
      vacant: 2,
    },
    {
      id: "doppler",
      name: "Doppler",
      color: "#7c3aed",
      icon: Radio,
      occupied: 3,
      vacant: 2,
    },
  ];

  return (
    <div className="reports-main">
      <style>{`
        .reports-main {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%);
          min-height: 100vh;
          padding: 2rem;
        }

        .reports-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .reports-title {
          font-size: 2rem;
          font-weight: bold;
          color: #0d47a1;
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(13, 71, 161, 0.1);
        }

        .reports-subtitle {
          font-size: 1rem;
          color: #1565c0;
          margin: 0;
        }

        .departments-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .departments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        /* Department card styling to match the template */
        .department-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid #e3f2fd;
          position: relative;
          overflow: hidden;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

        .department-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .department-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .department-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--dept-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .department-icon {
          color: white;
        }

        .department-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #0d47a1;
          margin: 0;
        }

        .add-icon {
          color: var(--dept-color);
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          padding: 4px;
        }

        .department-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-number {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--dept-color);
          margin: 0;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #666;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .beds-occupied {
          background: linear-gradient(135deg, #4caf50, #66bb6a);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
        }

        .beds-vacant {
          background: linear-gradient(135deg, #03a9f4, #29b6f6);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .reports-main {
            padding: 1rem;
          }

          .departments-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }

          .department-card {
            padding: 1rem;
            min-height: 100px;
          }

          .department-icon-wrapper {
            width: 40px;
            height: 40px;
          }

          .department-name {
            font-size: 1rem;
          }

          .stat-number {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .departments-grid {
            grid-template-columns: 1fr;
          }
          
          .department-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .stat-item {
            width: 100%;
          }
          
          .beds-occupied,
          .beds-vacant {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="reports-header">
        <h1 className="reports-title">Select Your Ward</h1>
        <p className="reports-subtitle">
          Choose a department to view detailed reports and analytics
        </p>
      </div>

      <div className="departments-container">
        <div className="departments-grid">
          {departments.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <div
                key={dept.id}
                className="department-card"
                style={{ "--dept-color": dept.color } as React.CSSProperties}
                onClick={() => onDepartmentSelect(dept.id)}
              >
                <div className="department-header">
                  <div className="department-info">
                    <div className="department-icon-wrapper">
                      <IconComponent size={24} className="department-icon" />
                    </div>
                    <h3 className="department-name">{dept.name}</h3>
                  </div>
                  <Plus size={20} className="add-icon" />
                </div>

                <div className="department-stats">
                  <div className="stat-item">
                    <p className="stat-number">{dept.beds}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsMain;

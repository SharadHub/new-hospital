import React from "react";

interface ReportsMainProps {
  onDepartmentSelect: (department: string) => void;
}

const ReportsMain: React.FC<ReportsMainProps> = ({ onDepartmentSelect }) => {
  const departments = [
    // Core departments with local image icons
    {
      id: "ct-scan",
      name: "CT Scan",
      color: "#white",
      iconSrc: "/src/assets/logos/ct-scan.png",
    },
    {
      id: "mri",
      name: "MRI",
      color: "#white",
      iconSrc: "/src/assets/logos/mri.png",
    },
    {
      id: "ecg",
      name: "ECG",
      color: "#white",
      iconSrc: "/src/assets/logos/ecg.png",
    },
    {
      id: "usg",
      name: "USG",
      color: "#white",
      iconSrc: "/src/assets/logos/usg.png",
    },
    {
      id: "x-ray",
      name: "X-Ray",
      color: "#white",
      iconSrc: "/src/assets/logos/x-ray.png",
    },
    {
      id: "tmt",
      name: "TMT",
      color: "#white",
      iconSrc: "/src/assets/logos/stress-test.png",
    },
    {
      id: "holter",
      name: "Holter",
      color: "#white",
      iconSrc: "/src/assets/logos/holter.png",
    },
    {
      id: "biopsy",
      name: "Biopsy",
      color: "#white",
      iconSrc: "/src/assets/logos/biopsy.png",
    },
    {
      id: "dialysis",
      name: "Dialysis",
      color: "#white",
      iconSrc: "/src/assets/logos/dialysis.png",
    },
    {
      id: "mammography",
      name: "Mammography",
      color: "#white",
      iconSrc: "/src/assets/logos/mammography.png",
    },
    {
      id: "dental-x-ray",
      name: "Dental X-Ray",
      color: "#white",
      iconSrc: "/src/assets/logos/Dental x-ray.png",
    },
    {
      id: "eeg",
      name: "EEG",
      color: "#white",
      iconSrc: "/src/assets/logos/eye.png",
    },
    {
      id: "doppler",
      name: "Doppler",
      color: "#white",
      iconSrc: "/src/assets/logos/doppler.png",
    },
  ];

  return (
    <div className="reports-main">
      <style>{`
        .reports-main {
          background: white;
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
          color: #0077be;
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(13, 71, 161, 0.1);
        }

        .reports-subtitle {
          font-size: 1rem;
          color: #0077be;
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

        .department-card {
          background: #0077be;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid black;
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
          border-color: #0077be;
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
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid white;
          padding: 8px;
        }

        .department-icon {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .department-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
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
                      <img 
                        src={dept.iconSrc} 
                        alt={dept.name}
                        className="department-icon"
                      />
                    </div>
                    <h3 className="department-name">{dept.name}</h3>
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
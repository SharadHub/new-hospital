import React from "react";
import {
  Users,
  FileText,
  Activity,
  TrendingUp,
  // Calendar,
  Clock,
} from "lucide-react";
import { Patient, Report } from "../types";

interface DashboardProps {
  patients: Patient[];
  reports: Report[];
}

const Dashboard: React.FC<DashboardProps> = ({ patients, reports }) => {
  const departmentStats = patients.reduce((acc, patient) => {
    acc[patient.department] = (acc[patient.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentPatients = patients
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentReports = reports
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    .slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="stat-card">
      <div className="stat-content">
        <div className="stat-text">
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
          {trend && (
            <p className="stat-trend">
              <TrendingUp className="trend-icon" />
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`stat-icon ${color}`}>
          <Icon width={20} height={20} fill="white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #3b82f6 0%, #93c5fd 25%, #ffffff 50%, #dbeafe 75%, #1e40af 100%);
          background-attachment: fixed;
          padding: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .stat-card {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 0 30px rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
        }

        .stat-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-text {
          flex: 1;
          min-width: 0;
        }

        .stat-title {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #111827;
          margin: 0.25rem 0 0 0;
        }

        .stat-trend {
          font-size: 0.75rem;
          color: #059669;
          margin: 0.25rem 0 0 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .trend-icon {
          width: 0.75rem;
          height: 0.75rem;
          flex-shrink: 0;
        }

        .stat-trend span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-left: 0.75rem;
        }

        .bg-blue-500 { 
          background: linear-gradient(135deg, #3b82f6, #1e40af); 
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .bg-green-500 { 
          background: linear-gradient(135deg, #10b981, #047857); 
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .bg-purple-500 { 
          background: linear-gradient(135deg, #8b5cf6, #6d28d9); 
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .bg-orange-500 { 
          background: linear-gradient(135deg, #f97316, #ea580c); 
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .department-section {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .department-section:hover {
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 0 30px rgba(59, 130, 246, 0.2);
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-title span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .department-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .department-item {
          text-align: center;
          padding: 0.75rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
          border-radius: 0.5rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }

        .department-item:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 197, 253, 0.2));
          transform: scale(1.02);
        }

        .department-value {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1e40af;
          margin: 0;
        }

        .department-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0.25rem 0 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .activity-section {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .activity-section:hover {
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 0 30px rgba(59, 130, 246, 0.2);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05));
          border-radius: 0.5rem;
          border: 1px solid rgba(59, 130, 246, 0.1);
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
          transform: translateX(4px);
        }

        .activity-info {
          flex: 1;
          min-width: 0;
          margin-right: 0.75rem;
        }

        .activity-name {
          font-weight: 500;
          color: #111827;
          font-size: 0.875rem;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-details {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0.125rem 0 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-date {
          font-size: 0.75rem;
          color: #9ca3af;
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .dashboard {
            gap: 1.5rem;
            padding: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .stat-card {
            padding: 1.5rem;
          }

          .stat-title {
            font-size: 0.875rem;
          }

          .stat-value {
            font-size: 1.875rem;
            margin: 0.5rem 0 0 0;
          }

          .stat-trend {
            font-size: 0.875rem;
          }

          .trend-icon {
            width: 1rem;
            height: 1rem;
          }

          .stat-icon {
            width: 3rem;
            height: 3rem;
          }

          .department-section {
            padding: 1.5rem;
          }

          .section-title {
            font-size: 1.125rem;
            margin: 0 0 1rem 0;
          }

          .department-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }

          .department-item {
            padding: 1rem;
          }

          .department-value {
            font-size: 1.5rem;
          }

          .department-label {
            font-size: 0.875rem;
          }

          .activity-grid {
            gap: 1.5rem;
          }

          .activity-section {
            padding: 1.5rem;
          }

          .activity-list {
            gap: 0.75rem;
          }

          .activity-item {
            padding: 0.75rem;
          }

          .activity-name {
            font-size: 1rem;
          }

          .activity-details {
            font-size: 0.875rem;
          }

          .activity-date {
            font-size: 0.875rem;
          }
        }

        @media (min-width: 768px) {
          .department-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .department-grid {
            grid-template-columns: repeat(7, 1fr);
          }

          .activity-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="bg-blue-500"
          trend="+12% from last week"
        />
        <StatCard
          title="Total Reports"
          value={reports.length}
          icon={FileText}
          color="bg-green-500"
          trend="+8% from last week"
        />
        <StatCard
          title="Active Departments"
          value={Object.keys(departmentStats).length}
          icon={Activity}
          color="bg-purple-500"
        />
        <StatCard
          title="Today's Activity"
          value={3}
          icon={Clock}
          color="bg-orange-500"
          trend="+2 new reports"
        />
      </div>

      {/* Department Breakdown */}
      <div className="department-section">
        <h3 className="section-title">
          <Activity size={20} color="#2563eb" />
          <span>Department Breakdown</span>
        </h3>
        <div className="department-grid">
          {["CT Scan", "MRI", "ECG", "USG", "X-ray", "TMT", "Holter"].map((dept) => (
            <div key={dept} className="department-item">
              <div className="department-value">
                {departmentStats[dept] || 0}
              </div>
              <div className="department-label">{dept}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-grid">
        {/* Recent Patients */}
        <div className="activity-section">
          <h3 className="section-title">
            <Users size={20} color="#059669" />
            <span>Recent Patients</span>
          </h3>
          <div className="activity-list">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-name">{patient.name}</div>
                  <div className="activity-details">
                    {patient.number} • {patient.department}
                  </div>
                </div>
                <div className="activity-date">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="activity-section">
          <h3 className="section-title">
            <FileText size={20} color="#8b5cf6" />
            <span>Recent Reports</span>
          </h3>
          <div className="activity-list">
            {recentReports.map((report) => {
              const patient = patients.find((p) => p.id === report.patientId);
              return (
                <div key={report.id} className="activity-item">
                  <div className="activity-info">
                    <div className="activity-name">{report.reportType}</div>
                    <div className="activity-details">
                      {patient?.name} • {report.department}
                    </div>
                  </div>
                  <div className="activity-date">
                    {new Date(report.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
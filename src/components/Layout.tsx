"use client";

import type React from "react";
import { useState } from "react";
import {
  Activity,
  Users,
  FileText,
  Upload,
  X,
  ChevronRight,
} from "lucide-react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRadiologyExpanded, setIsRadiologyExpanded] = useState(false);

  const menuItems = [
    { id: "Radiology", label: "Radiology", icon: Activity },
    // { id: "patients", label: "Patient Registration", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "upload", label: "Upload File", icon: Upload },
  ];

  const radiologyDepartments = [
    "X-Ray",
    "USG",
    "ECG",
    "CT Scan",
    "MRI",
    "TMT",
    "Holter",
    "Biopsy",
    "Dialysis",
    "Mammography",
    "Dental X-Ray",
    "Eye",
    "Doppler",
  ];

  const handleMenuItemClick = (viewId: string) => {
    const isRadiology = viewId === "Radiology";
    const normalizedViewId = viewId.toLowerCase().replace(/[\s-]/g, "");

    if (isRadiology) {
      setIsRadiologyExpanded(!isRadiologyExpanded);
      return;
    }

    const isRadiologyChild = radiologyDepartments.some(
      (dept) => dept.toLowerCase().replace(/[\s-]/g, "") === normalizedViewId
    );

    if (isRadiologyChild) {
      onViewChange(normalizedViewId);
    } else {
      onViewChange(viewId);
      setIsRadiologyExpanded(false);
    }

    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchClick = () => {
    handleMenuItemClick("search");
  };

  return (
    <div className="app-container">
      <style>{`
        .app-container {
          min-height: 100vh;
          background-color: #f0f8ff;
          display: flex;
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 40;
          display: none;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: ${isRadiologyExpanded ? "20rem" : "16rem"};
          background-color: #0077be;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateX(-100%);
          transition: all 0.3s ease;
          z-index: 50;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem;
          color: #0277bd;
          cursor: pointer;
          display: block;
        }

        .close-btn:hover {
          color: #01579b;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #81d4fa;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #0277bd 0%, #01579b 100%);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          padding: 0.25rem;
        }

        .brand-text h1 {
          font-size: 1.25rem;
          font-weight: bold;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.03em;
          text-shadow: 0 1px 2px rgba(1,87,155,0.08);
          text-align: center;
        }

        .brand-text p {
          font-size: 0.875rem;
          color: #0277bd;
          margin: 0;
        }

        .nav-menu {
          margin-top: 1.5rem;
          position: relative;
        }

        .nav-item-container {
          position: relative;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          text-align: left;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          justify-content: space-between;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #01579b;
        }

        .nav-item.active {
          background-color: white;
          color: #0277bd;
          border-right: 2px solid #0277bd;
        }

        .nav-item-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-item.has-dropdown .chevron {
          transition: transform 0.2s;
        }

        .nav-item.has-dropdown.expanded .chevron {
          transform: rotate(90deg);
        }

        .dropdown-menu {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 0.5rem;
          margin: 0.5rem 1rem;
          padding: 0.5rem 0;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          max-height: 400px;
          overflow-y: auto;
          transition: max-height 0.3s ease;
        }

        .dropdown-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e1f5fe;
          background-color: #f0f8ff;
          font-weight: 600;
          font-size: 0.875rem;
          color: #01579b;
          border-radius: 0.5rem 0.5rem 0 0;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-align: left;
          background: none;
          border: none;
          color: #0277bd;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .dropdown-item:hover {
          background-color: #e1f5fe;
          color: #01579b;
        }

        .dropdown-item.active {
          background-color: #0277bd;
          color: white;
        }

        .dropdown-divider {
          height: 1px;
          background-color: #e1f5fe;
          margin: 0.25rem 0;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 0;
          padding-top: 4rem;
        }

        .main-area {
          flex: 1;
          padding: 1rem;
        }

        @media (min-width: 640px) {
          .main-area {
            padding: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .mobile-overlay {
            display: none !important;
          }
          
          .sidebar {
            position: static;
            transform: translateX(0);
            transition: width 0.3s ease;
          }
          
          .close-btn {
            display: none;
          }
          
          .main-content {
            margin-left: 0;
          }
        }

        @media (max-width: 1023px) {
          .dropdown-menu {
            position: relative;
            margin-left: 1.5rem;
            margin-right: 1.5rem;
            width: calc(100% - 3rem);
          }
        }
      `}</style>

      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          style={{ display: "block" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={24} />
        </div>

        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Activity size={24} color="white" />
            </div>
            <div className="brand-text">
              <h1>Bhaktapur International Hospital</h1>
              <p>Radiology Department</p>
            </div>
          </div>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isRadiology = item.id === "Radiology";

            return (
              <div key={item.id} className="nav-item-container">
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`nav-item ${
                    currentView === item.id ? "active" : ""
                  } ${isRadiology ? "has-dropdown" : ""} ${
                    isRadiology && isRadiologyExpanded ? "expanded" : ""
                  }`}
                >
                  <div className="nav-item-left">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  {isRadiology && (
                    <ChevronRight size={16} className="chevron" />
                  )}
                </button>

                {isRadiology && isRadiologyExpanded && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">Radiology Services</div>
                    <div className="dropdown-divider"></div>
                    {radiologyDepartments.map((dept) => {
                      const deptId = dept.toLowerCase().replace(/[\s-]/g, "");
                      return (
                        <button
                          key={deptId}
                          onClick={() => handleMenuItemClick(deptId)}
                          className={`dropdown-item ${
                            currentView === deptId ? "active" : ""
                          }`}
                        >
                          <Activity size={16} />
                          <span>{dept}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="main-content">
        <Header
          onMenuToggle={handleMenuToggle}
          onSearchClick={handleSearchClick}
          sidebarWidth={isRadiologyExpanded ? 320 : 256}
        />
        <main className="main-area">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

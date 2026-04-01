"use client";
import logo from "../assets/logos/logo.png"
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

  // Handle logo click to go to dashboard
  const handleLogoClick = () => {
    onViewChange("dashboard");
    setIsMobileMenuOpen(false);
    setIsRadiologyExpanded(false);
  };

  const handleMenuItemClick = (viewId: string) => {
    const isRadiology = viewId === "Radiology";
    const normalizedViewId = viewId.toLowerCase().replace(/[\s-]/g, "");

    if (isRadiology) {
      // Toggle dropdown and set view to Radiology (dashboard)
      setIsRadiologyExpanded(!isRadiologyExpanded);
      onViewChange("Radiology"); // Always set view to Radiology (dashboard) when clicking radiology
      return;
    }

    const isRadiologyChild = radiologyDepartments.some(
      (dept) => dept.toLowerCase().replace(/[\s-]/g, "") === normalizedViewId
    );

    if (isRadiologyChild) {
      onViewChange(normalizedViewId);
      // Keep dropdown open when selecting a department
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

  // Check if current view is a radiology department
  const isRadiologyDepartmentActive = radiologyDepartments.some(
    (dept) => dept.toLowerCase().replace(/[\s-]/g, "") === currentView
  );

  // Check if dashboard is active (logo should be highlighted)
  const isDashboardActive = currentView === "dashboard" || currentView === "Radiology";

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
          height: 100vh;
          width: 16rem;
          background-color: #0077be;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 50;
          overflow: hidden;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-content {
          height: 100vh;
          background-color: #0077be;
          position: relative;
          display: flex;
          flex-direction: column;
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
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: white;
        }

        .sidebar-brand:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .sidebar-brand.active {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
          transition: all 0.3s ease;
        }

        .sidebar-brand:hover .brand-icon {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        /* Container for brand icon + text */
      .sidebar-brand {
        display: flex;
        align-items: center;       /* vertically center icon and text */
        gap: 0.75rem;              /* spacing between icon and text */
        cursor: pointer;
        padding: 0.5rem;
        // border-radius: 2rem;
        transition: background 0.3s ease, transform 0.3s ease;
}

.brand-text {
  display: flex;
  flex-direction: column;
  background-color:white;
  // border-radius: 2rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.brand-text img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 2px solid #ffffff;
  object-fit: contain;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.brand-text h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0077be;
  margin: 0;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(1, 87, 155, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  line-height: 1.2;
}

.brand-text p {
  font-size: 0.875rem;
  font-weight: 400;
  color: #0077be;
  margin: 0;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0.9;
  letter-spacing: 0.01em;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .brand-text {
    gap: 0.25rem;
    padding: 0.25rem;
  }
  
  .brand-text img {
    width: 2rem;
    height: 2rem;
  }
  
  .brand-text h1 {
    font-size: 1.1rem;
  }
  
  .brand-text p {
    font-size: 0.75rem;
  }
}


        .nav-menu {
          margin-top: 1.5rem;
          position: relative;
          flex: 1;
          overflow-y: auto;
          padding-bottom: 2rem;
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
          max-height: 300px;
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
          min-height: 100vh;
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
            position: fixed;
            transform: translateX(0);
            transition: transform 0.3s ease;
            height: 100vh;
            width: 16rem;
          }

          .sidebar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #0077be;
            z-index: -1;
            min-height: 100vh;
          }
          
          .close-btn {
            display: none;
          }
          
          .main-content {
            margin-left: 16rem;
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

        /* Ensure sidebar background extends to full document height */
        @media (min-width: 1024px) {
          .sidebar-content {
            height: 100vh;
            background-color: #0077be;
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
        <div className="sidebar-content">
          <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </div>

          <div className="sidebar-header">
            <div 
              className={`sidebar-brand ${isDashboardActive ? 'active' : ''}`}
              onClick={handleLogoClick}
            >
              {/* <div className="brand-icon">
                <Activity size={24} color="white" />
              </div> */}
              <div className="brand-text">
                <img src={logo}></img>
                <h1>Hospital</h1>
                <p>Radiology Department</p>
              </div>
            </div>
          </div>

          <nav className="nav-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isRadiology = item.id === "Radiology";
              // Remove dashboard functionality from Radiology menu item
              const isActive = currentView === item.id && !isDashboardActive || (isRadiology && isRadiologyDepartmentActive);

              return (
                <div key={item.id} className="nav-item-container">
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`nav-item ${isActive ? "active" : ""} ${
                      isRadiology ? "has-dropdown" : ""
                    } ${
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
      </div>

      <div className="main-content">
        <Header
          onMenuToggle={handleMenuToggle}
          onSearchClick={handleSearchClick}
          sidebarWidth={256}
        />
        <main className="main-area">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
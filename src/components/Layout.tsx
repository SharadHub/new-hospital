import React, { useState } from "react";
import {
  Activity,
  // Users,
  FileText,
  Search,
  // Upload,
  // Settings,
  Menu,
  X,
} from "lucide-react";

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

  const menuItems = [
    { id: "radiology", label: "Radiology", icon: Activity },
    // { id: "patients", label: "Patient Registration", icon: Users },
    // { id: "upload", label: "Report Upload", icon: Upload },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "search", label: "Search & Filter", icon: Search },
  ];

  const handleMenuItemClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="app-container">
      <style>{`
        .app-container {
          min-height: 100vh;
          background-color: #f9fafb;
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
          width: 16rem;
          background-color: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
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
          color: #9ca3af;
          cursor: pointer;
          display: block;
        }

        .close-btn:hover {
          color: #6b7280;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #2563eb;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text h1 {
          font-size: 1.25rem;
          font-weight: bold;
          color: #2563eb;
          margin: 0;
          letter-spacing: 0.03em;
          text-shadow: 0 1px 2px rgba(59,130,246,0.08);
          text-align: center;
        }

        .brand-text p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .nav-menu {
          margin-top: 1.5rem;
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
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .nav-item:hover {
          background-color: #f9fafb;
          color: #111827;
        }

        .nav-item.active {
          background-color: #eff6ff;
          color: #1d4ed8;
          border-right: 2px solid #1d4ed8;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 0;
        }

        .header {
          background-color: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid #e5e7eb;
        }

        .header-content {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-btn {
          padding: 0.5rem;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          display: block;
        }

        .menu-btn:hover {
          color: #6b7280;
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #111827;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-date {
          font-size: 0.875rem;
          color: #6b7280;
          display: none;
        }

        .settings-btn {
          padding: 0.5rem;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .settings-btn:hover {
          color: #6b7280;
        }

        .main-area {
          flex: 1;
          padding: 1rem;
        }

        @media (min-width: 640px) {
          .header-content {
            padding: 1rem 1.5rem;
          }
          
          .header-right {
            gap: 1rem;
          }
          
          .header-date {
            display: block;
          }
          
          .header-title {
            font-size: 1.5rem;
          }
          
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
            transition: none;
          }
          
          .close-btn {
            display: none;
          }
          
          .menu-btn {
            display: none;
          }
          
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          style={{ display: "block" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Mobile close button */}
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
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`nav-item ${
                  currentView === item.id ? "active" : ""
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="menu-btn"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>

        <main className="main-area">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

// import React, { useState } from "react";
// import {
//   Activity,
//   Users,
//   FileText,
//   Search,
//   Menu,
//   X,
// } from "lucide-react";

// interface LayoutProps {
//   children: React.ReactNode;
//   currentView: string;
//   onViewChange: (view: string) => void;
// }

// const Layout: React.FC<LayoutProps> = ({
//   children,
//   currentView,
//   onViewChange,
// }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showRadiologyDropdown, setShowRadiologyDropdown] = useState(false);
//   const [showReportsDropdown, setShowReportsDropdown] = useState(false);

//   const menuItems = [
//     { id: "Radiology", label: "Radiology", icon: Activity },
//     { id: "reports", label: "Reports", icon: FileText },
//     { id: "search", label: "Search & Filter", icon: Search },
//   ];

//   // Dropdown items for Radiology

//   const handleMenuItemClick = (viewId: string) => {
//   if (["ct", "mri", "ecg", "usg", "x-ray", "tmt", "holter"].includes(viewId.toLowerCase())) {
//     onViewChange(`reports-${viewId.toLowerCase()}`);
//   } else {
//     onViewChange(viewId);
//   }
//   setIsMobileMenuOpen(false);
//   setShowRadiologyDropdown(false);
// };

//   const handleRadiologyHover = () => {
//     setShowRadiologyDropdown(true);
//   };

//   const handleRadiologyLeave = () => {
//     setShowRadiologyDropdown(false);
//   };
//   const handleReportsHover = () => {
//   setShowReportsDropdown(true);
// };

// const handleReportsLeave = () => {
//   setShowReportsDropdown(false);
// };

//   return (
//     <div className="app-container">
//       <style>{`
//         .app-container {
//           min-height: 100vh;
//           background-color: #f9fafb;
//           display: flex;
//         }

//         .mobile-overlay {
//           position: fixed;
//           inset: 0;
//           background-color: rgba(0, 0, 0, 0.5);
//           z-index: 40;
//           display: none;
//         }

//         .sidebar {
//           position: fixed;
//           top: 0;
//           left: 0;
//           height: 100%;
//           width: 16rem;
//           background-color: white;
//           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
//           transform: translateX(-100%);
//           transition: transform 0.3s ease;
//           z-index: 50;
//         }

//         .sidebar.open {
//           transform: translateX(0);
//         }

//         .close-btn {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           padding: 0.5rem;
//           color: #9ca3af;
//           cursor: pointer;
//           display: block;
//         }

//         .close-btn:hover {
//           color: #6b7280;
//         }

//         .sidebar-header {
//           padding: 1.5rem;
//           border-bottom: 1px solid #e5e7eb;
//         }

//         .sidebar-brand {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .brand-icon {
//           width: 2.5rem;
//           height: 2.5rem;
//           background-color: #2563eb;
//           border-radius: 0.5rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .brand-text h1 {
//           font-size: 1.25rem;
//           font-weight: bold;
//           color: #2563eb;
//           margin: 0;
//           letter-spacing: 0.03em;
//           text-shadow: 0 1px 2px rgba(59,130,246,0.08);
//           text-align: center;
//         }

//         .brand-text p {
//           font-size: 0.875rem;
//           color: #6b7280;
//           margin: 0;
//         }

//         .nav-menu {
//           margin-top: 1.5rem;
//           position: relative;
//         }

//         .nav-item-container {
//           position: relative;
//         }

//         .nav-item {
//           width: 100%;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.75rem 1.5rem;
//           text-align: left;
//           background: none;
//           border: none;
//           color: #6b7280;
//           cursor: pointer;
//           transition: all 0.2s;
//           font-weight: 500;
//           justify-content: space-between;
//         }

//         .nav-item:hover {
//           background-color: #f9fafb;
//           color: #111827;
//         }

//         .nav-item.active {
//           background-color: #eff6ff;
//           color: #1d4ed8;
//           border-right: 2px solid #1d4ed8;
//         }

//         .nav-item-left {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .nav-item.has-dropdown .nav-item-left::after {
//           content: '';
//           width: 0;
//           height: 0;
//           border-left: 4px solid transparent;
//           border-right: 4px solid transparent;
//           border-top: 4px solid currentColor;
//           margin-left: auto;
//           transition: transform 0.2s;
//         }

//         .nav-item.has-dropdown:hover .nav-item-left::after {
//           transform: rotate(180deg);
//         }

//         /* Dropdown Styles */
//         .dropdown-menu {
//           position: absolute;
//           left: 100%;
//           top: 0;
//           width: 16rem;
//           background-color: white;
//           border-radius: 0.5rem;
//           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
//           border: 1px solid #e5e7eb;
//           opacity: 0;
//           visibility: hidden;
//           transform: translateX(-10px);
//           transition: all 0.2s ease;
//           z-index: 100;
//           max-height: 70vh;
//           overflow-y: auto;
//         }

//         .dropdown-menu.show {
//           opacity: 1;
//           visibility: visible;
//           transform: translateX(0);
//         }

//         .dropdown-header {
//           padding: 0.75rem 1rem;
//           border-bottom: 1px solid #e5e7eb;
//           background-color: #f9fafb;
//           font-weight: 600;
//           font-size: 0.875rem;
//           color: #374151;
//           border-radius: 0.5rem 0.5rem 0 0;
//         }

//         .dropdown-item {
//           width: 100%;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.75rem 1rem;
//           text-align: left;
//           background: none;
//           border: none;
//           color: #6b7280;
//           cursor: pointer;
//           transition: all 0.2s;
//           font-weight: 500;
//           font-size: 0.875rem;
//         }

//         .dropdown-item:hover {
//           background-color: #eff6ff;
//           color: #1d4ed8;
//         }

//         .dropdown-item.active {
//           background-color: #dbeafe;
//           color: #1e40af;
//         }

//         .dropdown-item:last-child {
//           border-radius: 0 0 0.5rem 0.5rem;
//         }

//         .dropdown-divider {
//           height: 1px;
//           background-color: #e5e7eb;
//           margin: 0.25rem 0;
//         }

//         .main-content {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           margin-left: 0;
//         }

//         .header {
//           background-color: white;
//           box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
//           border-bottom: 1px solid #e5e7eb;
//         }

//         .header-content {
//           padding: 1rem;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//         }

//         .menu-btn {
//           padding: 0.5rem;
//           color: #9ca3af;
//           background: none;
//           border: none;
//           cursor: pointer;
//           display: block;
//         }

//         .menu-btn:hover {
//           color: #6b7280;
//         }

//         .header-title {
//           font-size: 1.25rem;
//           font-weight: bold;
//           color: #111827;
//           margin: 0;
//         }

//         .header-right {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .header-date {
//           font-size: 0.875rem;
//           color: #6b7280;
//           display: none;
//         }

//         .settings-btn {
//           padding: 0.5rem;
//           color: #9ca3af;
//           background: none;
//           border: none;
//           cursor: pointer;
//           transition: color 0.2s;
//         }

//         .settings-btn:hover {
//           color: #6b7280;
//         }

//         .main-area {
//           flex: 1;
//           padding: 1rem;
//         }

//         @media (min-width: 640px) {
//           .header-content {
//             padding: 1rem 1.5rem;
//           }
          
//           .header-right {
//             gap: 1rem;
//           }
          
//           .header-date {
//             display: block;
//           }
          
//           .header-title {
//             font-size: 1.5rem;
//           }
          
//           .main-area {
//             padding: 1.5rem;
//           }
//         }

//         @media (min-width: 1024px) {
//           .mobile-overlay {
//             display: none !important;
//           }
          
//           .sidebar {
//             position: static;
//             transform: translateX(0);
//             transition: none;
//           }
          
//           .close-btn {
//             display: none;
//           }
          
//           .menu-btn {
//             display: none;
//           }
          
//           .main-content {
//             margin-left: 0;
//           }
//         }

//         /* Mobile dropdown adjustments */
//         @media (max-width: 1023px) {
//           .dropdown-menu {
//             left: 0;
//             top: 100%;
//             width: 100%;
//             position: relative;
//             box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
//             border: none;
//             border-radius: 0;
//             margin-left: 1.5rem;
//             margin-right: 1.5rem;
//             width: calc(100% - 3rem);
//             background-color: #f8fafc;
//           }

//           .dropdown-menu.show {
//             transform: none;
//           }

//           .dropdown-header {
//             background-color: #e2e8f0;
//             border-radius: 0;
//           }

//           .dropdown-item:last-child {
//             border-radius: 0;
//           }
//         }
//       `}</style>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="mobile-overlay"
//           style={{ display: "block" }}
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//   <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
//         {/* Mobile close button */}
//         <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
//           <X size={24} />
//         </div>

//         <div className="sidebar-header">
//           <div className="sidebar-brand">
//             <div className="brand-icon">
//               <Activity size={24} color="white" />
//             </div>
//             <div className="brand-text">
//               <h1>Bhaktapur International Hospital</h1>
//               <p>Radiology Department</p>
//             </div>
//           </div>
//         </div>

//         <nav className="nav-menu">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isRadiology = item.id === "Radiology";
//             const isReports = item.id === "reports";

//             return (
//               <div
//                 key={item.id}
//                 className="nav-item-container"
//                 onMouseEnter={isRadiology ? handleRadiologyHover : isReports ? handleReportsHover : undefined}
//                 onMouseLeave={isRadiology ? handleRadiologyLeave : isReports ? handleReportsLeave : undefined}
//               >
//                 <button
//                   onClick={() => handleMenuItemClick(item.id)}
//                   className={`nav-item ${
//                     currentView === item.id ? "active" : ""
//                   } ${isRadiology || isReports ? "has-dropdown" : ""}`}
//                 >
//                   <div className="nav-item-left">
//                     <Icon size={20} />
//                     <span>{item.label}</span>
//                   </div>
//                 </button>

//                 {/* Dropdown Menu for Radiology */}
//                 {isRadiology && (
//                   <div
//                     className={`dropdown-menu ${
//                       showRadiologyDropdown ? "show" : ""
//                     }`}
//                   >
//                     <div className="dropdown-header">Radiology Services</div>

//                     {/* Main sections */}
//                     <button
//                       onClick={() => handleMenuItemClick("patients")}
//                       className={`dropdown-item ${
//                         currentView === "patients" ? "active" : ""
//                       }`}
//                     >
//                       <Users size={16} />
//                       <span>Patient Registration</span>
//                     </button>

//                     <div className="dropdown-divider"></div>

//                     {/* Department sections */}
//                     {["CT", "MRI", "ECG", "USG", "X-ray", "TMT", "Holter"].map(
//                       (dept) => (
//                         <button
//                           key={dept.toLowerCase()}
//                           onClick={() =>
//                             handleMenuItemClick(dept.toLowerCase())
//                           }
//                           className={`dropdown-item ${
//                             currentView === dept.toLowerCase() ? "active" : ""
//                           }`}
//                         >
//                           <Activity size={16} />
//                           <span>{dept}</span>
//                         </button>
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         <header className="header">
//           <div className="header-content">
//             <div className="header-left">
//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(true)}
//                 className="menu-btn"
//               >
//                 <Menu size={24} />
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="main-area">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
import React, { useState } from "react";
import {
  Activity,
  Users,
  FileText,
  Search,
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
  const [showRadiologyDropdown, setShowRadiologyDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);

  const menuItems = [
    { id: "Radiology", label: "Radiology", icon: Activity },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "search", label: "Search & Filter", icon: Search },
  ];

  const handleMenuItemClick = (viewId: string) => {
    if (["ct", "mri", "ecg", "usg", "x-ray", "tmt", "holter"].includes(viewId.toLowerCase())) {
      onViewChange(`reports-${viewId.toLowerCase()}`);
    } else {
      onViewChange(viewId);
    }
    setIsMobileMenuOpen(false);
    setShowRadiologyDropdown(false);
  };

  const handleRadiologyHover = () => {
    setShowRadiologyDropdown(true);
  };

  const handleRadiologyLeave = () => {
    setShowRadiologyDropdown(false);
  };

  const handleReportsHover = () => {
    setShowReportsDropdown(true);
  };

  const handleReportsLeave = () => {
    setShowReportsDropdown(false);
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
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          justify-content: space-between;
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

        .nav-item-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-item.has-dropdown .nav-item-left::after {
          content: '';
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid currentColor;
          margin-left: auto;
          transition: transform 0.2s;
        }

        .nav-item.has-dropdown:hover .nav-item-left::after {
          transform: rotate(180deg);
        }

        /* Dropdown Styles */
        .dropdown-menu {
          position: absolute;
          left: 100%;
          top: 0;
          width: 16rem;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-10px);
          transition: all 0.2s ease;
          z-index: 100;
          max-height: 70vh;
          overflow-y: auto;
        }

        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }

        .dropdown-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
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
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .dropdown-item:hover {
          background-color: #eff6ff;
          color: #1d4ed8;
        }

        .dropdown-item.active {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .dropdown-item:last-child {
          border-radius: 0 0 0.5rem 0.5rem;
        }

        .dropdown-divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 0.25rem 0;
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

        /* Mobile dropdown adjustments */
        @media (max-width: 1023px) {
          .dropdown-menu {
            left: 0;
            top: 100%;
            width: 100%;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            border: none;
            border-radius: 0;
            margin-left: 1.5rem;
            margin-right: 1.5rem;
            width: calc(100% - 3rem);
            background-color: #f8fafc;
          }

          .dropdown-menu.show {
            transform: none;
          }

          .dropdown-header {
            background-color: #e2e8f0;
            border-radius: 0;
          }

          .dropdown-item:last-child {
            border-radius: 0;
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
            const isRadiology = item.id === "Radiology";
            const isReports = item.id === "reports";

            return (
              <div
                key={item.id}
                className="nav-item-container"
                onMouseEnter={isRadiology ? handleRadiologyHover : isReports ? handleReportsHover : undefined}
                onMouseLeave={isRadiology ? handleRadiologyLeave : isReports ? handleReportsLeave : undefined}
              >
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`nav-item ${
                    currentView === item.id ? "active" : ""
                  } ${isRadiology || isReports ? "has-dropdown" : ""}`}
                >
                  <div className="nav-item-left">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                </button>

                {/* Dropdown Menu for Radiology */}
                {isRadiology && (
                  <div
                    className={`dropdown-menu ${
                      showRadiologyDropdown ? "show" : ""
                    }`}
                  >
                    <div className="dropdown-header">Radiology Services</div>

                    {/* Main sections */}
                    <button
                      onClick={() => handleMenuItemClick("patients")}
                      className={`dropdown-item ${
                        currentView === "patients" ? "active" : ""
                      }`}
                    >
                      <Users size={16} />
                      <span>Patient Registration</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    {/* Department sections */}
                    {["CT", "MRI", "ECG", "USG", "X-ray", "TMT", "Holter"].map(
                      (dept) => (
                        <button
                          key={dept.toLowerCase()}
                          onClick={() =>
                            handleMenuItemClick(dept.toLowerCase())
                          }
                          className={`dropdown-item ${
                            currentView === dept.toLowerCase() ? "active" : ""
                          }`}
                        >
                          <Activity size={16} />
                          <span>{dept}</span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
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
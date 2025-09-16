// import React from "react";
// import { Menu, Search } from "lucide-react";

// interface HeaderProps {
//   onMenuToggle?: () => void;
//   onSearchClick?: () => void;
//   showMenuButton?: boolean;
//   currentDate?: string;
//   className?: string;
// }

// const Header: React.FC<HeaderProps> = ({
//   onMenuToggle,
//   onSearchClick,
//   showMenuButton = true,
//   currentDate,
//   className = "",
// }) => {
//   const defaultDate = new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <header className={`header ${className}`}>
//       <style>{`
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
//           color: #374151;
//           background: none;
//           border: none;
//           cursor: pointer;
//           border-radius: 0.375rem;
//           transition: all 0.2s;
//           display: block;
//         }

//         .menu-btn:hover {
//           color: #111827;
//           background-color: #f3f4f6;
//         }

//         .menu-btn svg {
//           width: 24px;
//           height: 24px;
//         }

//         .header-right {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .header-date {
//           font-size: 0.875rem;
//           color: #6b7280;
//           font-weight: 500;
//           display: none;
//         }

//         .search-filter-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 0.75rem;
//           color: #6b7280;
//           background: none;
//           border: 1px solid #e5e7eb;
//           border-radius: 0.5rem;
//           cursor: pointer;
//           transition: all 0.2s;
//           font-weight: 500;
//           font-size: 0.875rem;
//         }

//         .search-filter-btn:hover {
//           color: #1d4ed8;
//           border-color: #1d4ed8;
//           background-color: #f0f9ff;
//         }

//         .search-filter-btn.active {
//           color: #1d4ed8;
//           border-color: #1d4ed8;
//           background-color: #eff6ff;
//         }

//         .search-filter-btn svg {
//           width: 20px;
//           height: 20px;
//         }

//         .search-text {
//           display: none;
//         }

//         /* Mobile responsive */
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
          
//           .search-text {
//             display: inline;
//           }
//         }

//         /* Desktop - hide menu button */
//         @media (min-width: 1024px) {
//           .menu-btn {
//             display: none;
//           }
//         }
//       `}</style>

//       <div className="header-content">
//         <div className="header-left">
//           {showMenuButton && (
//             <button onClick={onMenuToggle} className="menu-btn" title="Menu">
//               <Menu />
//             </button>
//           )}
//         </div>

//         <div className="header-right">
//           <div className="header-date">{currentDate || defaultDate}</div>

//           <button
//             onClick={onSearchClick}
//             className="search-filter-btn"
//             title="Search & Filter"
//           >
//             <Search />
//             <span className="search-text">Search</span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
"use client"

import type React from "react"
import { Menu, Search } from "lucide-react"

interface HeaderProps {
  onMenuToggle?: () => void
  onSearchClick?: () => void
  showMenuButton?: boolean
  currentDate?: string
  className?: string
  sidebarWidth?: number
}

const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  onSearchClick,
  showMenuButton = true,
  currentDate,
  className = "",
  sidebarWidth = 256,
}) => {
  const defaultDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className={`header ${className}`}>
      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #0277bd 0%, #01579b 100%);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 30;
          transition: all 0.3s ease;
        }

        .header-content {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: ${sidebarWidth}px;
          transition: margin-left 0.3s ease;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-btn {
          padding: 0.5rem;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 0.375rem;
          transition: all 0.2s;
          display: block;
        }

        .menu-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .menu-btn svg {
          width: 24px;
          height: 24px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-date {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          display: none;
        }

        .search-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: white;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .search-filter-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .search-filter-btn.active {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .search-filter-btn svg {
          width: 20px;
          height: 20px;
        }

        .search-text {
          display: none;
        }

        /* Mobile responsive */
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
          
          .search-text {
            display: inline;
          }
        }

        /* Desktop - hide menu button and adjust margin */
        @media (min-width: 1024px) {
          .menu-btn {
            display: none;
          }
          
          .header-content {
            margin-left: 0;
          }
        }

        /* Mobile - no sidebar margin */
        @media (max-width: 1023px) {
          .header-content {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="header-content">
        <div className="header-left">
          {showMenuButton && (
            <button onClick={onMenuToggle} className="menu-btn" title="Menu">
              <Menu />
            </button>
          )}
        </div>

        <div className="header-right">
          <div className="header-date">{currentDate || defaultDate}</div>

          <button onClick={onSearchClick} className="search-filter-btn" title="Search & Filter">
            <Search />
            <span className="search-text">Search</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

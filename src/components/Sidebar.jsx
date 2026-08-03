import React, { useState } from 'react';
import {
  FiGrid, FiBookOpen, FiFolder, FiAward,
  FiHelpCircle, FiChevronLeft, FiChevronRight, FiMenu, FiX
} from 'react-icons/fi';
import logo from '../assets/logo.png';

const navItems = [
  { icon: FiGrid,       label: 'Dashboard' },
  { icon: FiBookOpen,   label: 'Courses Enrolled' },
  { icon: FiHelpCircle, label: 'Requests & Queries' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, darkMode, activeTab, setActiveTab }) => {
  return (
    <>
      {/* ── Mobile overlay ────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Mobile hamburger ──────────────────────────── */}
      <button
        id="mobile-menu-btn"
        aria-label="Open menu"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#0B3558] text-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-50 flex flex-col
          bg-[#0B3558] shadow-2xl
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[72px]' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 min-h-[72px]">
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-fadeIn py-1">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg flex-shrink-0">
                <img src={logo} alt="Data Science Master Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Data Science</p>
                <p className="text-blue-300 text-[10px] leading-tight font-medium">Master</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg mx-auto">
              <img src={logo} alt="Data Science Master Logo" className="w-full h-full object-contain" />
            </div>
          )}
          {/* Collapse toggle — desktop only */}
          <button
            id="sidebar-collapse-btn"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              hidden lg:flex items-center justify-center w-7 h-7 rounded-lg
              text-white/60 hover:text-white hover:bg-white/10
              transition-all duration-200 flex-shrink-0
              ${isCollapsed ? 'mx-auto mt-1' : ''}
            `}
          >
            {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto sidebar-scroll">
          {navItems.map((item, i) => {
            const isActive = activeTab === item.label;
            return (
              <div key={i} className="tooltip-wrapper">
                <button
                  id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  aria-label={item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3.5 px-3 py-3 rounded-xl
                    transition-all duration-200 group relative
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'nav-active text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                    }
                  `}
                  style={!isActive ? { '--tw-bg-opacity': 1 } : {}}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ''; }}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                  )}
                </button>
                {isCollapsed && <span className="tooltip">{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

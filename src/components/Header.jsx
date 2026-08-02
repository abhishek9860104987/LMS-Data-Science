import React, { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiBell, FiMoon, FiSun, FiX, FiLogOut, FiUser, FiBookOpen } from 'react-icons/fi';
import { courseData } from '../data/courseData';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from './ProfileModal';
import NotificationBell from './NotificationBell';

const Header = ({ isCollapsed, currentLesson, darkMode, toggleDarkMode }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const leftOffset = isCollapsed ? 'lg:left-[72px]' : 'lg:left-64';

  const username = user?.username || 'User';
  const initial = username.charAt(0).toUpperCase();

  return (
    <>
      <header
        id="main-header"
        className={`
          fixed top-0 right-0 left-0 ${leftOffset}
          transition-all duration-300 ease-in-out z-30
          ${darkMode
            ? 'bg-gray-900/95 border-gray-700/60 backdrop-blur-sm'
            : 'bg-white/95 border-gray-200/80 backdrop-blur-sm'
          }
          border-b h-[72px] flex items-center justify-between px-4 sm:px-6
          shadow-sm
        `}
      >
        {/* Left: title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className={`font-bold text-base sm:text-lg leading-tight truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {courseData.courseTitle}
            </h1>
            {currentLesson && (
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentLesson.title}
              </p>
            )}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Dark mode toggle */}
          <button
            id="dark-mode-toggle"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleDarkMode}
            className={`
              p-2 rounded-xl transition-all duration-200
              ${darkMode
                ? 'hover:bg-gray-700 text-amber-400 hover:text-amber-300'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Notification Bell */}
          <NotificationBell darkMode={darkMode} />

          {/* Avatar — opens Profile Modal */}
          <button
            onClick={() => setProfileOpen(true)}
            id="user-avatar-btn"
            aria-label="User profile"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ml-1"
          >
            {initial}
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={profileOpen} 
        onClose={() => setProfileOpen(false)} 
        darkMode={darkMode} 
      />
    </>
  );

};

export default Header;

import React from 'react';
import { FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const ProgressBar = ({ total, completed, darkMode }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`
      rounded-2xl p-4 shadow-sm border
      ${darkMode
        ? 'bg-gray-800 border-gray-700/60'
        : 'bg-white border-gray-100'
      }
    `}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <FiBookOpen size={14} className="text-blue-600" />
          </div>
          <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Course Progress
          </span>
        </div>
        <span className="text-lg font-bold text-blue-600">{percentage}%</span>
      </div>

      {/* Bar */}
      <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between mt-2.5">
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {completed} of {total} lessons
        </span>
        {completed > 0 && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <FiCheckCircle size={11} />
            {completed} completed
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;

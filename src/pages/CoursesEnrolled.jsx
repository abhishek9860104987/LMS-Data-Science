import React from 'react';
import illustration from '../assets/students_illustration.jpg';

const CoursesEnrolled = ({ progressData, darkMode, onOpenDashboard }) => {
  return (
    <div className={`p-6 md:p-10 min-h-[calc(100vh-72px)] relative ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <h1 className="text-xl md:text-2xl font-bold mb-8">Courses Enrolled</h1>
      
      <div 
        onClick={onOpenDashboard}
        className={`w-full max-w-md rounded-xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${darkMode ? 'bg-[#1e293b] hover:bg-slate-800' : 'bg-[#FDF6E3] hover:bg-[#FAF0D7]'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-orange-100'}`}
      >
        
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium text-slate-800 dark:text-gray-100">Data Science001</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">Data Science</p>
          </div>
          <span className="px-3 py-1 bg-[#4C9A62] text-white text-xs font-medium rounded-md">
            Active
          </span>
        </div>

        {/* Card Stats Grid */}
        <div className="grid grid-cols-3 gap-y-6 gap-x-4">
          
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Progress</p>
            <p className="font-medium text-slate-800 dark:text-gray-200">{progressData.percentage.toFixed(2)}%</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Topics Covered</p>
            <p className="font-medium text-slate-800 dark:text-gray-200">{progressData.completed}/{progressData.total}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Course Duration</p>
            <p className="font-medium text-slate-800 dark:text-gray-200">8 weeks</p>
          </div>
          
        </div>
      </div>

      {/* Illustration placed at the bottom right */}
      <div className="hidden md:block absolute bottom-10 right-10 w-[450px] opacity-90 pointer-events-none mix-blend-multiply dark:mix-blend-screen">
        <img src={illustration} alt="Students studying illustration" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
};

export default CoursesEnrolled;

import React from 'react';
import illustration from '../assets/students_illustration.jpg';
import { allCourses, getProgress } from '../data/courseData';
import { FiCheckCircle, FiPlay } from 'react-icons/fi';

const CoursesEnrolled = ({
  completedIds = new Set(),
  activeCourseId,
  onSelectCourse,
  darkMode,
}) => {
  return (
    <div className={`p-6 md:p-10 min-h-[calc(100vh-72px)] relative ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="max-w-5xl">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Courses Enrolled</h1>
        <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Select a course below to launch your learning dashboard, watch lessons, and track progress.
        </p>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl z-10 relative">
          {allCourses.map((course) => {
            const isCurrentActive = course.id === activeCourseId;
            const progress = getProgress(course, completedIds);
            const totalWeeks = course.weeks.length;

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className={`
                  w-full rounded-2xl p-6 cursor-pointer transition-all duration-200
                  hover:scale-[1.02] hover:shadow-lg border flex flex-col justify-between
                  ${isCurrentActive
                    ? darkMode
                      ? 'bg-slate-800/90 border-blue-500/60 ring-2 ring-blue-500/20'
                      : 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/20'
                    : darkMode
                      ? 'bg-[#1e293b] hover:bg-slate-800 border-gray-700/80'
                      : 'bg-white hover:bg-amber-50/50 border-gray-200'
                  }
                  shadow-sm
                `}
              >
                {/* Card Header */}
                <div>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div>
                      <h2 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-slate-800'}`}>
                        {course.courseTitle}
                      </h2>
                      <p className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {course.category}
                      </p>
                    </div>

                    {isCurrentActive ? (
                      <span className="px-3 py-1 bg-[#4C9A62] text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm flex-shrink-0">
                        <FiCheckCircle size={12} /> Active Now
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100 flex-shrink-0">
                        <FiPlay size={10} /> Launch
                      </span>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed mb-6 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {course.courseDescription}
                  </p>
                </div>

                {/* Card Stats Grid */}
                <div className={`grid grid-cols-3 gap-3 pt-4 border-t ${darkMode ? 'border-gray-700/60' : 'border-gray-100'}`}>
                  <div>
                    <p className={`text-[11px] mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progress</p>
                    <p className={`font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {progress.percentage}%
                    </p>
                  </div>

                  <div>
                    <p className={`text-[11px] mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Topics Covered</p>
                    <p className={`font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {progress.completed}/{progress.total}
                    </p>
                  </div>

                  <div>
                    <p className={`text-[11px] mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</p>
                    <p className={`font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {totalWeeks} weeks
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Illustration placed at the bottom right */}
      <div className="hidden md:block absolute bottom-10 right-10 w-[420px] opacity-80 pointer-events-none mix-blend-multiply dark:mix-blend-screen">
        <img src={illustration} alt="Students studying illustration" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
};

export default CoursesEnrolled;

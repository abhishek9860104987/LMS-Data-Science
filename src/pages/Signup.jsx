import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import SEOHead from '../components/SEOHead';

const SIGNUP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Create Account — Data Science Master',
  description: 'Join Data Science Master and begin your journey into Python, Machine Learning, Deep Learning, LLMs and Agentic AI.',
  url: 'https://datasciencemaster.edu/signup',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem', position: 1, name: 'Home', item: 'https://datasciencemaster.edu/'
    }, {
      '@type': 'ListItem', position: 2, name: 'Sign Up', item: 'https://datasciencemaster.edu/signup'
    }]
  }
};

const getDarkMode = () => {
  try { return JSON.parse(localStorage.getItem('lms_dark_mode')) ?? true; }
  catch { return true; }
};

const Signup = () => {
  const darkMode = getDarkMode();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError('Please enter a valid email address.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    
    try {
      await register(username.trim(), email.trim(), password);
      setSuccess(true);
      setCountdown(3);
    } catch (err) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Create Account — Data Science Master"
        description="Join Data Science Master for free and start learning Python, Machine Learning, Deep Learning, LLMs, RAG, and Agentic AI with hands-on projects."
        canonicalUrl="https://datasciencemaster.edu/signup"
        jsonLd={SIGNUP_JSON_LD}
      />
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-[#1e293b] border border-gray-700' : 'bg-white border border-gray-100'}`}>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Create an Account</h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Join us and start your learning journey</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-medium">
              <FiCheckCircle className="flex-shrink-0 text-emerald-500 text-lg" />
              <span>Account created successfully!</span>
            </div>
            <p className="text-xs opacity-90">
              Redirecting to Sign in page in <span className="font-bold text-emerald-600 dark:text-emerald-300">{countdown}</span> second{countdown !== 1 ? 's' : ''}...
            </p>
            <Link to="/login" className="text-xs font-semibold underline text-emerald-700 dark:text-emerald-300 hover:opacity-80 mt-1">
              Click here to Sign in now →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <input
                type="text"
                required
                disabled={loading || success}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-[#0f172a] border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                } ${success ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <input
                type="email"
                required
                disabled={loading || success}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-[#0f172a] border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                } ${success ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <input
                type="password"
                required
                disabled={loading || success}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-[#0f172a] border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                } ${success ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Create a password"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <input
                type="password"
                required
                disabled={loading || success}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-[#0f172a] border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                } ${success ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all ${loading || success ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : success ? 'Account Created!' : 'Sign Up'}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Signup;

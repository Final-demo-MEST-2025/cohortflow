import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const QuizLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-blue-600 font-medium'
      : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                QuizApp
              </Link>
            </div>

            <nav className="flex space-x-6">
              <Link to="/" className={`transition-colors ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/quizzes" className={`transition-colors ${isActive('/quizzes')}`}>
                Quizzes
              </Link>
              <Link to="/create" className={`transition-colors ${isActive('/create')}`}>
                Create
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                Quiz App &copy; {new Date().getFullYear()}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuizLayout;

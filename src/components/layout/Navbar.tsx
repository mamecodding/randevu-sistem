import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Calendar, BookOpen, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">EduTutor</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
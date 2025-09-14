import React from 'react';
import { Link} from 'react-router-dom';
import { Trophy,  BarChart3,  } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">HackVote</h1>
              </div>
            </Link>
            
            {/* Admin Link */}
            <Link 
              to="/admin" 
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link 
              to="/" 
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            
            <Link 
              to="/admin" 
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                location.pathname === '/admin' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Results</span>
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
};
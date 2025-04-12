import React from 'react';

interface HeaderProps {
  activeTab: 'campaigns' | 'message';
  setActiveTab: (tab: 'campaigns' | 'message') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
          <div className="flex-shrink-0 flex items-center space-x-2">
  {/* <Layers className="h-8 w-8 text-indigo-600" /> */}
  <img
    src="/logo.png"
    alt="OutFlo Logo"
    className="h-8 w-auto"
  />
  <span className="text-xl font-bold text-gray-900">OutFlo</span>
           </div>
            <div className="ml-6 flex space-x-8">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'campaigns'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab('message')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'message'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Message Generator
              </button>
              <button
  onClick={() => setActiveTab('leads')}
  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
    activeTab === 'leads'
      ? 'border-indigo-500 text-gray-900'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
  }`}
>
  Leads
</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header; 
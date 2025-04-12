import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';

interface Lead {
  name: string;
  currentCompany?: string;
  currentPosition?: string;
  location: string;
  profileUrl: string;
  description?: string;
}

interface LeadListProps {
  onAddToCampaign?: (profileUrl: string) => void;
}

const LeadList: React.FC<LeadListProps> = ({ onAddToCampaign }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('https://outflo-assignment-u7x4.onrender.com/api/leads');
        if (!response.ok) {
          throw new Error('Failed to load leads');
        }
        const datas = await response.json();
        setLeads(datas.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (lead.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search leads by name, company, or title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead, index) => (
              <li key={index} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          <a 
                            href={lead.profileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 hover:underline"
                          >
                            {lead.name}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {lead.currentPosition ?? 'Position Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="truncate">
                        <span className="font-medium">Company:</span> {lead.currentCompany ?? 'Unknown'}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="truncate">
                        <span className="font-medium">Location:</span> {lead.location}
                      </span>
                    </div>
                  </div>
                  <div>
                    {/* <button
                      onClick={() => onAddToCampaign?.(lead.profileUrl)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Lead
                    </button> */}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-4 text-center text-gray-500">
              No leads found matching your search criteria
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LeadList;

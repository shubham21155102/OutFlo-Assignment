import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Campaign } from './Campaigns';

interface CreateCampaignProps {
  onClose: () => void;
  onCreate: (newCampaign: Campaign) => void;
}

const CreateCampaign: React.FC<CreateCampaignProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState<Omit<Campaign, '_id'>>({
    name: '',
    description: '',
    status: 'ACTIVE',
    leads: [''],
    accountIDs: ['']
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLeadChange = (index: number, value: string) => {
    const newLeads = [...formData.leads];
    newLeads[index] = value;
    setFormData(prev => ({ ...prev, leads: newLeads }));
  };

  const handleAccountChange = (index: number, value: string) => {
    const newAccounts = [...formData.accountIDs];
    newAccounts[index] = value;
    setFormData(prev => ({ ...prev, accountIDs: newAccounts }));
  };

  const addLeadField = () => {
    setFormData(prev => ({ ...prev, leads: [...prev.leads, ''] }));
  };

  const addAccountField = () => {
    setFormData(prev => ({ ...prev, accountIDs: [...prev.accountIDs, ''] }));
  };

  const removeLeadField = (index: number) => {
    const newLeads = formData.leads.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, leads: newLeads }));
  };

  const removeAccountField = (index: number) => {
    const newAccounts = formData.accountIDs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, accountIDs: newAccounts }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      // Filter out empty leads and accountIDs
      const payload = {
        ...formData,
        leads: formData.leads.filter(lead => lead.trim() !== ''),
        accountIDs: formData.accountIDs.filter(account => account.trim() !== '')
      };

      const response = await fetch('https://outflo-assignment-o03p.onrender.com/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create campaign');
      }

      onCreate(result.data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      console.error('Error creating campaign:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Campaign</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close create campaign dialog"
            disabled={isCreating}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Campaign Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Leads</label>
              {formData.leads.map((lead, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="text"
                    value={lead}
                    onChange={(e) => handleLeadChange(index, e.target.value)}
                    placeholder="https://linkedin.com/in/profile"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeLeadField(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label="Remove lead"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLeadField}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Lead
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account IDs</label>
              {formData.accountIDs.map((account, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => handleAccountChange(index, e.target.value)}
                    placeholder="Account ID"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeAccountField(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label="Remove account"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAccountField}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Account
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
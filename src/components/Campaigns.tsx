import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import EditCampaign from './EditCampaign';
import DeleteCampaign from './DeleteCampaign';
import CreateCampaign from './CreateCampaign';
export type Campaign = {
  _id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  leads: string[];
  accountIDs: string[];
};

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://outflo-assignment-o03p.onrender.com/api/campaigns");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCampaigns(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      console.error("Error fetching campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = (newCampaign: Campaign) => {
    setCampaigns([newCampaign, ...campaigns]);
  };

  const handleStatusToggle = async (campaignId: string) => {
    try {
      setCampaigns(campaigns.map(campaign => 
        campaign._id === campaignId 
          ? { ...campaign, status: campaign.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : campaign
      ));
      const response = await fetch(`https://outflo-assignment-o03p.onrender.com/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: campaigns.find(c => c._id === campaignId)?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign status');
      }
    } catch (err) {
      setCampaigns(campaigns);
      setError(err instanceof Error ? err.message : 'Failed to update campaign status');
      console.error("Error updating campaign status:", err);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
  };

  const handleSaveCampaign = (updatedCampaign: Campaign) => {
    setCampaigns(campaigns.map(campaign => 
      campaign._id === updatedCampaign._id ? updatedCampaign : campaign
    ));
  };

  const handleConfirmDelete = (campaignId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign._id !== campaignId));
  };

  useEffect(() => {
    fetchCampaigns()
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
        <button 
          type="button"
          onClick={() => setCreatingCampaign(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Create new campaign"
        >
          <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
          New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No campaigns found. Create your first campaign to get started.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {campaigns.map((campaign,index) => (
              <li key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{campaign.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="mr-2">Leads: {campaign.leads.length}</span>
                      <span>Accounts: {campaign.accountIDs.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(campaign._id)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        campaign.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        campaign.status === 'ACTIVE' ? 'focus:ring-green-500' : 'focus:ring-gray-500'
                      }`}
                      aria-label={`${campaign.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} campaign ${campaign.name}`}
                    >
                      {campaign.status === 'ACTIVE' ? (
                        <ToggleRight className="h-4 w-4 mr-1" aria-hidden="true" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                      )}
                      {campaign.status}
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleEditCampaign(campaign)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      aria-label={`Edit campaign ${campaign.name}`}
                    >
                      <Edit2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteCampaign(campaign)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      aria-label={`Delete campaign ${campaign.name}`}
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {creatingCampaign && (
        <CreateCampaign
          onClose={() => setCreatingCampaign(false)}
          onCreate={handleCreateCampaign}
        />
      )}
      {editingCampaign && (
        <EditCampaign 
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={handleSaveCampaign}
        />
      )}

      {deletingCampaign && (
        <DeleteCampaign
          campaign={deletingCampaign}
          onClose={() => setDeletingCampaign(null)}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Campaigns;
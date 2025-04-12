import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Campaign } from './Campaigns';

interface DeleteCampaignProps {
  campaign: Campaign;
  onClose: () => void;
  onDelete: (campaignId: string) => void;
}

const DeleteCampaign: React.FC<DeleteCampaignProps> = ({ campaign, onClose, onDelete }) => {
  console.log(campaign)
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${campaign._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete campaign');
      }
      
      onDelete(campaign._id);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      if (!error) {
        onClose();
      }
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Delete Campaign</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close delete dialog"
            disabled={isDeleting}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 text-yellow-600 bg-yellow-50 p-4 rounded-md mb-4">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          <p className="text-sm font-medium">This action cannot be undone.</p>
        </div>
        
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete the campaign <span className="font-medium">{campaign.name}</span>?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : 'Delete Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCampaign;
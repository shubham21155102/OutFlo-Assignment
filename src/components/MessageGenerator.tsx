import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

// Types
export type LinkedInProfile = {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
};

const MessageGenerator: React.FC = () => {
  const [linkedinProfile, setLinkedinProfile] = useState<LinkedInProfile>({
    name: 'John Doe',
    job_title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    summary: 'Experienced in AI & ML...'
  });

  const [generatedMessage, setGeneratedMessage] = useState<string>('');

  const handleGenerateMessage =async () => {
    const res = await fetch("https://outflo-assignment-o03p.onrender.com/api/personalized-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(linkedinProfile)
    });
    
    const data=await res.json();
    console.log(data.data.message)
    setGeneratedMessage(
      data.data.message
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">LinkedIn Message Generator</h1>
        <p className="mt-1 text-sm text-gray-500">Generate personalized outreach messages based on LinkedIn profiles</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              {Object.entries(linkedinProfile).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace('_', ' ')}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setLinkedinProfile({ ...linkedinProfile, [key]: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
              <button
                onClick={handleGenerateMessage}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Generate Message
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Message</h2>
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="w-full h-64 bg-transparent border-0 focus:ring-0 resize-none"
                placeholder="Generated message will appear here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator; 
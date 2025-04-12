import React, { useState } from 'react';
import Campaigns from './components/Campaigns';
import MessageGenerator from './components/MessageGenerator';
import Header from './components/Header';

function App() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'message'>('campaigns');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'campaigns' ? <Campaigns /> : <MessageGenerator />}
      </main>
    </div>
  );
}

export default App;
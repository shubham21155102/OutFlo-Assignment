import React, { useState } from 'react';
import Campaigns from './components/Campaigns';
import MessageGenerator from './components/MessageGenerator';
import Leads from './components/Leads'; // Make sure this component exists
import Header from './components/Header';

function App() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'message' | 'leads'>('campaigns');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'campaigns' && <Campaigns />}
        {activeTab === 'message' && <MessageGenerator />}
        {activeTab === 'leads' && <Leads/>}
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
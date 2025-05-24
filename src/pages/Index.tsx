
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { NewVisit } from '@/components/NewVisit';
import { CustomerList } from '@/components/CustomerList';
import { RewardsTracker } from '@/components/RewardsTracker';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'newVisit':
        return <NewVisit onNavigate={handleNavigate} />;
      case 'customerList':
        return <CustomerList onNavigate={handleNavigate} />;
      case 'rewardsTracker':
        return <RewardsTracker onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
};

export default Index;

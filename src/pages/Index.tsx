
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { NewVisitEnhanced } from '@/components/NewVisitEnhanced';
import { CustomerList } from '@/components/CustomerList';
import { CustomerProfile } from '@/components/CustomerProfile';
import { RewardsTracker } from '@/components/RewardsTracker';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const handleNavigate = (screen: string, customerId?: string) => {
    setCurrentScreen(screen);
    if (customerId) {
      setSelectedCustomerId(customerId);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'newVisit':
        return <NewVisitEnhanced onNavigate={handleNavigate} />;
      case 'customerList':
        return <CustomerList onNavigate={handleNavigate} />;
      case 'customerProfile':
        return <CustomerProfile onNavigate={handleNavigate} customerId={selectedCustomerId} />;
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

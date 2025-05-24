
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock, RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { Database } from '@/utils/database';
import { useToast } from '@/hooks/use-toast';

interface CustomerProfileProps {
  onNavigate: (screen: string) => void;
  customerId: string;
}

export const CustomerProfile = ({ onNavigate, customerId }: CustomerProfileProps) => {
  const [customer, setCustomer] = useState<any>(null);
  const [visitHistory, setVisitHistory] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const customers = Database.getCustomers();
    const foundCustomer = customers.find(c => c.id === customerId);
    setCustomer(foundCustomer);

    if (foundCustomer) {
      const visits = Database.getCustomerVisits(customerId);
      setVisitHistory(visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [customerId]);

  const handleLogVisit = () => {
    if (!customer) return;

    const newVisit = {
      id: Date.now().toString(),
      customerId: customer.id,
      date: new Date().toISOString(),
      visitNumber: customer.visits + 1
    };

    Database.addVisit(newVisit);

    const updatedCustomer = {
      ...customer,
      visits: customer.visits + 1,
      lastVisit: new Date().toISOString()
    };

    Database.updateCustomer(updatedCustomer);
    setCustomer(updatedCustomer);
    setVisitHistory([newVisit, ...visitHistory]);

    toast({
      title: "Visit Logged",
      description: `Visit #${updatedCustomer.visits} logged for ${customer.name}`,
    });
  };

  const handleResetProgress = () => {
    if (!customer) return;

    const resetCustomer = {
      ...customer,
      visits: 0,
      rewardGiven: false
    };

    Database.updateCustomer(resetCustomer);
    setCustomer(resetCustomer);

    toast({
      title: "Progress Reset",
      description: `Loyalty progress reset for ${customer.name}`,
    });
  };

  if (!customer) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('customerList')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Customer Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('customerList')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Customer Profile</h1>
      </div>

      {/* Customer Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">{customer.name}</h3>
              <p className="text-gray-600 mb-4">📞 {customer.phone}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Customer since: {new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="mb-4">
                <StarRating current={customer.visits} total={5} size="lg" />
              </div>
              
              {customer.visits >= 5 && !customer.rewardGiven && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-800 font-medium">🎁 Reward Ready!</p>
                  <p className="text-green-600 text-sm">Free service available</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  onClick={handleLogVisit}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Log Visit
                </Button>
                <Button
                  onClick={handleResetProgress}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Progress
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visit History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visit History ({visitHistory.length} visits)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visitHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No visits recorded yet</p>
          ) : (
            <div className="space-y-3">
              {visitHistory.map((visit, index) => (
                <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Visit #{visit.visitNumber || visitHistory.length - index}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(visit.date).toLocaleDateString()} at {new Date(visit.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {index === 0 ? 'Latest' : `${Math.floor((new Date().getTime() - new Date(visit.date).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

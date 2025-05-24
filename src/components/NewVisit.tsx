
import { useState } from 'react';
import { ArrowLeft, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { Database } from '@/utils/database';
import { toast } from '@/hooks/use-toast';

interface NewVisitProps {
  onNavigate: (screen: string) => void;
}

export const NewVisit = ({ onNavigate }: NewVisitProps) => {
  const [phone, setPhone] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchCustomer = () => {
    if (!phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    const foundCustomer = Database.findCustomerByPhone(phone);
    setCustomer(foundCustomer);
    setIsSearching(false);

    if (!foundCustomer) {
      toast({
        title: "New Customer",
        description: "Customer not found. Please add their name to create a new profile.",
      });
    }
  };

  const createNewCustomer = () => {
    if (!newCustomerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive"
      });
      return;
    }

    const newCustomer = {
      id: Date.now().toString(),
      name: newCustomerName,
      phone: phone,
      visits: 0,
      lastVisit: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      rewardGiven: false
    };

    Database.addCustomer(newCustomer);
    setCustomer(newCustomer);
    toast({
      title: "Success",
      description: `Welcome ${newCustomerName}! Profile created successfully.`,
    });
  };

  const logVisit = () => {
    if (!customer) return;

    const updatedCustomer = {
      ...customer,
      visits: customer.visits + 1,
      lastVisit: new Date().toISOString()
    };

    Database.updateCustomer(updatedCustomer);

    const visit = {
      id: Date.now().toString(),
      customerId: customer.id,
      visitDate: new Date().toISOString()
    };

    Database.addVisit(visit);

    // Simulate SMS notification
    let message = '';
    if (updatedCustomer.visits === 1) {
      message = `Thanks for visiting Furaha! Visit 4 more times and your next service is FREE! ✨`;
    } else if (updatedCustomer.visits < 5) {
      const remaining = 5 - updatedCustomer.visits;
      message = `That's visit #${updatedCustomer.visits}, ${customer.name}! Just ${remaining} more for your free service 🎉`;
    } else {
      message = `🎊 Congratulations ${customer.name}! You've earned a FREE service! Show this to redeem.`;
    }

    toast({
      title: "Visit Logged Successfully",
      description: message,
    });

    // Reset form
    setPhone('');
    setCustomer(null);
    setNewCustomerName('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">New Visit</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enter Customer Phone Number</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchCustomer} disabled={isSearching}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {customer === null && phone && !isSearching && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              New Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter customer name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
            <Button onClick={createNewCustomer} className="w-full">
              Start Loyalty Tracking
            </Button>
          </CardContent>
        </Card>
      )}

      {customer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customer Found</span>
              <Check className="h-5 w-5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-lg">{customer.name}</p>
              <p className="text-gray-600">{customer.phone}</p>
              <p className="text-sm text-gray-500">
                Last visit: {new Date(customer.lastVisit).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Loyalty Progress:</p>
              <StarRating current={customer.visits} total={5} size="lg" />
            </div>

            <Button onClick={logVisit} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Log Visit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

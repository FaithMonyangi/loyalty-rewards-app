
import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/utils/database';
import { useToast } = from '@/hooks/use-toast';

interface NewVisitEnhancedProps {
  onNavigate: (screen: string) => void;
}

export const NewVisitEnhanced = ({ onNavigate }: NewVisitEnhancedProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [existingCustomer, setExistingCustomer] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (phoneNumber.length >= 3) {
      const customers = Database.getCustomers();
      const filtered = customers.filter(customer =>
        customer.phone.includes(phoneNumber) ||
        customer.name.toLowerCase().includes(phoneNumber.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Check if exact phone number exists
    const customer = Database.findCustomerByPhone(phoneNumber);
    setExistingCustomer(customer);
  }, [phoneNumber]);

  const handleSuggestionClick = (customer: any) => {
    setPhoneNumber(customer.phone);
    setCustomerName(customer.name);
    setExistingCustomer(customer);
    setShowSuggestions(false);
  };

  const handleCreateCustomer = () => {
    if (!phoneNumber || !customerName) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and name",
        variant: "destructive"
      });
      return;
    }

    const newCustomer = {
      id: Date.now().toString(),
      name: customerName,
      phone: phoneNumber,
      visits: 1,
      rewardGiven: false,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString()
    };

    Database.addCustomer(newCustomer);

    const firstVisit = {
      id: Date.now().toString(),
      customerId: newCustomer.id,
      date: new Date().toISOString(),
      visitNumber: 1
    };

    Database.addVisit(firstVisit);

    toast({
      title: "Customer Added",
      description: `${customerName} has been added with their first visit logged!`,
    });

    setPhoneNumber('');
    setCustomerName('');
    setExistingCustomer(null);
  };

  const handleLogVisit = () => {
    if (!existingCustomer) return;

    const newVisit = {
      id: Date.now().toString(),
      customerId: existingCustomer.id,
      date: new Date().toISOString(),
      visitNumber: existingCustomer.visits + 1
    };

    Database.addVisit(newVisit);

    const updatedCustomer = {
      ...existingCustomer,
      visits: existingCustomer.visits + 1,
      lastVisit: new Date().toISOString()
    };

    Database.updateCustomer(updatedCustomer);

    toast({
      title: "Visit Logged",
      description: `Visit #${updatedCustomer.visits} logged for ${existingCustomer.name}`,
    });

    setPhoneNumber('');
    setCustomerName('');
    setExistingCustomer(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter phone number or search customer"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {customer.visits}/5 visits
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {existingCustomer ? (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{existingCustomer.name}</h3>
                    <p className="text-gray-600">{existingCustomer.phone}</p>
                    <p className="text-sm text-gray-500">
                      Current progress: {existingCustomer.visits}/5 visits
                    </p>
                    <p className="text-sm text-gray-500">
                      Last visit: {new Date(existingCustomer.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleLogVisit}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Log Visit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : phoneNumber && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-600">
                <User className="h-4 w-4" />
                <span className="font-medium">New customer! Add name to start tracking</span>
              </div>
              
              <Input
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              
              <Button
                onClick={handleCreateCustomer}
                disabled={!customerName}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Start Loyalty Tracking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

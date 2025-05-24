import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, User, Search, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/utils/database';
import { WhatsAppService } from '@/utils/whatsapp';
import { useToast } from '@/hooks/use-toast';

interface NewVisitEnhancedProps {
  onNavigate: (screen: string) => void;
}

export const NewVisitEnhanced = ({ onNavigate }: NewVisitEnhancedProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [existingCustomer, setExistingCustomer] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visitLogged, setVisitLogged] = useState(false);
  const [lastLoggedCustomer, setLastLoggedCustomer] = useState<any>(null);
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
      title: "🎉 Welcome to Furaha!",
      description: `${customerName} has been added with their first visit logged! ✨`,
    });

    setLastLoggedCustomer(newCustomer);
    setVisitLogged(true);
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

    let title = "";
    let description = "";
    
    if (updatedCustomer.visits === 5) {
      title = "🎊 REWARD UNLOCKED!";
      description = `${existingCustomer.name} earned their FREE service! Time to celebrate! 🎉`;
    } else {
      title = "✅ Visit Logged!";
      description = `Visit #${updatedCustomer.visits} for ${existingCustomer.name} - ${5 - updatedCustomer.visits} more for reward! ⭐`;
    }

    toast({
      title,
      description,
    });

    setLastLoggedCustomer(updatedCustomer);
    setVisitLogged(true);
    setPhoneNumber('');
    setCustomerName('');
    setExistingCustomer(null);
  };

  const handleSendWhatsApp = () => {
    if (!lastLoggedCustomer) return;
    
    try {
      WhatsAppService.sendMessage(
        lastLoggedCustomer.phone,
        lastLoggedCustomer.name,
        lastLoggedCustomer.visits
      );
      
      toast({
        title: "📱 WhatsApp Opened!",
        description: "Message prepared and ready to send. Just click send in WhatsApp!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open WhatsApp. Please check the phone number.",
        variant: "destructive"
      });
    }
  };

  const handleStartNew = () => {
    setVisitLogged(false);
    setLastLoggedCustomer(null);
  };

  if (visitLogged && lastLoggedCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="mr-4 hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-brand-primary to-brand-accent rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold font-heading text-gradient">Visit Logged! 🎉</h1>
            </div>
          </div>

          {/* Success Card */}
          <Card className="hover-lift border-0 shadow-xl bg-white/70 backdrop-blur-sm mb-6">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  ✅ Visit Successfully Logged!
                </h2>
                <p className="text-gray-600">
                  <strong>{lastLoggedCustomer.name}</strong> now has <strong>{lastLoggedCustomer.visits}</strong> visit{lastLoggedCustomer.visits !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                        star <= lastLoggedCustomer.visits
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      ⭐
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {lastLoggedCustomer.visits >= 5 
                    ? "🎁 FREE SERVICE UNLOCKED!" 
                    : `${5 - lastLoggedCustomer.visits} more visit${5 - lastLoggedCustomer.visits !== 1 ? 's' : ''} to FREE service`
                  }
                </p>
              </div>

              {/* WhatsApp Button */}
              <div className="space-y-4">
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="h-6 w-6 mr-3" />
                  📱 Send WhatsApp Message
                </Button>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    📋 Preview Message:
                  </p>
                  <p className="text-sm text-green-700 italic">
                    "{WhatsAppService.generateMessage(lastLoggedCustomer.name, lastLoggedCustomer.visits)}"
                  </p>
                </div>

                <Button
                  onClick={handleStartNew}
                  variant="outline"
                  className="w-full h-12 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold rounded-xl"
                >
                  Log Another Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('dashboard')}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-brand-primary to-brand-accent rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-gradient">New Visit</h1>
          </div>
        </div>

        <Card className="hover-lift border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Phone className="h-5 w-5 text-brand-primary" />
              </div>
              <span className="font-heading">✨ Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-primary/60" />
                <Input
                  placeholder="🔍 Enter phone number or search customer..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-brand-primary/20 focus:border-brand-primary rounded-xl"
                />
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white border-2 border-brand-primary/20 rounded-xl shadow-xl max-h-60 overflow-auto animate-slide-up">
                  {suggestions.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-4 hover:bg-brand-primary/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleSuggestionClick(customer)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{customer.name}</p>
                          <p className="text-sm text-gray-600">📞 {customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-brand-primary font-medium">
                            ⭐ {customer.visits}/5 visits
                          </div>
                          {customer.visits >= 5 && !customer.rewardGiven && (
                            <div className="text-xs text-green-600 font-bold">🎁 Reward Ready!</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {existingCustomer ? (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 animate-bounce-in">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-blue-800 mb-1">{existingCustomer.name}</h3>
                      <p className="text-blue-600 font-medium mb-2">📞 {existingCustomer.phone}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-blue-700">
                          <strong>Progress:</strong> ⭐ {existingCustomer.visits}/5 visits
                        </p>
                        <p className="text-sm text-blue-700">
                          <strong>Last visit:</strong> 📅 {new Date(existingCustomer.lastVisit).toLocaleDateString()}
                        </p>
                      </div>
                      {existingCustomer.visits >= 5 && !existingCustomer.rewardGiven && (
                        <div className="mt-3 px-3 py-1 bg-green-100 border border-green-300 rounded-lg inline-block">
                          <span className="text-green-800 font-bold text-sm">🎁 FREE SERVICE READY!</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleLogVisit}
                      className="gradient-primary text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Log Visit ✨
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : phoneNumber && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 text-brand-secondary p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                  <User className="h-6 w-6" />
                  <span className="font-bold text-lg">🌟 New customer! Let's start their loyalty journey</span>
                </div>
                
                <Input
                  placeholder="✍️ Enter customer name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-12 text-lg border-2 border-brand-secondary/20 focus:border-brand-secondary rounded-xl"
                />
                
                <Button
                  onClick={handleCreateCustomer}
                  disabled={!customerName}
                  className="w-full h-12 gradient-primary text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  🚀 Start Loyalty Tracking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

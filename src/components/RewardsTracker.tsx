
import { useState, useEffect } from 'react';
import { ArrowLeft, Gift, Send, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from './StarRating';
import { Database } from '@/utils/database';
import { toast } from '@/hooks/use-toast';

interface RewardsTrackerProps {
  onNavigate: (screen: string) => void;
}

export const RewardsTracker = ({ onNavigate }: RewardsTrackerProps) => {
  const [rewardsReady, setRewardsReady] = useState<any[]>([]);
  const [closeToRewards, setCloseToRewards] = useState<any[]>([]);

  useEffect(() => {
    const customers = Database.getCustomers();
    const ready = customers.filter(c => c.visits >= 5 && !c.rewardGiven);
    const close = customers.filter(c => c.visits === 4);
    
    setRewardsReady(ready);
    setCloseToRewards(close);
  }, []);

  const markRewardGiven = (customerId: string) => {
    const customers = Database.getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const updatedCustomer = { ...customer, rewardGiven: true, visits: 0 };
      Database.updateCustomer(updatedCustomer);
      
      setRewardsReady(prev => prev.filter(c => c.id !== customerId));
      
      toast({
        title: "Reward Marked as Given",
        description: `${customer.name}'s loyalty counter has been reset.`,
      });
    }
  };

  const sendEncouragementSMS = (customer: any) => {
    const message = `Hi ${customer.name}! You're so close to your FREE service - just 1 more visit to go! We can't wait to see you again at Furaha! 🌟`;
    
    toast({
      title: "Encouragement SMS Sent",
      description: message,
    });
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
        <h1 className="text-2xl font-bold">Rewards Tracker</h1>
      </div>

      <Tabs defaultValue="ready" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ready" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Ready ({rewardsReady.length})
          </TabsTrigger>
          <TabsTrigger value="close" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Close ({closeToRewards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ready" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🎉 Rewards Ready to Give</CardTitle>
            </CardHeader>
            <CardContent>
              {rewardsReady.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No rewards ready yet. Keep encouraging those visits! 🌟
                </p>
              ) : (
                <div className="space-y-4">
                  {rewardsReady.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <h3 className="font-medium text-lg">{customer.name}</h3>
                        <p className="text-gray-600">{customer.phone}</p>
                        <StarRating current={customer.visits} total={5} size="md" />
                      </div>
                      <Button
                        onClick={() => markRewardGiven(customer.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark as Given
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="close" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">🔥 Close to Earning Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              {closeToRewards.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No customers close to rewards yet. Keep building loyalty! 💪
                </p>
              ) : (
                <div className="space-y-4">
                  {closeToRewards.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <h3 className="font-medium text-lg">{customer.name}</h3>
                        <p className="text-gray-600">{customer.phone}</p>
                        <StarRating current={customer.visits} total={5} size="md" />
                        <p className="text-sm text-orange-600 font-medium">Just 1 more visit!</p>
                      </div>
                      <Button
                        onClick={() => sendEncouragementSMS(customer)}
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Encouragement
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

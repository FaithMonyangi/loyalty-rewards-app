
import { useEffect, useState } from 'react';
import { Users, Gift, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/utils/database';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    nearRewards: 0,
    rewardsReady: 0
  });

  useEffect(() => {
    const customers = Database.getCustomers();
    const totalCustomers = customers.length;
    const nearRewards = customers.filter(c => c.visits >= 4 && c.visits < 5).length;
    const rewardsReady = customers.filter(c => c.visits >= 5 && !c.rewardGiven).length;
    
    setStats({ totalCustomers, nearRewards, rewardsReady });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Furaha Loyalty App! 🎉
        </h1>
        <p className="text-gray-600">Track visits, reward loyalty, grow your business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Near Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.nearRewards}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Ready</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.rewardsReady}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-20 text-lg bg-emerald-600 hover:bg-emerald-700"
          onClick={() => onNavigate('newVisit')}
        >
          <Plus className="mr-2 h-6 w-6" />
          New Visit
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-20 text-lg"
          onClick={() => onNavigate('customerList')}
        >
          <Users className="mr-2 h-6 w-6" />
          Customer List
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-20 text-lg"
          onClick={() => onNavigate('rewardsTracker')}
        >
          <Gift className="mr-2 h-6 w-6" />
          Rewards Tracker
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-20 text-lg"
          onClick={() => onNavigate('settings')}
        >
          <Settings className="mr-2 h-6 w-6" />
          Settings
        </Button>
      </div>
    </div>
  );
};

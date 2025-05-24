
import { useEffect, useState } from 'react';
import { Users, Gift, TrendingUp, Plus, Settings, BarChart3, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold font-heading text-gradient">
              Furaha Loyalty Hub
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-medium">✨ Track visits, reward loyalty, grow your business ✨</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-700">👥 Total Customers</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{stats.totalCustomers}</div>
              <p className="text-xs text-blue-600 mt-1">Growing strong! 💪</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-100 border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-700">🔥 Close to Rewards</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800">{stats.nearRewards}</div>
              <p className="text-xs text-orange-600 mt-1">Almost there! ⭐</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-700">🎁 Rewards Ready</CardTitle>
              <Gift className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">{stats.rewardsReady}</div>
              <p className="text-xs text-green-600 mt-1">Time to celebrate! 🎉</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Button
            size="lg"
            className="h-24 text-lg font-semibold gradient-primary hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
            onClick={() => onNavigate('newVisit')}
          >
            <div className="flex flex-col items-center gap-2">
              <Plus className="h-8 w-8" />
              <span>✨ New Visit</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg font-semibold border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 hover:scale-105 hover-lift"
            onClick={() => onNavigate('customerList')}
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8" />
              <span>👥 Customers</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg font-semibold border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-105 hover-lift"
            onClick={() => onNavigate('rewardsTracker')}
          >
            <div className="flex flex-col items-center gap-2">
              <Gift className="h-8 w-8" />
              <span>🎁 Rewards</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg font-semibold border-2 border-brand-info text-brand-info hover:bg-brand-info hover:text-white transition-all duration-300 hover:scale-105 hover-lift"
            onClick={() => onNavigate('analytics')}
          >
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              <span>📊 Analytics</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg font-semibold border-2 border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 hover:scale-105 hover-lift"
            onClick={() => onNavigate('settings')}
          >
            <div className="flex flex-col items-center gap-2">
              <Settings className="h-8 w-8" />
              <span>⚙️ Settings</span>
            </div>
          </Button>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">💡 Quick tip: Regular visits = happy customers = growing business!</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <Sparkles className="h-4 w-4 text-brand-primary" />
            <span className="text-sm font-medium text-gray-700">Making loyalty magical, one visit at a time</span>
            <Sparkles className="h-4 w-4 text-brand-accent" />
          </div>
        </div>
      </div>
    </div>
  );
};

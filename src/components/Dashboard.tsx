
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
    const nearRewards = customers.filter(c => c.visits === 4).length;
    const rewardsReady = customers.filter(c => c.visits >= 5 && !c.rewardGiven).length;
    
    setStats({ totalCustomers, nearRewards, rewardsReady });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-brand-primary to-brand-accent rounded-2xl shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold font-heading text-gradient mb-2">
                Furaha Loyalty Hub
              </h1>
              <p className="text-xl text-gray-600 font-medium">✨ Track visits, reward loyalty, grow your business ✨</p>
            </div>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">📊 Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-l-blue-500 transform transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-semibold text-blue-700">👥 Total Customers</CardTitle>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-800 mb-2">{stats.totalCustomers}</div>
                <p className="text-sm text-blue-600 font-medium">Growing strong! 💪</p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-100 border-l-4 border-l-orange-500 transform transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-semibold text-orange-700">🔥 Close to Rewards</CardTitle>
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-800 mb-2">{stats.nearRewards}</div>
                <p className="text-sm text-orange-600 font-medium">4 stars - almost there! ⭐⭐⭐⭐</p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 border-l-4 border-l-green-500 transform transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-semibold text-green-700">🎁 Rewards Ready</CardTitle>
                <div className="p-3 bg-green-100 rounded-full">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-800 mb-2">{stats.rewardsReady}</div>
                <p className="text-sm text-green-600 font-medium">Time to celebrate! 🎉</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Actions Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">🚀 Quick Actions</h2>
          
          {/* Primary Action - New Visit */}
          <div className="mb-8">
            <Button
              size="lg"
              className="w-full h-32 text-2xl font-bold gradient-primary hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 rounded-2xl"
              onClick={() => onNavigate('newVisit')}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white/20 rounded-full">
                  <Plus className="h-12 w-12" />
                </div>
                <span>✨ Log New Visit</span>
              </div>
            </Button>
          </div>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button
              size="lg"
              variant="outline"
              className="h-28 text-lg font-semibold border-3 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 hover:scale-105 hover-lift rounded-xl"
              onClick={() => onNavigate('customerList')}
            >
              <div className="flex flex-col items-center gap-3">
                <Users className="h-8 w-8" />
                <span>👥 Customers</span>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-28 text-lg font-semibold border-3 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-105 hover-lift rounded-xl"
              onClick={() => onNavigate('rewardsTracker')}
            >
              <div className="flex flex-col items-center gap-3">
                <Gift className="h-8 w-8" />
                <span>🎁 Rewards</span>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-28 text-lg font-semibold border-3 border-brand-info text-brand-info hover:bg-brand-info hover:text-white transition-all duration-300 hover:scale-105 hover-lift rounded-xl"
              onClick={() => onNavigate('analytics')}
            >
              <div className="flex flex-col items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                <span>📊 Analytics</span>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-28 text-lg font-semibold border-3 border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 hover:scale-105 hover-lift rounded-xl"
              onClick={() => onNavigate('settings')}
            >
              <div className="flex flex-col items-center gap-3">
                <Settings className="h-8 w-8" />
                <span>⚙️ Settings</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100">
            <Sparkles className="h-5 w-5 text-brand-primary animate-pulse" />
            <span className="text-lg font-medium text-gray-700">Making loyalty magical, one visit at a time</span>
            <Sparkles className="h-5 w-5 text-brand-accent animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 mt-6">💡 Quick tip: Regular visits = happy customers = growing business!</p>
        </div>
      </div>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, Gift, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Database } from '@/utils/database';

interface AnalyticsProps {
  onNavigate: (screen: string) => void;
}

export const Analytics = ({ onNavigate }: AnalyticsProps) => {
  const [overviewStats, setOverviewStats] = useState({
    totalCustomers: 0,
    visitsThisWeek: 0,
    rewardsGiven: 0,
    mostLoyalCustomer: { name: '', visits: 0 }
  });

  const [visitTrends, setVisitTrends] = useState<any[]>([]);
  const [dailyVisits, setDailyVisits] = useState<any[]>([]);
  const [loyaltyLevels, setLoyaltyLevels] = useState<any[]>([]);

  useEffect(() => {
    const customers = Database.getCustomers();
    const visits = Database.getAllVisits();
    
    // Overview stats
    const totalCustomers = customers.length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const visitsThisWeek = visits.filter(v => new Date(v.date) > weekAgo).length;
    const rewardsGiven = customers.filter(c => c.rewardGiven).length;
    const mostLoyal = customers.reduce((max, customer) => 
      customer.visits > max.visits ? customer : max, { name: 'None', visits: 0 });
    
    setOverviewStats({
      totalCustomers,
      visitsThisWeek,
      rewardsGiven,
      mostLoyalCustomer: mostLoyal
    });

    // Visit trends (last 7 days)
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayVisits = visits.filter(v => {
        const visitDate = new Date(v.date);
        return visitDate.toDateString() === date.toDateString();
      }).length;
      
      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visits: dayVisits
      });
    }
    setVisitTrends(trends);

    // Daily visits (by day of week)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData = dayNames.map(day => ({
      day,
      visits: visits.filter(v => {
        const visitDate = new Date(v.date);
        return dayNames[visitDate.getDay()] === day;
      }).length
    }));
    setDailyVisits(dailyData);

    // Loyalty levels
    const levels = [
      { name: '1-2 visits', value: customers.filter(c => c.visits >= 1 && c.visits <= 2).length, color: '#EF4444' },
      { name: '3-4 visits', value: customers.filter(c => c.visits >= 3 && c.visits <= 4).length, color: '#F59E0B' },
      { name: '5+ visits', value: customers.filter(c => c.visits >= 5).length, color: '#10B981' }
    ];
    setLoyaltyLevels(levels);
  }, []);

  const COLORS = ['#EF4444', '#F59E0B', '#10B981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="p-6 max-w-7xl mx-auto">
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
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-gradient">Analytics Dashboard</h1>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-700">👥 Total Customers</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{overviewStats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-700">📅 Visits This Week</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{overviewStats.visitsThisWeek}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-700">🎁 Rewards Given</CardTitle>
              <Gift className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{overviewStats.rewardsGiven}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-yellow-700">⭐ Most Loyal</CardTitle>
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-yellow-800">{overviewStats.mostLoyalCustomer.name}</div>
              <div className="text-sm text-yellow-600">{overviewStats.mostLoyalCustomer.visits} visits</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visit Trends */}
          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                📈 Visits Over Time (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#EC4899' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Visits */}
          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                📊 Visits by Day of Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyVisits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Bar 
                    dataKey="visits" 
                    fill="url(#colorGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Loyalty Levels */}
          <Card className="hover-lift border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                🧑‍🤝‍🧑 Customer Loyalty Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={loyaltyLevels}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {loyaltyLevels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="lg:ml-8 mt-4 lg:mt-0">
                  <h3 className="font-semibold mb-4 text-lg">Legend</h3>
                  {loyaltyLevels.map((level, index) => (
                    <div key={level.name} className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      ></div>
                      <span className="text-sm font-medium">{level.name}: {level.value} customers</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="mt-8 hover-lift border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-brand-primary">
              💡 Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">🎯 Growth Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Focus on converting 1-2 visit customers to regulars</li>
                  <li>• Send reminders to customers close to rewards</li>
                  <li>• Identify and replicate your busiest day strategies</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">🏆 Success Metrics</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Customer retention improving week over week</li>
                  <li>• Rewards program driving repeat visits</li>
                  <li>• Loyal customers becoming brand ambassadors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

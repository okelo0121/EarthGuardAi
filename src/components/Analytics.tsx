import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../lib/supabase';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);

    const [envData, reports, predictions] = await Promise.all([
      supabase.from('environmental_data').select('*').order('recorded_at', { ascending: false }).limit(100),
      supabase.from('community_reports').select('*'),
      supabase.from('predictions').select('*'),
    ]);

    if (envData.data && reports.data && predictions.data) {
      const severityCount = envData.data.reduce((acc: any, item) => {
        acc[item.severity_level] = (acc[item.severity_level] || 0) + 1;
        return acc;
      }, {});

      const typeCount = envData.data.reduce((acc: any, item) => {
        acc[item.data_type] = (acc[item.data_type] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalRecords: envData.data.length,
        totalReports: reports.data.length,
        totalPredictions: predictions.data.length,
        criticalAlerts: envData.data.filter(d => d.severity_level === 'critical').length,
        severityData: Object.entries(severityCount).map(([name, value]) => ({ name, value })),
        typeData: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
        trendData: generateTrendData(envData.data),
      });
    }

    setLoading(false);
  };

  const generateTrendData = (data: any[]) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = data.filter(d => d.recorded_at.startsWith(dateStr));
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        alerts: dayData.length,
        critical: dayData.filter(d => d.severity_level === 'critical').length,
      });
    }
    return last7Days;
  };

  const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#10b981'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Environmental Analytics</h2>
        <p className="text-sm sm:text-base text-slate-300">Real-time insights from global monitoring systems</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-lg p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-blue-300" />
          </div>
          <p className="text-blue-200 text-sm mb-1">Total Data Points</p>
          <p className="text-3xl font-bold text-white">{stats?.totalRecords || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-lg p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-green-400" />
            <TrendingUp className="w-5 h-5 text-green-300" />
          </div>
          <p className="text-green-200 text-sm mb-1">Community Reports</p>
          <p className="text-3xl font-bold text-white">{stats?.totalReports || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-purple-400" />
            <TrendingUp className="w-5 h-5 text-purple-300" />
          </div>
          <p className="text-purple-200 text-sm mb-1">AI Predictions</p>
          <p className="text-3xl font-bold text-white">{stats?.totalPredictions || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-lg rounded-lg p-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <TrendingDown className="w-5 h-5 text-red-300" />
          </div>
          <p className="text-red-200 text-sm mb-1">Critical Alerts</p>
          <p className="text-3xl font-bold text-white">{stats?.criticalAlerts || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Alert Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Line type="monotone" dataKey="alerts" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.severityData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(stats?.severityData || []).map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-white/20">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Data Type Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats?.typeData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Award, TrendingUp, Activity, Target, Calendar, MapPin } from 'lucide-react';

interface UserDashboardProps {
  session: any;
}

export default function UserDashboard({ session }: UserDashboardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);

    const [profileData, actionsData] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', session.user.id).maybeSingle(),
      supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (profileData.data) {
      setProfile(profileData.data);
    } else {
      const newProfile = {
        id: session.user.id,
        role: 'citizen',
        total_impact_score: 0,
      };
      await supabase.from('user_profiles').insert(newProfile);
      setProfile(newProfile);
    }

    if (actionsData.data) {
      setActions(actionsData.data);
    }

    setLoading(false);
  };

  const getActionIcon = (type: string) => {
    const icons: Record<string, any> = {
      report_submitted: MapPin,
      data_verified: Award,
      tree_planted: Activity,
      cleanup_attended: Target,
    };
    return icons[type] || Activity;
  };

  const achievements = [
    { id: 1, name: 'First Report', description: 'Submitted your first environmental report', earned: actions.length > 0, icon: MapPin },
    { id: 2, name: 'Active Monitor', description: 'Submitted 5+ reports', earned: actions.length >= 5, icon: Activity },
    { id: 3, name: 'Champion', description: 'Earned 100+ impact points', earned: (profile?.total_impact_score || 0) >= 100, icon: Award },
    { id: 4, name: 'Dedicated', description: 'Active for 7+ days', earned: false, icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Impact Dashboard</h2>
        <p className="text-sm sm:text-base text-slate-300">Track your contributions to environmental protection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-emerald-200 text-sm mb-1">Total Impact Score</p>
          <p className="text-4xl font-bold text-white">{profile?.total_impact_score || 0}</p>
          <p className="text-xs text-emerald-300 mt-2">Keep monitoring to earn more!</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-blue-200 text-sm mb-1">Actions Taken</p>
          <p className="text-4xl font-bold text-white">{actions.length}</p>
          <p className="text-xs text-blue-300 mt-2">Reports and verifications</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-purple-200 text-sm mb-1">Role</p>
          <p className="text-2xl font-bold text-white capitalize">{profile?.role || 'Citizen'}</p>
          <p className="text-xs text-purple-300 mt-2">Making a difference</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-white/20">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.earned
                    ? 'bg-emerald-500/20 border-emerald-500/50'
                    : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-8 h-8 ${achievement.earned ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{achievement.name}</h4>
                    <p className="text-sm text-slate-300">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-white/20">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Recent Activity</h3>
        {actions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activity yet. Start by submitting a report!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action) => {
              const Icon = getActionIcon(action.action_type);
              return (
                <div
                  key={action.id}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium capitalize">
                      {action.action_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(action.created_at).toLocaleDateString()} at{' '}
                      {new Date(action.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">+{action.impact_score}</p>
                    <p className="text-xs text-slate-400">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

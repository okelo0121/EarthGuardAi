import { useState } from 'react';
import { Map, BarChart3, AlertTriangle, Users, TrendingUp, MessageSquare, Menu, X } from 'lucide-react';
import MapView from './MapView';
import Analytics from './Analytics';
import Predictions from './Predictions';
import CommunityReports from './CommunityReports';
import AIChat from './AIChat';
import UserDashboard from './UserDashboard';

interface DashboardProps {
  session: any;
}

type ViewType = 'map' | 'analytics' | 'predictions' | 'community' | 'chat' | 'profile';

export default function Dashboard({ session }: DashboardProps) {
  const [activeView, setActiveView] = useState<ViewType>('map');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'map' as ViewType, label: 'Live Map', icon: Map },
    { id: 'analytics' as ViewType, label: 'Analytics', icon: BarChart3 },
    { id: 'predictions' as ViewType, label: 'Predictions', icon: TrendingUp },
    { id: 'community' as ViewType, label: 'Community', icon: Users },
    { id: 'chat' as ViewType, label: 'AI Assistant', icon: MessageSquare },
    { id: 'profile' as ViewType, label: 'My Impact', icon: AlertTriangle },
  ];

  const handleNavClick = (viewId: ViewType) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] relative">
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-xl hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
        >
          <Menu className="w-5 h-5" />
          <span className="text-sm font-semibold">Menu</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <nav className={`
        fixed lg:relative top-0 left-0 bottom-0
        w-80 lg:w-64
        bg-slate-900/98 lg:bg-slate-900/50 backdrop-blur-lg
        border-r border-white/10
        p-4 lg:p-4
        z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="flex items-center justify-between mb-6 lg:hidden border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white">Navigation</h3>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === item.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30 hidden lg:block">
          <h3 className="text-sm font-semibold text-emerald-300 mb-2">Quick Stats</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Active Monitors:</span>
              <span className="text-white font-semibold">1,247</span>
            </div>
            <div className="flex justify-between">
              <span>Reports Today:</span>
              <span className="text-white font-semibold">89</span>
            </div>
            <div className="flex justify-between">
              <span>Critical Alerts:</span>
              <span className="text-red-400 font-semibold">12</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {activeView === 'map' && <MapView session={session} />}
        {activeView === 'analytics' && <Analytics />}
        {activeView === 'predictions' && <Predictions />}
        {activeView === 'community' && <CommunityReports session={session} />}
        {activeView === 'chat' && <AIChat />}
        {activeView === 'profile' && <UserDashboard session={session} />}
      </main>
    </div>
  );
}

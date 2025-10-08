import { Globe, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  session: any;
}

export default function Header({ session }: HeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-emerald-400" />
            <div>
              <h1 className="text-xl font-bold text-white">EarthGuard AI</h1>
              <p className="text-xs text-emerald-300">Environmental Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white">{session.user.email}</p>
              <p className="text-xs text-slate-400">Monitoring our planet</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

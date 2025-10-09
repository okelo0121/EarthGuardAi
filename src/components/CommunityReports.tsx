import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, MapPin, ThumbsUp, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';

interface CommunityReportsProps {
  session: any;
}

export default function CommunityReports({ session }: CommunityReportsProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    report_type: 'pollution',
    description: '',
    severity: 'medium',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const location = {
      type: 'Point',
      coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
    };

    const { error } = await supabase.from('community_reports').insert({
      user_id: session.user.id,
      report_type: formData.report_type,
      location: JSON.stringify(location),
      description: formData.description,
      severity: formData.severity,
    });

    if (!error) {
      setShowForm(false);
      setFormData({
        report_type: 'pollution',
        description: '',
        severity: 'medium',
        latitude: '',
        longitude: '',
      });
      loadReports();

      await supabase.from('user_actions').insert({
        user_id: session.user.id,
        action_type: 'report_submitted',
        action_details: { report_type: formData.report_type },
        impact_score: 10,
      });
    }
  };

  const handleUpvote = async (reportId: string, currentUpvotes: number) => {
    await supabase
      .from('community_reports')
      .update({ upvotes: currentUpvotes + 1 })
      .eq('id', reportId);

    loadReports();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      verified: 'bg-green-500/20 text-green-300 border-green-500/30',
      investigating: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      resolved: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      verified: CheckCircle,
      investigating: AlertCircle,
      resolved: CheckCircle,
    };
    return icons[status] || Clock;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Community Reports</h2>
          <p className="text-sm sm:text-base text-slate-300">Help monitor environmental changes in your area</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Submit Report
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">New Environmental Report</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Report Type</label>
                <select
                  value={formData.report_type}
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  required
                >
                  <option value="pollution">Pollution</option>
                  <option value="deforestation">Deforestation</option>
                  <option value="wildlife">Wildlife Issue</option>
                  <option value="water">Water Quality</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white h-24"
                placeholder="Describe what you observed..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="e.g., 40.7128"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="e.g., -74.0060"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {reports.length === 0 ? (
          <div className="col-span-full bg-white/10 backdrop-blur-lg rounded-lg p-12 border border-white/20 text-center">
            <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
            <p className="text-slate-300">Be the first to report environmental issues in your area.</p>
          </div>
        ) : (
          reports.map((report) => {
            const StatusIcon = getStatusIcon(report.status);
            return (
              <div
                key={report.id}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-5 border border-white/20 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full">
                    {report.report_type}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${getStatusColor(report.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    {report.status}
                  </span>
                </div>

                <p className="text-white text-sm mb-3 line-clamp-3">{report.description}</p>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>Location reported</span>
                </div>

                {report.verified_by_ai && (
                  <div className="mb-3 p-2 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-200">
                    AI Verified
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleUpvote(report.id, report.upvotes)}
                    className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{report.upvotes}</span>
                  </button>
                  <span className="text-xs text-slate-400">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

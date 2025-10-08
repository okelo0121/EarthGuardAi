import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Calendar, MapPin, TrendingUp, Droplets, Wind, Flame, Cloud } from 'lucide-react';

export default function Predictions() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPredictions(data);
    }
    setLoading(false);
  };

  const getImpactColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
      high: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
      medium: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
      low: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    };
    return colors[level] || colors.low;
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('drought')) return Droplets;
    if (type.includes('flood')) return Cloud;
    if (type.includes('pollution')) return Wind;
    if (type.includes('wildfire')) return Flame;
    return AlertTriangle;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading predictions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">AI Predictions & Forecasts</h2>
        <p className="text-slate-300">Machine learning models predicting environmental events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.length === 0 ? (
          <div className="col-span-full bg-white/10 backdrop-blur-lg rounded-lg p-12 border border-white/20 text-center">
            <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Predictions Available</h3>
            <p className="text-slate-300">AI models are analyzing data. Check back soon for forecasts.</p>
          </div>
        ) : (
          predictions.map((prediction) => {
            const Icon = getTypeIcon(prediction.prediction_type);
            return (
              <div
                key={prediction.id}
                className={`bg-gradient-to-br backdrop-blur-lg rounded-lg p-6 border ${getImpactColor(
                  prediction.impact_level
                )}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-10 h-10" />
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    {prediction.probability}% Probability
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 capitalize">
                  {prediction.prediction_type.replace(/_/g, ' ')}
                </h3>

                <div className="space-y-2 text-sm text-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{prediction.region_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Expected: {new Date(prediction.predicted_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Impact: {prediction.impact_level}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs text-slate-300 mb-2">Model Confidence: {prediction.confidence_score}%</p>
                  <p className="text-xs text-slate-400">Model: {prediction.model_used}</p>
                </div>

                {prediction.recommendations && Object.keys(prediction.recommendations).length > 0 && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-xs font-semibold text-white mb-1">Recommendations:</p>
                    <p className="text-xs text-slate-200">
                      {JSON.stringify(prediction.recommendations)}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

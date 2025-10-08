import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { Layers, MapPin, Filter } from 'lucide-react';

interface MapViewProps {
  session: any;
}

export default function MapView({ session }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['all']);
  const [environmentalData, setEnvironmentalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    loadEnvironmentalData();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const loadEnvironmentalData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('environmental_data')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      setEnvironmentalData(data);
      renderMarkers(data);
    }
    setLoading(false);
  };

  const renderMarkers = (data: any[]) => {
    if (!mapInstance.current) return;

    data.forEach((item) => {
      try {
        const geoJson = JSON.parse(item.location);
        const coordinates = geoJson.coordinates;

        const color = getSeverityColor(item.severity_level);
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([coordinates[1], coordinates[0]], { icon })
          .addTo(mapInstance.current!)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-1">${item.region_name}</h3>
              <p class="text-xs text-gray-600 mb-1">${item.data_type}</p>
              <p class="text-xs"><span class="font-semibold">Severity:</span> ${item.severity_level}</p>
              <p class="text-xs"><span class="font-semibold">Source:</span> ${item.source}</p>
              <p class="text-xs"><span class="font-semibold">Confidence:</span> ${item.confidence_score}%</p>
              <p class="text-xs text-gray-500 mt-1">${new Date(item.recorded_at).toLocaleDateString()}</p>
            </div>
          `);
      } catch (e) {
        console.error('Error rendering marker:', e);
      }
    });
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#eab308',
      low: '#10b981',
    };
    return colors[severity] || '#6b7280';
  };

  const layerOptions = [
    { id: 'all', label: 'All Data', color: 'bg-slate-500' },
    { id: 'deforestation', label: 'Deforestation', color: 'bg-orange-500' },
    { id: 'air_quality', label: 'Air Quality', color: 'bg-blue-500' },
    { id: 'water_quality', label: 'Water Quality', color: 'bg-cyan-500' },
    { id: 'temperature', label: 'Temperature', color: 'bg-red-500' },
  ];

  const toggleLayer = (layerId: string) => {
    if (layerId === 'all') {
      setSelectedLayers(['all']);
    } else {
      setSelectedLayers((prev) => {
        const filtered = prev.filter((l) => l !== 'all');
        if (filtered.includes(layerId)) {
          return filtered.filter((l) => l !== layerId);
        } else {
          return [...filtered, layerId];
        }
      });
    }
  };

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl p-4 max-w-xs z-[1000]">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Map Layers</h3>
        </div>
        <div className="space-y-2">
          {layerOptions.map((layer) => (
            <label
              key={layer.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedLayers.includes(layer.id)}
                onChange={() => toggleLayer(layer.id)}
                className="w-4 h-4 text-emerald-600"
              />
              <div className={`w-3 h-3 rounded-full ${layer.color}`} />
              <span className="text-sm text-gray-700">{layer.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl p-4 z-[1000]">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Legend
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-700">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-700">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-700">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-700">Low</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1001]">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <p className="text-gray-800">Loading environmental data...</p>
          </div>
        </div>
      )}
    </div>
  );
}

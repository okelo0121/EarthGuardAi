export interface EnvironmentalData {
  id: string;
  data_type: string;
  location: {
    lat: number;
    lng: number;
  };
  region_name: string;
  metrics: Record<string, any>;
  severity_level: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  confidence_score: number;
  recorded_at: string;
  created_at: string;
}

export interface CommunityReport {
  id: string;
  user_id: string;
  report_type: 'pollution' | 'deforestation' | 'wildlife' | 'water' | 'other';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  photo_urls: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'verified' | 'investigating' | 'resolved';
  verified_by_ai: boolean;
  ai_analysis?: string | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  prediction_type: string;
  location: {
    lat: number;
    lng: number;
  };
  region_name: string;
  probability: number;
  predicted_date: string;
  impact_level: 'critical' | 'high' | 'medium' | 'low';
  model_used: string;
  confidence_score: number;
  recommendations: Record<string, any>;
  created_at: string;
}

export interface AIInsight {
  id: string;
  insight_type: string;
  region_name: string;
  time_period: string;
  summary: string;
  key_findings: Record<string, any>;
  data_sources: string[];
  generated_at: string;
}

export interface UserProfile {
  id: string;
  full_name?: string | null;
  organization?: string | null;
  role: 'researcher' | 'activist' | 'policy_maker' | 'citizen';
  regions_of_interest: string[];
  notification_preferences: Record<string, any>;
  total_impact_score: number;
  created_at: string;
  updated_at: string;
}

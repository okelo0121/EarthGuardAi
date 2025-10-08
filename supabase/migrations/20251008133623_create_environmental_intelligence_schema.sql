/*
  # Environmental Intelligence System - Database Schema

  ## Overview
  This migration creates the complete database infrastructure for an AI-powered 
  environmental monitoring system that tracks deforestation, pollution, climate data,
  and community reports.

  ## 1. New Tables

  ### `environmental_data`
  Stores time-series environmental metrics from satellite and sensor data:
  - `id` (uuid, primary key)
  - `data_type` (text) - Type: deforestation, air_quality, water_quality, temperature, etc.
  - `location` (geography point) - Geographic coordinates
  - `region_name` (text) - Human-readable location
  - `metrics` (jsonb) - Flexible storage for various measurements
  - `severity_level` (text) - critical, high, medium, low
  - `source` (text) - Data source: satellite, sensor, model, community
  - `confidence_score` (numeric) - AI confidence in data accuracy (0-100)
  - `recorded_at` (timestamptz) - When data was collected
  - `created_at` (timestamptz) - When record was created

  ### `community_reports`
  User-submitted environmental observations and concerns:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `report_type` (text) - pollution, deforestation, wildlife, water, other
  - `location` (geography point)
  - `description` (text)
  - `photo_urls` (text array) - URLs to uploaded photos
  - `severity` (text) - critical, high, medium, low
  - `status` (text) - pending, verified, investigating, resolved
  - `verified_by_ai` (boolean) - Whether AI validated the report
  - `ai_analysis` (text) - AI-generated analysis of the report
  - `upvotes` (integer) - Community validation
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `predictions`
  AI/ML-generated forecasts for environmental events:
  - `id` (uuid, primary key)
  - `prediction_type` (text) - drought, flood, pollution_surge, wildfire_risk, etc.
  - `location` (geography point)
  - `region_name` (text)
  - `probability` (numeric) - Likelihood percentage (0-100)
  - `predicted_date` (date) - When event is expected
  - `impact_level` (text) - critical, high, medium, low
  - `model_used` (text) - ML model identifier
  - `confidence_score` (numeric) - Model confidence (0-100)
  - `recommendations` (jsonb) - Suggested actions
  - `created_at` (timestamptz)

  ### `user_actions`
  Track user sustainability efforts and contributions:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `action_type` (text) - report_submitted, data_verified, tree_planted, cleanup_attended
  - `action_details` (jsonb) - Flexible action metadata
  - `impact_score` (integer) - Gamification points
  - `location` (geography point, optional)
  - `created_at` (timestamptz)

  ### `ai_insights`
  Store AI-generated environmental analysis and summaries:
  - `id` (uuid, primary key)
  - `insight_type` (text) - trend_analysis, risk_assessment, recommendation
  - `region_name` (text)
  - `time_period` (text) - daily, weekly, monthly
  - `summary` (text) - Natural language summary
  - `key_findings` (jsonb) - Structured insights
  - `data_sources` (text array) - Reference to source data
  - `generated_at` (timestamptz)

  ### `user_profiles`
  Extended user information for personalization:
  - `id` (uuid, primary key, foreign key to auth.users)
  - `full_name` (text)
  - `organization` (text, optional) - NGO, government, research institution
  - `role` (text) - researcher, activist, policy_maker, citizen
  - `regions_of_interest` (text array) - Regions they monitor
  - `notification_preferences` (jsonb)
  - `total_impact_score` (integer) - Aggregate contribution points
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security (Row Level Security)
  
  All tables have RLS enabled with appropriate policies:
  - Public read access for environmental_data and predictions (transparency)
  - Authenticated users can create community_reports
  - Users can only update/delete their own reports
  - User actions and profiles are private to the user
  - AI insights are publicly readable

  ## 3. Indexes
  
  Performance indexes for common queries:
  - Geographic indexes for location-based queries
  - Time-based indexes for temporal analysis
  - Type/category indexes for filtering

  ## 4. Important Notes
  
  - Uses PostGIS extension for geographic data types
  - JSONB columns allow flexible schema evolution
  - All timestamps include timezone information
  - Severity levels are standardized across tables
*/

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Environmental Data Table
CREATE TABLE IF NOT EXISTS environmental_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type text NOT NULL,
  location geography(POINT) NOT NULL,
  region_name text NOT NULL,
  metrics jsonb NOT NULL DEFAULT '{}',
  severity_level text NOT NULL DEFAULT 'low',
  source text NOT NULL DEFAULT 'satellite',
  confidence_score numeric(5,2) DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_environmental_data_type ON environmental_data(data_type);
CREATE INDEX IF NOT EXISTS idx_environmental_data_location ON environmental_data USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_environmental_data_recorded_at ON environmental_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_environmental_data_severity ON environmental_data(severity_level);

-- Community Reports Table
CREATE TABLE IF NOT EXISTS community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type text NOT NULL,
  location geography(POINT) NOT NULL,
  description text NOT NULL,
  photo_urls text[] DEFAULT '{}',
  severity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  verified_by_ai boolean DEFAULT false,
  ai_analysis text,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_reports_user ON community_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_location ON community_reports USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_community_reports_type ON community_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);

-- Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type text NOT NULL,
  location geography(POINT) NOT NULL,
  region_name text NOT NULL,
  probability numeric(5,2) NOT NULL CHECK (probability >= 0 AND probability <= 100),
  predicted_date date NOT NULL,
  impact_level text NOT NULL DEFAULT 'medium',
  model_used text NOT NULL,
  confidence_score numeric(5,2) DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  recommendations jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_predictions_type ON predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_predictions_location ON predictions USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_predictions_date ON predictions(predicted_date);
CREATE INDEX IF NOT EXISTS idx_predictions_impact ON predictions(impact_level);

-- User Actions Table
CREATE TABLE IF NOT EXISTS user_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL,
  action_details jsonb DEFAULT '{}',
  impact_score integer DEFAULT 0,
  location geography(POINT),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_actions_user ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_type ON user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_actions_created ON user_actions(created_at DESC);

-- AI Insights Table
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL,
  region_name text NOT NULL,
  time_period text NOT NULL,
  summary text NOT NULL,
  key_findings jsonb DEFAULT '{}',
  data_sources text[] DEFAULT '{}',
  generated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_region ON ai_insights(region_name);
CREATE INDEX IF NOT EXISTS idx_ai_insights_period ON ai_insights(time_period);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  organization text,
  role text NOT NULL DEFAULT 'citizen',
  regions_of_interest text[] DEFAULT '{}',
  notification_preferences jsonb DEFAULT '{"email": true, "push": false, "severity_threshold": "medium"}',
  total_impact_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for environmental_data (public read for transparency)
CREATE POLICY "Environmental data is publicly readable"
  ON environmental_data FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only system can insert environmental data"
  ON environmental_data FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- RLS Policies for community_reports
CREATE POLICY "Anyone can view community reports"
  ON community_reports FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON community_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON community_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON community_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for predictions (public read)
CREATE POLICY "Predictions are publicly readable"
  ON predictions FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for user_actions (private)
CREATE POLICY "Users can view own actions"
  ON user_actions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own actions"
  ON user_actions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_insights (public read)
CREATE POLICY "AI insights are publicly readable"
  ON ai_insights FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_community_reports_updated_at
  BEFORE UPDATE ON community_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
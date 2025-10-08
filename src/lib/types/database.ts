export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      environmental_data: {
        Row: {
          id: string
          data_type: string
          location: string
          region_name: string
          metrics: Json
          severity_level: string
          source: string
          confidence_score: number
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data_type: string
          location: string
          region_name: string
          metrics?: Json
          severity_level?: string
          source?: string
          confidence_score?: number
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data_type?: string
          location?: string
          region_name?: string
          metrics?: Json
          severity_level?: string
          source?: string
          confidence_score?: number
          recorded_at?: string
          created_at?: string
        }
      }
      community_reports: {
        Row: {
          id: string
          user_id: string
          report_type: string
          location: string
          description: string
          photo_urls: string[]
          severity: string
          status: string
          verified_by_ai: boolean
          ai_analysis: string | null
          upvotes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          report_type: string
          location: string
          description: string
          photo_urls?: string[]
          severity?: string
          status?: string
          verified_by_ai?: boolean
          ai_analysis?: string | null
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          report_type?: string
          location?: string
          description?: string
          photo_urls?: string[]
          severity?: string
          status?: string
          verified_by_ai?: boolean
          ai_analysis?: string | null
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          prediction_type: string
          location: string
          region_name: string
          probability: number
          predicted_date: string
          impact_level: string
          model_used: string
          confidence_score: number
          recommendations: Json
          created_at: string
        }
        Insert: {
          id?: string
          prediction_type: string
          location: string
          region_name: string
          probability: number
          predicted_date: string
          impact_level?: string
          model_used: string
          confidence_score?: number
          recommendations?: Json
          created_at?: string
        }
        Update: {
          id?: string
          prediction_type?: string
          location?: string
          region_name?: string
          probability?: number
          predicted_date?: string
          impact_level?: string
          model_used?: string
          confidence_score?: number
          recommendations?: Json
          created_at?: string
        }
      }
      user_actions: {
        Row: {
          id: string
          user_id: string
          action_type: string
          action_details: Json
          impact_score: number
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          action_details?: Json
          impact_score?: number
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          action_details?: Json
          impact_score?: number
          location?: string | null
          created_at?: string
        }
      }
      ai_insights: {
        Row: {
          id: string
          insight_type: string
          region_name: string
          time_period: string
          summary: string
          key_findings: Json
          data_sources: string[]
          generated_at: string
        }
        Insert: {
          id?: string
          insight_type: string
          region_name: string
          time_period: string
          summary: string
          key_findings?: Json
          data_sources?: string[]
          generated_at?: string
        }
        Update: {
          id?: string
          insight_type?: string
          region_name?: string
          time_period?: string
          summary?: string
          key_findings?: Json
          data_sources?: string[]
          generated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          organization: string | null
          role: string
          regions_of_interest: string[]
          notification_preferences: Json
          total_impact_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          organization?: string | null
          role?: string
          regions_of_interest?: string[]
          notification_preferences?: Json
          total_impact_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          organization?: string | null
          role?: string
          regions_of_interest?: string[]
          notification_preferences?: Json
          total_impact_score?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

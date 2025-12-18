/**
 * Database types for StoryScorer
 * These types correspond to the Supabase database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          company: string | null;
          job_title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          company?: string | null;
          job_title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          company?: string | null;
          job_title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          plan_type: "free" | "pro" | "enterprise";
          status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
          current_period_start: string;
          current_period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          plan_type: "free" | "pro" | "enterprise";
          status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
          current_period_start: string;
          current_period_end: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          plan_type?: "free" | "pro" | "enterprise";
          status?: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          feature_used: string;
          usage_count: number;
          period_start: string;
          period_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          feature_used: string;
          usage_count?: number;
          period_start: string;
          period_end: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          feature_used?: string;
          usage_count?: number;
          period_start?: string;
          period_end?: string;
          created_at?: string;
        };
      };
      user_stories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          story_text: string;
          acceptance_criteria: string | null;
          score: number | null;
          analysis_result: Json | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          story_text: string;
          acceptance_criteria?: string | null;
          score?: number | null;
          analysis_result?: Json | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          story_text?: string;
          acceptance_criteria?: string | null;
          score?: number | null;
          analysis_result?: Json | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      story_history: {
        Row: {
          id: string;
          story_id: string;
          version: number;
          story_text: string;
          score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          version: number;
          story_text: string;
          score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          version?: number;
          story_text?: string;
          score?: number | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      plan_type: "free" | "pro" | "enterprise";
      subscription_status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
    };
  };
}

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"];
export type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"];

export type UsageTracking = Database["public"]["Tables"]["usage_tracking"]["Row"];
export type UsageTrackingInsert = Database["public"]["Tables"]["usage_tracking"]["Insert"];
export type UsageTrackingUpdate = Database["public"]["Tables"]["usage_tracking"]["Update"];

export type UserStory = Database["public"]["Tables"]["user_stories"]["Row"];
export type UserStoryInsert = Database["public"]["Tables"]["user_stories"]["Insert"];
export type UserStoryUpdate = Database["public"]["Tables"]["user_stories"]["Update"];

export type StoryHistory = Database["public"]["Tables"]["story_history"]["Row"];
export type StoryHistoryInsert = Database["public"]["Tables"]["story_history"]["Insert"];
export type StoryHistoryUpdate = Database["public"]["Tables"]["story_history"]["Update"];

// Analysis result type for INVEST criteria
export interface INVESTAnalysisResult {
  independent: {
    score: number;
    feedback: string;
  };
  negotiable: {
    score: number;
    feedback: string;
  };
  valuable: {
    score: number;
    feedback: string;
  };
  estimable: {
    score: number;
    feedback: string;
  };
  small: {
    score: number;
    feedback: string;
  };
  testable: {
    score: number;
    feedback: string;
  };
  overall_score: number;
  recommendations: string[];
}


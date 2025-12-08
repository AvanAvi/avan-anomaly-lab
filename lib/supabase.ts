// lib/supabase.ts
// Supabase client configuration for Avan Anomaly Lab

import { createClient } from '@supabase/supabase-js';

// ============================================
// TYPES
// ============================================

export interface Submission {
  id: string;
  created_at: string;
  
  // Content
  message: string;
  audio_url: string | null;
  audio_duration_seconds: number | null;
  image_url: string | null;
  
  // Contact
  contact_email: string | null;
  contact_social: string | null;
  
  // Location
  location_precise: boolean;
  location_coords: {
    lat: number;
    lng: number;
    accuracy: number;
  } | null;
  location_city: string | null;
  location_region: string | null;
  location_country: string | null;
  location_country_code: string | null;
  location_source: 'gps' | 'ip' | null;
  
  // IP Data
  ip_address: string | null;
  ip_is_vpn: boolean;
  ip_is_datacenter: boolean;
  ip_isp: string | null;
  
  // Device & Browser
  device_info: {
    user_agent: string;
    platform: string;
    screen_resolution: string;
    language: string;
  } | null;
  timezone: string | null;
  timezone_offset: number | null;
  languages: string[] | null;
  
  // Trust Signals
  location_consistency_score: number | null;
  trust_flags: string[] | null;
  
  // Admin
  status: 'unread' | 'read' | 'replied' | 'archived';
  admin_notes: string | null;
  is_spam: boolean;
}

export type SubmissionInsert = Omit<Submission, 'id' | 'created_at' | 'status' | 'admin_notes' | 'is_spam'>;

// ============================================
// CLIENT-SIDE SUPABASE (limited permissions)
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// SERVER-SIDE SUPABASE (full permissions)
// Use this only in API routes, never in client components
// ============================================

export const createServerSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
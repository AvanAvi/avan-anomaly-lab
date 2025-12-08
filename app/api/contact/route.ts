// app/api/contact/route.ts
// API route for handling contact form submissions

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

interface ContactPayload {
  // Content
  message: string;
  audioBase64: string | null;
  audioDuration: number | null;
  imageBase64: string | null;
  
  // Contact (optional)
  contactEmail: string | null;
  contactSocial: string | null;
  
  // Location
  locationPrecise: boolean;
  locationCoords: {
    lat: number;
    lng: number;
    accuracy: number;
  } | null;
  
  // Device info (collected client-side)
  deviceInfo: {
    userAgent: string;
    platform: string;
    screenResolution: string;
    language: string;
  };
  timezone: string;
  timezoneOffset: number;
  languages: string[];
}

// ============================================
// HELPER: Upload file to Supabase Storage
// ============================================

async function uploadToStorage(
  supabase: ReturnType<typeof createServerSupabase>,
  bucket: 'audio' | 'images',
  base64Data: string,
  fileExtension: string
): Promise<string | null> {
  try {
    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Clean, 'base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${randomId}.${fileExtension}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: bucket === 'audio' ? 'audio/webm' : 'image/jpeg',
        upsert: false,
      });
    
    if (error) {
      console.error(`Storage upload error (${bucket}):`, error);
      return null;
    }
    
    // Get public URL (signed URL since bucket is private)
    const { data: urlData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filename, 60 * 60 * 24 * 365); // 1 year expiry
    
    return urlData?.signedUrl || null;
  } catch (err) {
    console.error(`Upload error (${bucket}):`, err);
    return null;
  }
}

// ============================================
// HELPER: Get IP geolocation data
// ============================================

async function getIpGeoData(ip: string): Promise<{
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  isVpn: boolean;
  isDatacenter: boolean;
  isp: string | null;
}> {
  try {
    // Using ip-api.com (free, no key required, 45 requests/minute)
    // For production, consider ipinfo.io or maxmind for better accuracy
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,isp,mobile,proxy,hosting`
    );
    
    if (!response.ok) {
      throw new Error('IP API request failed');
    }
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      return {
        city: null,
        region: null,
        country: null,
        countryCode: null,
        isVpn: false,
        isDatacenter: false,
        isp: null,
      };
    }
    
    return {
      city: data.city || null,
      region: data.regionName || null,
      country: data.country || null,
      countryCode: data.countryCode || null,
      isVpn: data.proxy || false,
      isDatacenter: data.hosting || false,
      isp: data.isp || null,
    };
  } catch (err) {
    console.error('IP geolocation error:', err);
    return {
      city: null,
      region: null,
      country: null,
      countryCode: null,
      isVpn: false,
      isDatacenter: false,
      isp: null,
    };
  }
}

// ============================================
// HELPER: Calculate location consistency score
// ============================================

function calculateConsistencyScore(
  ipCountryCode: string | null,
  gpsCountryCode: string | null,
  timezone: string,
  languages: string[]
): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;
  const maxScore = 4;
  
  // Check 1: GPS vs IP country match (if GPS available)
  if (gpsCountryCode && ipCountryCode) {
    if (gpsCountryCode === ipCountryCode) {
      score += 1;
    } else {
      flags.push('gps_ip_country_mismatch');
    }
  } else {
    score += 1; // No GPS, skip this check
  }
  
  // Check 2: Timezone consistency
  // Extract region from timezone (e.g., "Asia/Kolkata" -> rough country)
  const timezoneRegion = timezone.split('/')[0];
  const timezoneCountryHints: Record<string, string[]> = {
    'America': ['US', 'CA', 'MX', 'BR', 'AR'],
    'Europe': ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'PL'],
    'Asia': ['IN', 'CN', 'JP', 'KR', 'SG', 'ID', 'TH'],
    'Australia': ['AU', 'NZ'],
    'Africa': ['ZA', 'NG', 'EG', 'KE'],
  };
  
  const expectedCountries = timezoneCountryHints[timezoneRegion] || [];
  if (ipCountryCode && expectedCountries.length > 0) {
    if (expectedCountries.includes(ipCountryCode)) {
      score += 1;
    } else {
      flags.push('timezone_mismatch');
    }
  } else {
    score += 1;
  }
  
  // Check 3: Language consistency
  const languageCountryHints: Record<string, string[]> = {
    'en-US': ['US'],
    'en-GB': ['GB'],
    'en-IN': ['IN'],
    'de': ['DE', 'AT', 'CH'],
    'fr': ['FR', 'CA', 'BE'],
    'es': ['ES', 'MX', 'AR'],
    'pt': ['PT', 'BR'],
    'ja': ['JP'],
    'zh': ['CN', 'TW', 'HK'],
    'ko': ['KR'],
  };
  
  const primaryLanguage = languages[0]?.split('-')[0] || '';
  const fullLanguage = languages[0] || '';
  const expectedFromLang = languageCountryHints[fullLanguage] || languageCountryHints[primaryLanguage] || [];
  
  if (ipCountryCode && expectedFromLang.length > 0) {
    if (expectedFromLang.includes(ipCountryCode)) {
      score += 1;
    } else {
      flags.push('language_mismatch');
    }
  } else {
    score += 1;
  }
  
  // Check 4: VPN/Datacenter detection (added elsewhere, but contribute to flags)
  score += 1; // Base point, VPN flag added separately
  
  return { score, flags };
}

// ============================================
// HELPER: Reverse geocode GPS coordinates
// ============================================

async function reverseGeocode(lat: number, lng: number): Promise<{
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
}> {
  try {
    // Using BigDataCloud (free, no key required for basic reverse geocoding)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocode request failed');
    }
    
    const data = await response.json();
    
    return {
      city: data.city || data.locality || null,
      region: data.principalSubdivision || null,
      country: data.countryName || null,
      countryCode: data.countryCode || null,
    };
  } catch (err) {
    console.error('Reverse geocode error:', err);
    return {
      city: null,
      region: null,
      country: null,
      countryCode: null,
    };
  }
}

// ============================================
// MAIN API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const payload: ContactPayload = await request.json();
    
    // Validate required fields
    if (!payload.message || payload.message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // ============================================
    // UPLOAD FILES
    // ============================================
    
    let audioUrl: string | null = null;
    let imageUrl: string | null = null;
    
    if (payload.audioBase64) {
      audioUrl = await uploadToStorage(supabase, 'audio', payload.audioBase64, 'webm');
    }
    
    if (payload.imageBase64) {
      imageUrl = await uploadToStorage(supabase, 'images', payload.imageBase64, 'jpg');
    }
    
    // ============================================
    // GET LOCATION DATA
    // ============================================
    
    // Get IP-based geolocation
    const ipGeo = await getIpGeoData(ip);
    
    // If GPS provided, reverse geocode to get location names
    let gpsLocation = {
      city: null as string | null,
      region: null as string | null,
      country: null as string | null,
      countryCode: null as string | null,
    };
    
    if (payload.locationPrecise && payload.locationCoords) {
      gpsLocation = await reverseGeocode(
        payload.locationCoords.lat,
        payload.locationCoords.lng
      );
    }
    
    // Determine final location (prefer GPS if available)
    const finalLocation = payload.locationPrecise && gpsLocation.city
      ? {
          city: gpsLocation.city,
          region: gpsLocation.region,
          country: gpsLocation.country,
          countryCode: gpsLocation.countryCode,
          source: 'gps' as const,
        }
      : {
          city: ipGeo.city,
          region: ipGeo.region,
          country: ipGeo.country,
          countryCode: ipGeo.countryCode,
          source: 'ip' as const,
        };
    
    // ============================================
    // CALCULATE TRUST SIGNALS
    // ============================================
    
    const { score, flags } = calculateConsistencyScore(
      ipGeo.countryCode,
      gpsLocation.countryCode,
      payload.timezone,
      payload.languages
    );
    
    // Add VPN/datacenter flags
    const allFlags = [...flags];
    if (ipGeo.isVpn) allFlags.push('vpn_detected');
    if (ipGeo.isDatacenter) allFlags.push('datacenter_ip');
    
    // ============================================
    // INSERT INTO DATABASE
    // ============================================
    
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        // Content
        message: payload.message.trim(),
        audio_url: audioUrl,
        audio_duration_seconds: payload.audioDuration,
        image_url: imageUrl,
        
        // Contact
        contact_email: payload.contactEmail,
        contact_social: payload.contactSocial,
        
        // Location
        location_precise: payload.locationPrecise,
        location_coords: payload.locationCoords,
        location_city: finalLocation.city,
        location_region: finalLocation.region,
        location_country: finalLocation.country,
        location_country_code: finalLocation.countryCode,
        location_source: finalLocation.source,
        
        // IP Data
        ip_address: ip,
        ip_is_vpn: ipGeo.isVpn,
        ip_is_datacenter: ipGeo.isDatacenter,
        ip_isp: ipGeo.isp,
        
        // Device & Browser
        device_info: {
          user_agent: payload.deviceInfo.userAgent,
          platform: payload.deviceInfo.platform,
          screen_resolution: payload.deviceInfo.screenResolution,
          language: payload.deviceInfo.language,
        },
        timezone: payload.timezone,
        timezone_offset: payload.timezoneOffset,
        languages: payload.languages,
        
        // Trust Signals
        location_consistency_score: score,
        trust_flags: allFlags.length > 0 ? allFlags : null,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }
    
    // ============================================
    // SUCCESS RESPONSE
    // ============================================
    
    return NextResponse.json({
      success: true,
      id: data.id,
      location: {
        city: finalLocation.city,
        country: finalLocation.country,
        source: finalLocation.source,
      },
    });
    
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
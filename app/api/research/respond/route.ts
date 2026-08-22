// app/api/research/respond/route.ts
// API route for the "Add a Perspective" research response system.
// Same hardening posture as /api/contact: untrusted input, validated
// and clamped server-side, rate-limited by IP, honeypot for bots.

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { clampString, getClientIp, isRateLimited, isValidEmail } from '@/lib/security';
import { PROJECTS } from '@/lib/research';

interface ResponsePayload {
  projectSlug: string;
  perspective: string;
  respondentName: string | null;
  respondentEmail: string | null;
  /** Hidden field left empty by real visitors; filled by bots. */
  honeypot?: string;
}

const MAX_REQUEST_BYTES = 32 * 1024; // plain text only, no attachments; generous for a long perspective
const MIN_PERSPECTIVE_LENGTH = 20;
const MAX_PERSPECTIVE_LENGTH = 3000;
const VALID_SLUGS = new Set(PROJECTS.map((p) => p.slug));

function validatePayload(payload: Partial<ResponsePayload>): string | null {
  if (typeof payload.projectSlug !== 'string' || !VALID_SLUGS.has(payload.projectSlug)) {
    return 'Unknown research project';
  }
  if (typeof payload.perspective !== 'string' || payload.perspective.trim().length < MIN_PERSPECTIVE_LENGTH) {
    return 'Say a little more, a sentence or two is enough';
  }
  if (payload.perspective.length > MAX_PERSPECTIVE_LENGTH) {
    return 'That is too long, try trimming it down';
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const supabase = createServerSupabase();
    const payload: Partial<ResponsePayload> = await request.json();

    // Honeypot: pretend success rather than telling a bot it was rejected.
    if (payload.honeypot) {
      return NextResponse.json({ success: true, id: 'ok' });
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const projectSlug = payload.projectSlug as string;
    const perspective = (payload.perspective as string).trim().slice(0, MAX_PERSPECTIVE_LENGTH);
    const respondentName = clampString(payload.respondentName, 100) || null;
    const respondentEmailRaw = clampString(payload.respondentEmail, 254);
    const respondentEmail = respondentEmailRaw && isValidEmail(respondentEmailRaw) ? respondentEmailRaw : null;

    const ip = getClientIp(request) || 'unknown';

    if (ip !== 'unknown') {
      const limited = await isRateLimited(supabase, 'research_responses', ip, {
        windowMinutes: 15,
        maxRequests: 3,
      });
      if (limited) {
        return NextResponse.json(
          { error: 'Too many perspectives from this connection. Try again later.' },
          { status: 429 }
        );
      }
    }

    const { data, error } = await supabase
      .from('research_responses')
      .insert({
        project_slug: projectSlug,
        perspective,
        respondent_name: respondentName,
        respondent_email: respondentEmail,
        ip_address: ip,
      })
      .select('id')
      .single();

    if (error) {
      console.error('research_responses insert error:', error);
      return NextResponse.json({ error: 'Failed to save your perspective' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Research respond API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

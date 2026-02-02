import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/users/contact
 * Fetches contact email for a user - POST only to prevent crawler access
 *
 * Body: { userId: string }
 * Returns: { email: string } or { error: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch only the contact_email field
    const { data, error } = await supabase
      .from('users')
      .select('contact_email')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!data.contact_email) {
      return NextResponse.json({ error: 'No contact email set' }, { status: 404 });
    }

    return NextResponse.json({ email: data.contact_email });

  } catch (error) {
    console.error('Contact fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

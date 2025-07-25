import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function PUT(request: Request) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, title, bio } = body;

    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update user in database
    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        title,
        bio,
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'User updated successfully', 
      user: data[0] 
    });

  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
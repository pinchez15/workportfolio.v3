import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { generateUsername } from '@/lib/username';

export async function POST() {
  try {
    console.log('🔄 Fallback user creation API called');
    
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      console.log('❌ Unauthorized request to create user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      console.log('❌ Could not get user data from Clerk');
      return NextResponse.json({ error: 'User data not found' }, { status: 400 });
    }

    console.log('👤 Creating user via fallback API:', userId);

    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser) {
      console.log('✅ User already exists in database');
      return NextResponse.json({ message: 'User already exists', created: false });
    }

    // Generate username using consistent logic
    const username = generateUsername({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      emailAddresses: user.emailAddresses,
      id: userId
    });

    // Construct full name
    const name = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(' ') || undefined;

    const userRecord = {
      id: userId,
      username,
      name,
      avatar_url: user.imageUrl,
      portfolio_url: `https://workportfolio.io/${username}`,
    };
    
    console.log('📝 Inserting user record via fallback API:', userRecord);

    // Insert user into database
    const { data, error } = await supabase
      .from('users')
      .insert(userRecord)
      .select();

    if (error) {
      console.error('❌ Database insert error:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    console.log('✅ User created successfully via fallback API:', data);
    return NextResponse.json({ 
      message: 'User created successfully', 
      created: true, 
      username,
      user: data[0] 
    });

  } catch (error) {
    console.error('❌ Fallback user creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
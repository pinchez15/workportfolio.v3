import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';
import { generateUsername } from '@/lib/username';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log('🔥 Webhook received at:', new Date().toISOString());
  
  if (!webhookSecret) {
    console.error('❌ CLERK_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const payload = await request.text();
  console.log('📝 Webhook payload length:', payload.length);
  
  const headers = {
    'svix-id': request.headers.get('svix-id') || '',
    'svix-timestamp': request.headers.get('svix-timestamp') || '',
    'svix-signature': request.headers.get('svix-signature') || '',
  };
  console.log('📋 Webhook headers:', headers);

  try {
    const wh = new Webhook(webhookSecret);
    const event = wh.verify(payload, headers) as { 
      type: string; 
      data: { 
        id: string;
        username?: string;
        first_name?: string;
        last_name?: string;
        image_url?: string;
        email_addresses?: Array<{ email_address: string }>;
      } 
    };

    console.log('✅ Webhook verified successfully');
    console.log('📦 Event type:', event.type);
    console.log('👤 Event data:', JSON.stringify(event.data, null, 2));

    // Handle user.created event
    if (event.type === 'user.created') {
      console.log('🆕 Processing user.created event for:', event.data.id);

      try {
        await createUserInDatabase(event.data);
      } catch (error) {
        console.error('❌ User creation failed:', error);
        // Still return 200 - the fallback API in welcome-demo will handle creation
      }
    } else {
      console.log('⏭️ Ignoring event type:', event.type);
    }

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook verification failed:', error);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}

async function createUserInDatabase(userData: {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  email_addresses?: Array<{ email_address: string }>;
}) {
  try {
    console.log('🔄 Starting database user creation for:', userData.id);
    
    // Create Supabase client inside the function
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔧 Environment check:', {
      supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
      supabaseKey: supabaseKey ? '✅ Set' : '❌ Missing'
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate username using the utility function
    const username = generateUsername(userData);
    console.log('👤 Generated username:', username);

    // Construct full name
    const name = [userData.first_name, userData.last_name]
      .filter(Boolean)
      .join(' ') || undefined;

    const userRecord = {
      id: userData.id,
      username,
      name,
      avatar_url: userData.image_url,
      portfolio_url: `https://workportfolio.io/${username}`,
    };
    
    console.log('📝 Inserting user record:', userRecord);

    // Upsert user into database (handles race conditions with fallback API gracefully)
    const { data, error } = await supabase
      .from('users')
      .upsert(userRecord, { onConflict: 'id', ignoreDuplicates: true })
      .select();

    if (error) {
      console.error('❌ Database upsert error:', error);
      throw new Error(`Database upsert failed: ${error.message}`);
    }

    console.log('✅ User created successfully in database:', data);
    console.log(`🎉 User ${userData.id} created with username: ${username}`);
  } catch (error) {
    console.error('❌ User creation error:', error);
    throw error;
  }
}
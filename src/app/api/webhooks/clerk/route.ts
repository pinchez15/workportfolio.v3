import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const payload = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id') || '',
    'svix-timestamp': request.headers.get('svix-timestamp') || '',
    'svix-signature': request.headers.get('svix-signature') || '',
  };

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

    // Handle user.created event
    if (event.type === 'user.created') {
      console.log('User created webhook received for user:', event.data.id);
      
      // Create user in database (don't await to avoid blocking webhook response)
      createUserInDatabase(event.data).catch(error => {
        console.error('User creation failed:', error);
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook verification failed:', error);
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
    // Create Supabase client inside the function
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Generate username from Clerk data
    let username = userData.username;
    if (!username) {
      // Fallback to email prefix if no username
      const email = userData.email_addresses?.[0]?.email_address;
      username = email ? email.split('@')[0] : `user_${userData.id.slice(0, 8)}`;
    }

    // Construct full name
    const name = [userData.first_name, userData.last_name]
      .filter(Boolean)
      .join(' ') || undefined;

    // Insert user into database
    const { error } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        username,
        name,
        avatar_url: userData.image_url,
      });

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    console.log(`User created successfully in database: ${userData.id} (${username})`);
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
}
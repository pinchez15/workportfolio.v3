import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

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
    const event = wh.verify(payload, headers) as { type: string; data: { id: string } };

    // Handle user.created event
    if (event.type === 'user.created') {
      console.log('User created webhook received for user:', event.data.id);
      
      // Asynchronously provision portfolio (don't await to avoid blocking webhook response)
      provisionPortfolio(event.data.id).catch(error => {
        console.error('Portfolio provisioning failed:', error);
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}

async function provisionPortfolio(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/provision-portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'X-User-ID': userId, // Pass user ID in header since webhook context doesn't have auth
      },
    });

    if (!response.ok) {
      throw new Error(`Portfolio provisioning failed: ${response.statusText}`);
    }

    console.log(`Portfolio provisioned successfully for user: ${userId}`);
  } catch (error) {
    console.error('Portfolio provisioning error:', error);
    throw error;
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      company, 
      short_description, 
      long_description, 
      start_date,
      end_date,
      url, 
      skills, 
      visible,
      featured 
    } = body;

    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert month format (YYYY-MM) to first day of month for database
    const formatDateForDb = (monthStr: string) => {
      if (!monthStr) return null
      return `${monthStr}-01` // Convert "2025-02" to "2025-02-01"
    }

    // Insert project into database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title,
        company,
        short_description,
        long_description,
        start_date: formatDateForDb(start_date),
        end_date: formatDateForDb(end_date),
        url,
        skills,
        visible: visible !== false, // default to true
        // featured: featured || false, // TODO: Uncomment after migration
        image_path: null // TODO: Add image upload support
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Project created successfully', 
      project: data 
    });

  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id,
      title, 
      company, 
      short_description, 
      long_description, 
      start_date,
      end_date,
      url, 
      skills, 
      visible,
      featured 
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert month format (YYYY-MM) to first day of month for database
    const formatDateForDb = (monthStr: string) => {
      if (!monthStr) return null
      return `${monthStr}-01` // Convert "2025-02" to "2025-02-01"
    }

    // Update project in database
    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        company,
        short_description,
        long_description,
        start_date: formatDateForDb(start_date),
        end_date: formatDateForDb(end_date),
        url,
        skills,
        visible: visible !== false
        // featured: featured || false // TODO: Uncomment after migration
      })
      .eq('id', id)
      .eq('user_id', userId) // Ensure user owns this project
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Project updated successfully', 
      project: data 
    });

  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Delete project from database
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure user owns this project

    if (error) {
      console.error('Database delete error:', error);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Project deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
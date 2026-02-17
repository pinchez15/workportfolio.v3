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
      featured,
      image_path,
      image_paths,
      order_index
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

    // Auto-assign order_index based on start_date chronological position
    let assignedOrderIndex = order_index;
    if (assignedOrderIndex === undefined || assignedOrderIndex === null) {
      // Fetch existing projects ordered by order_index
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('id, start_date, order_index')
        .eq('user_id', userId)
        .order('order_index', { ascending: true });

      if (!existingProjects || existingProjects.length === 0) {
        assignedOrderIndex = 0;
      } else if (!start_date) {
        // No start_date — insert at top (position 0), shift others down
        assignedOrderIndex = 0;
        const updates = existingProjects.map((p, i) =>
          supabase.from('projects').update({ order_index: i + 1 }).eq('id', p.id)
        );
        await Promise.all(updates);
      } else {
        // Find correct chronological position (most recent first)
        const newDate = `${start_date}-01`;
        let insertAt = existingProjects.length; // default: end
        for (let i = 0; i < existingProjects.length; i++) {
          const projDate = existingProjects[i].start_date;
          if (!projDate || projDate < newDate) {
            insertAt = i;
            break;
          }
        }
        assignedOrderIndex = insertAt;
        // Shift projects at and after insertAt down by 1
        const toShift = existingProjects.slice(insertAt);
        if (toShift.length > 0) {
          const updates = toShift.map((p, i) =>
            supabase.from('projects').update({ order_index: insertAt + i + 1 }).eq('id', p.id)
          );
          await Promise.all(updates);
        }
      }
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
        featured: featured || false,
        image_path: image_path || null,
        image_paths: image_paths || null,
        order_index: assignedOrderIndex
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
      featured,
      image_path,
      image_paths,
      order_index
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
        visible: visible !== false,
        featured: featured || false,
        image_path: image_path || null,
        image_paths: image_paths || null,
        order_index: order_index || 0 // Default to 0 if not provided
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

    // Fetch project to get image paths before deleting
    const { data: project } = await supabase
      .from('projects')
      .select('image_paths')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

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

    // Clean up storage files
    if (project?.image_paths && project.image_paths.length > 0) {
      const storagePaths = project.image_paths
        .map((url: string) => {
          const marker = '/user_uploads/';
          const idx = url.indexOf(marker);
          return idx !== -1 ? url.substring(idx + marker.length) : null;
        })
        .filter((p: string | null): p is string => p !== null);

      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('user_uploads')
          .remove(storagePaths);

        if (storageError) {
          console.warn('Failed to clean up storage files:', storageError);
          // Don't fail the request — DB record is already deleted
        }
      }
    }

    return NextResponse.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Project deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if portfolio already exists
    const { data: existingPortfolio } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingPortfolio) {
      return NextResponse.json({ message: "Portfolio already exists" });
    }

    // Get user details from Clerk
    const userResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const userData = await userResponse.json();
    const email = userData.email_addresses?.[0]?.email_address;
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';

    // Create profile in Supabase
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      bio: "This is your starting bio. Click edit to make it yours!",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }

    // Create a starter project
    const { error: projectError } = await supabase.from("projects").insert({
      user_id: userId,
      title: "My First Project",
      description: "Describe your first project here. Click edit to customize it!",
      link: "#",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (projectError) {
      console.error("Project creation error:", projectError);
      // Don't fail the entire request if project creation fails
      console.warn("Project creation failed, but profile was created successfully");
    }

    console.log(`Portfolio provisioned successfully for user: ${userId}`);
    return NextResponse.json({ message: "Portfolio provisioned successfully" });

  } catch (error) {
    console.error("Portfolio provisioning error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
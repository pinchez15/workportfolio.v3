WorkPortfolio.io – Technical Product Requirements Document (PRD)
1. Product Overview
Goal: Provide freelancers, consultants, and fractional executives with a fast, simple, and professional portfolio builder that can be created and updated in minutes — no domains, no complex web builders, no technical learning curve.
Value Proposition: In a "proof-of-work" economy, showing your work is more persuasive than telling. WorkPortfolio.io enables instant, professional public portfolios with minimal friction.

2. Target Users
Primary: Freelancers, consultants, fractional executives.

Secondary: Designers, developers, content creators, small agency owners.

3. Core Features
Instant Account Creation via Clerk (LinkedIn, Google, Email).

Three-Step Onboarding (name, billing, first project).

Automated Subdomain Assignment: www.workportfolio.io/{username} where {username} = Clerk firstName_lastName (lowercase, snake_case).

Dedicated Dashboard for portfolio creation and editing.

Portfolio Editing UI:

Add/Edit/Delete Projects.

Add External Links.

Embed Calendly link.

Public Portfolio Rendering:

Clean, read-only SSR/ISR rendering.

Project modal viewer with 4-image scrolling carousel.

Billing Integration:

Clerk’s native Billing Beta for B2C SaaS.

Publishing to public page gated behind paid plan.

Preview Mode for drafts (time-limited, owner-only).

Responsive UI (desktop-first, mobile-optimized).

4. Tech Stack
Layer	Technology / Service	Purpose
Frontend	Next.js (App Router)	SPA + SSR hybrid
TypeScript	Type safety
Tailwind CSS	Styling
ShadCN/UI	UI components
Backend	Supabase (Postgres)	Data storage & retrieval
Supabase Auth (via Clerk sync)	User profile persistence
Auth & Billing	Clerk	Authentication + Billing
Hosting	Vercel	Frontend & serverless API routes
Email	Resend (future phase)	Transactional emails
Analytics	PostHog	User behavior tracking

5. System Architecture
High-Level Diagram
scss
Copy
Edit
[Client Browser]
   ↕ HTTPS
[Next.js Frontend on Vercel]
   ↕ API Routes (Serverless Functions)
[Supabase Postgres + Storage]
[Clerk Auth + Billing Service]
6. Routing Structure
rust
Copy
Edit
app/
  (public)/
    page.tsx                     -> marketing homepage
    [username]/
      page.tsx                   -> public portfolio (SSR/ISR, paid & published only)
  (protected)/
    dashboard/
      page.tsx                   -> dashboard shell
      profile/page.tsx           -> profile & settings
      projects/page.tsx          -> CRUD projects
      billing/page.tsx           -> start/manage subscription
      preview/page.tsx           -> draft preview (noindex)
  api/
    clerk-webhook/route.ts       -> user.created, subscription.updated
    projects/route.ts            -> POST create
    projects/[id]/route.ts       -> PATCH/DELETE
    portfolio/publish/route.ts   -> POST publish (requires paid)
Middleware Config

ts
Copy
Edit
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/(protected)(.*)",
    "/api/(projects|portfolio|internal)(.*)",
    "/api/clerk-webhook"
  ],
};
7. Sequence Diagram
mermaid
Copy
Edit
sequenceDiagram
    autonumber
    actor U as User (Browser)
    participant C as Clerk
    participant N as Next.js (Vercel)
    participant S as Supabase (PG + Storage)
    participant B as Clerk Billing

    U->>N: GET /
    N-->>U: Landing page

    U->>C: Sign in (LinkedIn, Email)
    C-->>U: Session + ID Token
    C-->>N: POST /api/clerk-webhook (user.created)
    N->>S: INSERT profile (plan=free, visibility=draft)
    
    U->>N: Redirect to /dashboard
    U->>N: Create project
    N->>S: INSERT project

    U->>N: Click "Activate publishing"
    N->>B: Clerk Billing portal
    B-->>C: plan=paid
    C-->>N: POST /api/clerk-webhook (subscription.updated)
    N->>S: UPDATE profile plan=paid

    U->>N: POST /api/portfolio/publish
    N->>S: UPDATE profile visibility=public

    Visitor->>N: GET /{username}
    N->>S: SELECT profile (visibility=public)
    N-->>Visitor: Public portfolio
8. Portfolio Lifecycle (State Machine)
mermaid
Copy
Edit
stateDiagram-v2
    [*] --> draft
    draft --> unlisted: create preview token
    unlisted --> draft: revoke preview
    draft --> public: publish (requires paid)
    public --> draft: unpublish
draft: visible only in dashboard.

unlisted: preview via time-limited token.

public: accessible via /{username}, indexed.

9. Database Schema
profiles

Column	Type	Notes
id	UUID (PK)	Clerk user_id
username	text (unique)	Generated from Clerk
full_name	text	Clerk data
email	text	Clerk data
avatar_url	text	Clerk or upload
calendly_url	text	Optional
plan	text	free or paid
visibility	text	draft, unlisted, public
published_at	timestamp	null if not published
preview_token	text	nullable
preview_expires_at	timestamp	nullable
created_at	timestamp	default now()

projects

Column	Type	Notes
id	UUID (PK)	Generated
user_id	UUID (FK)	profiles.id
title	text	Required
description	text	Markdown or plain text
links	jsonb	Array of {label, url}
images	jsonb	Array of Supabase public URLs
created_at	timestamp	Default now()
updated_at	timestamp	Auto-updated

10. Security & Authorization
Guards
ts
Copy
Edit
// lib/guards.ts
export async function requireAuth() { ... }
export async function requirePaid() { ... }
export async function requireOwnerByUsername(username) { ... }
RLS Policies
sql
Copy
Edit
create policy "public read published profiles"
on profiles for select
using (visibility = 'public');

create policy "public read projects of published profiles"
on projects for select
using (
  exists (
    select 1 from profiles p
    where p.id = projects.user_id
      and p.visibility = 'public'
  )
);

create policy "owner profiles"
on profiles for all
using (auth.uid() = id);

create policy "owner projects"
on projects for all
using (auth.uid() = user_id);
11. Publishing Gate
Free users: full dashboard editing; can preview but not publish.

Paid users: can toggle portfolio visibility to public.

Public page: queries return 404 unless visibility='public'.

Preview links: /dashboard/preview with token; add <meta name="robots" content="noindex">.

12. Performance
Public portfolios: ISR with tag-based revalidation on publish/update.

Dashboard: always SSR.

Page load target: <1.5s on 4G.

13. Milestones
MVP v1.0:

Clerk Auth + Billing

Dashboard CRUD for projects/profile

Publish gate

Public page SSR/ISR

v1.1:

PostHog integration

Resend transactional emails

v1.2:

LLM-assisted project description generator


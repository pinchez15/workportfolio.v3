# WorkPortfolio.io

A professional portfolio builder built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React
- **Styling**: Tailwind CSS, ShadCN UI
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Analytics**: PostHog
- **Email**: Resend + React Email
- **Payments**: Clerk Billing (handled internally)
- **Hosting**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [slug]/            # Dynamic portfolio pages
│   ├── privacy/           # Privacy Policy
│   ├── terms/             # Terms of Service
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── posthog.tsx        # PostHog analytics
│   └── providers.tsx      # App providers
├── components/            # React components
│   └── ui/               # ShadCN UI components
├── lib/                  # Utility libraries
│   ├── analytics.ts      # PostHog configuration
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
│   └── database.ts       # Database schema types
└── middleware.ts         # Clerk middleware
```

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd workportfolio.v3
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Resend Email
RESEND_API_KEY=re_...


```

### 3. Database Setup

1. Create a Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Create a storage bucket named `user_uploads`

### 4. Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📄 Pages

- **Homepage** (`/`): Landing page with "Coming Soon" message
- **Privacy Policy** (`/privacy`): Privacy policy page
- **Terms of Service** (`/terms`): Terms of service page
- **Portfolio Pages** (`/[slug]`): Dynamic portfolio pages for users

## 🔧 Features

### Current Features
- ✅ Modern, responsive design
- ✅ TypeScript throughout
- ✅ Clerk authentication setup
- ✅ Supabase database schema
- ✅ PostHog analytics integration
- ✅ Security headers
- ✅ Dynamic portfolio routing

### Planned Features
- 🔄 User authentication and registration
- 🔄 Portfolio creation and management
- 🔄 Project showcase functionality
- 🔄 Image upload and storage
- 🔄 Payment processing
- 🔄 Email notifications
- 🔄 Analytics dashboard

## 🚀 Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Please contact the maintainers for contribution guidelines.

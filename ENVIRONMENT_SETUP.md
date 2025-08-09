# Environment Setup Guide

## Required Environment Variables

To fix the "Failed to fetch" errors, you need to create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to get these values:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Storage Bucket Setup

Make sure you have a storage bucket named `media` in your Supabase project:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `media`
3. Set appropriate permissions for file uploads

## After Setup

1. Restart your development server: `npm run dev`
2. The "Failed to fetch" errors should be resolved
3. Image uploads for products and brands will now work correctly

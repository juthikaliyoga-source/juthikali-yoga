# Yoga MCQ Practice (Vercel)

Static site + two tiny API routes. Free.

## Deploy
1. Import this folder/repo in Vercel (framework: Other, no build command).
2. Supabase (free): new project → SQL Editor → run `supabase.sql`.
3. Vercel → Project → Settings → Environment Variables: add
   `SUPABASE_URL` (Project Settings → API → Project URL) and
   `SUPABASE_SERVICE_ROLE_KEY` (same page → service_role key; keep it secret). Redeploy.
4. Without steps 2-3 everything still works, saved on the phone only.

## How results flow
quiz → saved in the phone (localStorage) → POST /api/save → Supabase table `attempts`.
progress page shows a share link `progress?id=<device id>` that works on any phone.

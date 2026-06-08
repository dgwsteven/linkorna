# LINKORNA Deployment Guide

This project is designed for Vercel + Supabase.

## 1. GitHub

Create or connect the repository:

```txt
dgwsteven/linkorna
```

The repository should contain this project root.

## 2. Supabase

1. Go to https://supabase.com.
2. Create a new project.
3. Open SQL Editor.
4. Copy and run `supabase/schema.sql`.
5. Open Project Settings > API.
6. Copy these values:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

The service role key must stay server-side only. Never expose it in browser code.

## 3. Vercel

1. Go to https://vercel.com.
2. Import the GitHub repository.
3. Framework preset: Next.js.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. Add environment variables in Project Settings > Environment Variables.

Required for Supabase:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional for later AI and payments:

```txt
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

After adding or changing environment variables, redeploy the project.

## 4. OpenAI API key, later

Create an API key at:

```txt
https://platform.openai.com/api-keys
```

Add it to Vercel as:

```txt
OPENAI_API_KEY
```

Do not put this key in client-side code.

## 5. Stripe, later

Create Stripe API keys in the Stripe Dashboard under Developers > API keys.

Add:

```txt
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

## 6. Current MVP status

Included now:

- Customer-facing landing page
- Pricing page
- Dashboard
- Six AI employee task pages
- Task result page
- Login/register mock pages
- Admin mock page
- Supabase schema
- Environment variable template

Next implementation step:

- Replace mock login with Supabase Auth.
- Save task input/output rows into Supabase.
- Add server route for OpenAI-backed task generation.
- Add plan enforcement.

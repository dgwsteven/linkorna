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
5. For billing fields, copy and run `supabase/billing.sql`.
6. Open Project Settings > API.
7. Copy these values:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
SUPABASE_SERVICE_ROLE_KEY
```

The secret key must stay server-side only. Never expose it in browser code.

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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Required for real AI generation:

```txt
OPENAI_API_KEY=
LINKORNA_FAST_MODEL=gpt-5-mini
LINKORNA_STRONG_MODEL=gpt-5.4
LINKORNA_GATEWAY_FAST_MODEL=openai/gpt-5-mini
LINKORNA_GATEWAY_STRONG_MODEL=openai/gpt-5.4
```

`OPENAI_API_KEY` enables direct OpenAI generation. It is not tied to one model; the app selects the model per AI employee:

- Fast model: German Email, Supplier Communication, E-commerce Listing
- Strong model: Contract Intelligence, Competitor Intelligence, Meeting Recorder

If Vercel AI Gateway is enabled for the project, the `LINKORNA_GATEWAY_*` variables can be used without a direct provider key. If no AI credential is available, LINKORNA falls back to structured rule-based demo output so the product flow still works.

Required for Stripe payments:

```txt
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

Enable payment methods in Stripe Dashboard > Settings > Payment methods:

- Cards
- PayPal for German and European customers
- Alipay for Chinese customers
- WeChat Pay for Chinese customers

The app uses Stripe subscription Checkout for card/PayPal and one-month access Checkout for Alipay/WeChat Pay because Chinese wallets have recurring payment limitations.

After adding or changing environment variables, redeploy the project.

## 4. OpenAI API key

Create an API key at:

```txt
https://platform.openai.com/api-keys
```

Add it to Vercel as:

```txt
OPENAI_API_KEY
```

Do not put this key in client-side code.

## 5. Stripe

Create Stripe API keys in the Stripe Dashboard under Developers > API keys.

Add:

```txt
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

Create a webhook endpoint:

```txt
https://linkorna.com/api/billing/webhook
```

Subscribe to:

```txt
checkout.session.completed
customer.subscription.updated
customer.subscription.deleted
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
- Supabase task persistence
- Real AI generation path with safe fallback
- Word report download for saved task results
- Billing page and Stripe Checkout endpoints
- Payment paths for card/PayPal subscriptions and Alipay/WeChat monthly passes

Next implementation step:

- Add real Stripe keys and webhook secret in Vercel.
- Run `supabase/billing.sql`.
- Test Stripe Checkout in test mode.

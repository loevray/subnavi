# Subnavi

## Environment Strategy

This project uses the same application code against two Supabase Cloud projects:

- Local development: Supabase Cloud dev project
- Production deployment: Supabase Cloud prod project

The app switches targets through environment variables only. For local work, point
`.env.local` at the dev project. For deployment, configure the hosting platform
with the prod project values.

## Environment Files

- `.env.local.example`: template for local development against the dev project
- `.env.example`: template for production deployment values
- `.env.local`: local-only file used while running the app on your machine
- `.env`: optional local reference file for prod values when needed

Important:

- `.env` currently contains live Supabase credentials. Rotate those keys and move the production values into your deployment platform secrets as soon as possible.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. Never expose it through `NEXT_PUBLIC_*`.
- Keep dev and prod on separate Supabase projects. Do not reuse the prod project for local development.

## Local Development Workflow

1. Copy the dev template:

```powershell
npm run setup
```

2. Fill `.env.local` with the Supabase Cloud dev project values.
3. Start the app:

```powershell
npm run dev
```

## Production Deployment Workflow

```powershell
npm run setup:prod
```

Use the values from `.env.example` as the template for your hosting platform's
environment variables, but point them at the prod Supabase project.

## Schema and Type Flow

- Store schema changes as Supabase migrations under `supabase/migrations`
- Apply and verify schema changes against the dev project first
- Promote the same migrations to the prod project after verification
- Generate TypeScript types from the dev project:

```powershell
npm run gen:types
```

- Generate TypeScript types from the prod project when needed:

```powershell
npm run gen:types:prod
```

## Deploy Links

[storybook](https://main--68415e7255ac6767cd35dc0c.chromatic.com)

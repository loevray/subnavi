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

## Error Handling Policy

<details>
<summary>Core Rules</summary>

- Expected failures are returned as values and handled by the caller.
- Unexpected failures are thrown and allowed to reach the nearest Next.js error boundary.
- `404` cases use `notFound()` and `app/not-found.tsx`, not generic error fallback UI.
- Error handling should stay close to the layer that can present the best user experience.

</details>

<details>
<summary>Server Components</summary>

- Server Components should call the service layer directly instead of calling this app's own API Routes.
- Expected failures from the service layer should be handled with conditional rendering.
- Missing resources should trigger `notFound()`.
- Unexpected failures should not be converted into inline fallback values just to avoid throws. Let them bubble to `app/error.tsx`.

</details>

<details>
<summary>Client Components</summary>

- Client Components should call `app/api/**` endpoints for reads that are initiated in the browser after hydration or through user interaction.
- Client-side fetch failures should be handled with local UI state such as `isLoading`, `error`, and retry actions.
- Do not rely on `app/error.tsx` for `useEffect`, event handler, or normal browser fetch errors.
- Mutations from client UI can keep using API Routes for now. Server Actions can be adopted later when the mutation flow is ready to be unified.

</details>

<details>
<summary>Service Layer</summary>

- Services are server-only modules and may call Supabase or other server-side data sources directly.
- Services should return typed expected failures such as validation errors or not-found cases.
- Services should throw unexpected infrastructure, permission, schema, and unknown runtime errors.
- Services should not catch every error and convert all failures into `success: false`.

</details>

<details>
<summary>API Routes</summary>

- API Routes exist primarily for browser-facing access from Client Components.
- API Routes translate service results into consistent HTTP responses and status codes.
- Expected failures should map to explicit status codes such as `400`, `401`, `403`, `404`, and `409`.
- Unexpected thrown errors should become `500` responses and be logged on the server.

</details>

<details>
<summary>Current Project Mapping</summary>

- Browser-driven event list refreshes and form flows belong on API Routes plus client state handling.
- Page-level data such as event detail, category bootstrapping, and initial event lists belong on Server Components plus direct service calls.
- This keeps the browser on HTTP boundaries while avoiding unnecessary server-to-server round trips inside the App Router.

</details>

## Deploy Links

[storybook](https://main--68415e7255ac6767cd35dc0c.chromatic.com)

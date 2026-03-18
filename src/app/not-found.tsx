import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The requested resource could not be found. Try going back to the home page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}

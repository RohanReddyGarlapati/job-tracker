// Next.js App Router convention: a `loading.tsx` file automatically wraps this
// route segment in a React Suspense boundary, so users see this skeleton
// instantly while the async Server Component (the Prisma query in page.tsx)
// streams in. This is route-level streaming — not a client-side spinner.
// Server Component by default (purely presentational, no interactivity needed).
export default function Loading() {
  return (
    <div className="animate-pulse" aria-label="Loading applications">
      <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
      <div className="rounded-lg border border-gray-200 bg-white">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-gray-100 px-4 py-4 last:border-0"
          >
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-6 w-24 rounded-full bg-gray-200" />
            <div className="ml-auto h-4 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

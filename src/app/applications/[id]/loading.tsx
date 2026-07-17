// Route-level loading UI for /applications/[id] — same App Router Suspense
// convention as the root loading.tsx, but shaped like the detail page.
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse" aria-label="Loading application">
      <div className="h-4 w-32 rounded bg-gray-200" />
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="h-8 w-56 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-40 rounded bg-gray-200" />
        <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

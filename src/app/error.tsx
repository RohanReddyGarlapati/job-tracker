"use client";

// Next.js App Router convention: an `error.tsx` file automatically wraps this
// route segment in a React error boundary, catching rendering/data errors from
// page.tsx and below.
//
// NOTE: error.tsx MUST be a Client Component — error boundaries rely on
// React's class-style catch lifecycle, which only exists on the client.
// This is the one case where Next.js *requires* "use client" at the route level.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-red-800">
        Something went wrong
      </h2>
      <p className="mt-1 text-sm text-red-600">
        {error.message || "Failed to load applications."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

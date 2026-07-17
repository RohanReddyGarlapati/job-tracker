"use client";

// Route-level error boundary for /applications/[id] — same App Router
// convention as the root error.tsx. Must be a Client Component (Next.js
// requirement for error boundaries).
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-red-800">
        Couldn&apos;t load this application
      </h2>
      <p className="mt-1 text-sm text-red-600">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
        <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
          Back to applications
        </Link>
      </div>
    </div>
  );
}

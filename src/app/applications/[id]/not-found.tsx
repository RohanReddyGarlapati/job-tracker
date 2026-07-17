// Rendered when page.tsx calls notFound() — e.g. /applications/does-not-exist.
// Server Component by default (purely presentational).
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-10 text-center">
      <h2 className="text-lg font-semibold">Application not found</h2>
      <p className="mt-1 text-sm text-gray-500">
        This application doesn&apos;t exist or may have been deleted.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to applications
      </Link>
    </div>
  );
}

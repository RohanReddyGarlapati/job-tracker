// Server-renderable presentational component — no interactivity, so it stays
// a Server Component and ships no JS. Rendered by the dashboard when the
// database has no applications.
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
      <h2 className="text-lg font-semibold text-gray-700">
        No applications yet
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Track your first job application to get started.
      </p>
      <Link
        href="/applications/new"
        className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Add your first application
      </Link>
    </div>
  );
}

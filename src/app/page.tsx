// Server Component (async) — reads straight from the database with Prisma and
// renders HTML on the server. No data-fetching JavaScript is sent to the browser.
// The only client-side JS on this page is the StatusSelect "island" embedded in
// each row — a good demonstration of server/client composition.
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import StatusSelect from "@/components/StatusSelect";
import EmptyState from "@/components/EmptyState";
import type { Status } from "@/lib/status";

// Render at request time (never statically cached) so the list always
// reflects the current database state after mutations.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const applications = await prisma.application.findMany({
    orderBy: { appliedAt: "desc" },
  });

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          {applications.length}{" "}
          {applications.length === 1 ? "application" : "applications"} tracked
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/applications/${application.id}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {application.company}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{application.role}</td>
                  <td className="px-4 py-3">
                    {/* Client Component island — PATCHes the API, then refreshes */}
                    <StatusSelect
                      id={application.id}
                      status={application.status as Status}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(application.appliedAt)}
                  </td>
                  <td className="px-4 py-3">
                    {application.url ? (
                      <a
                        href={application.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View ↗
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/applications/${application.id}`}
                      className="text-gray-400 hover:text-blue-600"
                      aria-label={`View ${application.company} application`}
                    >
                      →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

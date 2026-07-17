// Server Component (async, dynamic route) — reads ONE application directly from
// the database using the `params.id` URL segment. All rendering happens on the
// server; the only client-side JS on this page is the StatusSelect and
// DeleteButton islands below.
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import StatusSelect from "@/components/StatusSelect";
import DeleteButton from "@/components/DeleteButton";
import type { Status } from "@/lib/status";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
  });

  // Unknown id → render this segment's not-found.tsx.
  if (!application) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
        ← Back to applications
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {application.company}
            </h1>
            <p className="mt-1 text-gray-600">{application.role}</p>
          </div>
          <StatusBadge status={application.status as Status} />
        </div>

        <dl className="mt-6 space-y-4 border-t border-gray-100 pt-6 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500">Status</dt>
            <dd>
              {/* Client Component island — PATCHes /api/applications/[id] */}
              <StatusSelect
                id={application.id}
                status={application.status as Status}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500">Date applied</dt>
            <dd>{formatDate(application.appliedAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500">Job posting</dt>
            <dd>
              {application.url ? (
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open posting ↗
                </a>
              ) : (
                <span className="text-gray-400">No link provided</span>
              )}
            </dd>
          </div>
          {application.notes && (
            <div>
              <dt className="text-gray-500">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-gray-700">
                {application.notes}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 border-t border-gray-100 pt-4">
          {/* Client Component island — DELETEs, then redirects to `/` */}
          <DeleteButton id={application.id} company={application.company} />
        </div>
      </div>
    </article>
  );
}

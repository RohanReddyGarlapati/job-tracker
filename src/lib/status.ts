// Shared by Server Components, Client Components, and Route Handlers.
// Keep this module dependency-free (no Prisma/Node imports) so it is safe to
// bundle into client-side JavaScript.
//
// SQLite has no enum support in Prisma, so the valid statuses are enforced
// here at the application layer instead of in the database.

export const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

/** Type guard used by the API routes to validate incoming status values. */
export function isStatus(value: unknown): value is Status {
  return (
    typeof value === "string" &&
    (STATUSES as readonly string[]).includes(value)
  );
}

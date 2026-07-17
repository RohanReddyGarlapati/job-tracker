// Server-renderable presentational component — no "use client" because it has
// no hooks and no event handlers. It can render inside Server Components
// without shipping any JavaScript to the browser.
import { STATUS_LABELS, type Status } from "@/lib/status";

const BADGE_STYLES: Record<Status, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  INTERVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  OFFER: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${BADGE_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

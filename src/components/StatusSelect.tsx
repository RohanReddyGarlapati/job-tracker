"use client";

// Client Component — needs an onChange handler and browser fetch() to PATCH the
// API route. It's deliberately small: an interactive "island" dropped into
// server-rendered pages (the dashboard table and the detail page), so the rest
// of each page can stay a Server Component with zero shipped JS.
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { STATUSES, STATUS_LABELS, type Status } from "@/lib/status";

const STATUS_STYLES: Record<Status, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  INTERVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  OFFER: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusSelect({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const router = useRouter();
  const [value, setValue] = useState<Status>(status);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Keep local state in sync when the Server Component re-renders with
  // fresh data from the database (after router.refresh()).
  useEffect(() => setValue(status), [status]);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Status;
    setValue(next); // reflect the choice immediately
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!response.ok) throw new Error("Update failed");

      // Re-render the Server Components so every view of this record
      // (badge, timestamps) shows fresh data. startTransition marks the
      // refresh as non-urgent so the select stays responsive meanwhile.
      startTransition(() => router.refresh());
    } catch {
      setValue(status); // revert to the last server-confirmed value
      setError("Couldn't save");
    } finally {
      setIsSaving(false);
    }
  }

  const busy = isSaving || isPending;

  return (
    <span className="inline-flex flex-col gap-1">
      <select
        aria-label="Application status"
        value={value}
        disabled={busy}
        onChange={handleChange}
        className={`cursor-pointer appearance-none rounded-full border px-2.5 py-1 text-center text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-wait disabled:opacity-60 ${STATUS_STYLES[value]}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}

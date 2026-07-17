"use client";

// Client Component — this page is interactive: it holds form state with
// useState, handles onSubmit, and POSTs from the browser to /api/applications.
// Any page that needs browser events or React state must opt in with
// "use client". A form is the classic case; data-display pages stay server-side.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { STATUSES, STATUS_LABELS, type Status } from "@/lib/status";

const inputClasses =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function NewApplicationPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("APPLIED");
  const [appliedAt, setAppliedAt] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          url: url || undefined,
          notes: notes || undefined,
          status,
          appliedAt,
        }),
      });

      if (!response.ok) {
        // Surface the API's validation message instead of failing silently.
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save application.");
      }

      // Back to the dashboard; refresh() re-runs the Server Component's
      // Prisma query so the new record appears immediately.
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">New application</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Vercel"
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role <span className="text-red-500">*</span>
          </label>
          <input
            id="role"
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Engineer"
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Job posting URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="appliedAt"
              className="block text-sm font-medium text-gray-700"
            >
              Date applied
            </label>
            <input
              id="appliedAt"
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className={inputClasses}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Referrals, interview prep, contacts…"
            className={inputClasses}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save application"}
          </button>
        </div>
      </form>
    </div>
  );
}

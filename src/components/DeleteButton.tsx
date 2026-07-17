"use client";

// Client Component — needs an onClick handler, a confirm dialog, and browser
// fetch() to call the DELETE endpoint, followed by client-side navigation.
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  company,
}: {
  id: string;
  company: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete the application at ${company}? This can't be undone.`
      )
    ) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");

      router.push("/");
      router.refresh();
    } catch {
      setError("Couldn't delete. Try again.");
      setIsDeleting(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Deleting…" : "Delete application"}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </span>
  );
}

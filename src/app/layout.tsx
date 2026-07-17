// Server Component — layouts are Server Components by default, and this one
// stays that way: it only renders navigation links (no state, no event
// handlers), so no layout JavaScript is shipped to the browser at all.
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description:
    "A Next.js App Router dashboard for tracking job applications — TypeScript, Tailwind CSS, Prisma + SQLite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight hover:text-blue-600"
            >
              Job Tracker
            </Link>
            <Link
              href="/applications/new"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + New application
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

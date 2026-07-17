// Route Handlers — these run on the server (Node.js runtime) and form the HTTP
// boundary that Client Components call for mutations, since browser code cannot
// import Prisma or reach the database directly.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isStatus } from "@/lib/status";

// GET /api/applications — list all applications, newest first.
export async function GET() {
  const applications = await prisma.application.findMany({
    orderBy: { appliedAt: "desc" },
  });
  return NextResponse.json(applications);
}

// POST /api/applications — create a new application.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { company, role, url, notes, status, appliedAt } = (body ?? {}) as Record<
    string,
    unknown
  >;

  // Server-side validation — never trust the client, even when it's your own form.
  if (typeof company !== "string" || company.trim() === "") {
    return NextResponse.json({ error: "Company is required." }, { status: 400 });
  }
  if (typeof role !== "string" || role.trim() === "") {
    return NextResponse.json({ error: "Role is required." }, { status: 400 });
  }
  if (status !== undefined && !isStatus(status)) {
    return NextResponse.json(
      { error: "Status must be one of: APPLIED, INTERVIEW, OFFER, REJECTED." },
      { status: 400 }
    );
  }
  if (url !== undefined && url !== null && typeof url !== "string") {
    return NextResponse.json({ error: "URL must be a string." }, { status: 400 });
  }
  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    return NextResponse.json(
      { error: "Notes must be a string." },
      { status: 400 }
    );
  }

  const parsedAppliedAt =
    typeof appliedAt === "string" && !Number.isNaN(Date.parse(appliedAt))
      ? new Date(appliedAt)
      : new Date();

  try {
    const application = await prisma.application.create({
      data: {
        company: company.trim(),
        role: role.trim(),
        url: typeof url === "string" && url.trim() !== "" ? url.trim() : null,
        notes:
          typeof notes === "string" && notes.trim() !== "" ? notes.trim() : null,
        status: isStatus(status) ? status : "APPLIED",
        appliedAt: parsedAppliedAt,
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create application." },
      { status: 500 }
    );
  }
}

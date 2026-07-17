// Route Handlers for a single application, addressed by the [id] URL segment.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isStatus } from "@/lib/status";

type RouteContext = { params: { id: string } };

// GET /api/applications/:id — fetch one application.
export async function GET(_request: Request, { params }: RouteContext) {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
  });
  if (!application) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 }
    );
  }
  return NextResponse.json(application);
}

// PATCH /api/applications/:id — update the status (used by StatusSelect).
export async function PATCH(request: Request, { params }: RouteContext) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { status } = (body ?? {}) as Record<string, unknown>;
  if (!isStatus(status)) {
    return NextResponse.json(
      { error: "Status must be one of: APPLIED, INTERVIEW, OFFER, REJECTED." },
      { status: 400 }
    );
  }

  const existing = await prisma.application.findUnique({
    where: { id: params.id },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 }
    );
  }

  const application = await prisma.application.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(application);
}

// DELETE /api/applications/:id — remove an application (used by DeleteButton).
export async function DELETE(_request: Request, { params }: RouteContext) {
  const existing = await prisma.application.findUnique({
    where: { id: params.id },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 }
    );
  }

  await prisma.application.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

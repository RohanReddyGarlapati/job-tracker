// Seed script — run with `npm run db:seed` (Prisma also runs it automatically
// after `prisma migrate dev`). It is destructive: it clears the table first so
// reseeding stays idempotent.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

const applications = [
  {
    company: "Vercel",
    role: "Frontend Engineer",
    status: "INTERVIEW",
    url: "https://vercel.com/careers",
    notes: "Recruiter call went well — technical round scheduled. Brush up on App Router and React Server Components.",
    appliedAt: daysAgo(12),
  },
  {
    company: "Stripe",
    role: "Software Engineer, Frontend",
    status: "APPLIED",
    url: "https://stripe.com/jobs",
    notes: "Applied via referral from Alex. Dashboard experience team.",
    appliedAt: daysAgo(5),
  },
  {
    company: "Shopify",
    role: "Senior React Developer",
    status: "REJECTED",
    url: "https://www.shopify.com/careers",
    notes: "Rejected after take-home. Feedback: wanted more GraphQL depth. Reapply in 6 months.",
    appliedAt: daysAgo(30),
  },
  {
    company: "Linear",
    role: "Product Engineer",
    status: "OFFER",
    url: "https://linear.app/careers",
    notes: "Offer received! Decision deadline next Friday — schedule compensation chat.",
    appliedAt: daysAgo(21),
  },
  {
    company: "Datadog",
    role: "UI Engineer",
    status: "INTERVIEW",
    url: "https://careers.datadoghq.com",
    notes: null,
    appliedAt: daysAgo(9),
  },
  {
    company: "Notion",
    role: "Full-Stack Engineer",
    status: "APPLIED",
    url: "https://www.notion.com/careers",
    notes: "Portfolio and resume submitted through the careers page.",
    appliedAt: daysAgo(2),
  },
];

async function main() {
  await prisma.application.deleteMany(); // idempotent reseeding
  for (const data of applications) {
    await prisma.application.create({ data });
  }
  console.log(`Seeded ${applications.length} job applications.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

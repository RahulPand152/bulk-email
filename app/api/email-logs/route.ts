import prisma from "@/lib/generated/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Fetch email logs failed:", error);

    return Response.json(
      { success: false, error: "Unable to fetch logs" },
      { status: 500 }
    );
  }
}

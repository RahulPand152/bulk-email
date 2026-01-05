import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  try {
    await db.read();

    const emailLogs = db.data?.emailLogs || [];

    return NextResponse.json(emailLogs);
  } catch (err) {
    console.error("Error fetching email logs:", err);
    return NextResponse.json(
      { error: "Failed to fetch email logs" },
      { status: 500 }
    );
  }
}

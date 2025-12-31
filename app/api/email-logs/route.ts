import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { EmailLog } from "@/app/lib/type";
import { CreateEmailLogSchema } from "@/app/lib/email-log-schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    await db.read();
    const emailLogs = db.data?.emailLogs || [];
    return NextResponse.json(emailLogs);
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch email logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedBody = CreateEmailLogSchema.parse(body);

    await db.read();

    const sent = validatedBody.recipients.filter(
      (r) => r.status === "SENT"
    ).length;

    const failed = validatedBody.recipients.filter(
      (r) => r.status === "FAILED"
    ).length;

    const newLog: EmailLog = {
      id: `log_${Date.now()}`,
      subject: validatedBody.subject,
      templateId: validatedBody.templateId,
      sentAt: new Date().toISOString(),
      totalRecipients: validatedBody.recipients.length,
      sent,
      failed,
      recipients: validatedBody.recipients,
    };

    db.data!.emailLogs.push(newLog);
    await db.write();

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error creating email log:", error);
    return NextResponse.json(
      { error: "Failed to create email log" },
      { status: 500 }
    );
  }
}


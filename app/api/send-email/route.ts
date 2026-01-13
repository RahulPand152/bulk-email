import prisma from "@/lib/prisma";
import { EmailLog } from "@/lib/generated/prisma/client";
import nodemailer from "nodemailer";
export const runtime = "nodejs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipients, subject: customSubject, body: customBody } = body;

    if (!recipients || recipients.length === 0) {
      return Response.json(
        { error: "No recipients selected" },
        { status: 400 }
      );
    }
    if (recipients.length > 50) {
      return Response.json(
        { error: "Max 50 recipients allowed per batch" },
        { status: 400 }
      );
    }
    if (!customSubject || !customBody) {
      return Response.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailLogs: EmailLog[] = [];

    await Promise.all(
      recipients.map(
        async (recipient: {
          email: string;
          firstName: string;
          lastName?: string;
        }) => {
          try {
            await transporter.sendMail({
              from: `"Kaamhubs" <${process.env.EMAIL_USER}>`,
              bcc: recipient.email,
              subject: customSubject,
              html: `<div style="font-family: sans-serif; line-height: 1.6; color: #111;">
      <!-- Greeting -->
      <p>Dear ${recipient.firstName} ${recipient.lastName},</p> 
      <div > ${customBody} </div> 
      <p style="margin-top: 20px item-center">
        <a href="https://kaamhubs.com" 
           style="
             display: inline-block;
             padding: 12px 24px;
             background-color: #1D4ED8;
             color: white;
             text-decoration: none;
             border-radius: 6px;
             font-weight: bold;
           "
        >
          Visit Kaamhubs
        </a>
      </p>

      <!-- Footer -->
      <p style="margin-top: 20px;">Regards,<br/>Kaamhubs &lt;Kaamhubs@support.com&gt;</p>
    </div>
  `, //
            });

            emailLogs.push({
              to: recipient.email,
              subject: customSubject,
              status: "SENT",
              error: null,
              body: customBody,
              id: randomUUID(), // <-- Unique UUID
              createdAt: new Date(),
            });
          } catch (err) {
            emailLogs.push({
              to: recipient.email,
              subject: customSubject,
              status: "FAILED",
              body: customBody,
              id: new Date().toISOString(),
              createdAt: new Date(),
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
      )
    );

    // Persist logs to lowdb
    // await db.read();
    // db.data!.emailLogs = db.data!.emailLogs || [];
    // db.data!.emailLogs.push({
    //   id: `log_${Date.now()}`,
    //   subject: customSubject,
    //   sentAt: new Date().toISOString(),
    //   totalRecipients: recipients.length,
    //   sent: sendLogs.filter((s) => s.status === "SENT").length,
    //   failed: sendLogs.filter((s) => s.status === "FAILED").length,
    //   recipients: sendLogs,
    // });
    // await db.write();

    // return Response.json({ success: true, logs: sendLogs });

    const logs = await prisma.emailLog.createMany({
      data: emailLogs,
    });

    console.log(logs, "......logs");

    return Response.json({
      success: true,
      sent: emailLogs.filter((e) => e.status === "SENT").length,
      failed: emailLogs.filter((e) => e.status === "FAILED").length,
    });
  } catch (error) {
    console.error("Bulk email failed:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

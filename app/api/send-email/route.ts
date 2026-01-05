import nodemailer from "nodemailer";
import db from "@/app/lib/db"; // your lowdb instance

export const runtime = "nodejs";

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

    const sendLogs: Array<{
      id: string;
      to: string;
      subject: string;
      status: "SENT" | "FAILED";
      error: string | null;
      timestamp: string;
    }> = [];

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
     <img src="kaamhubs/logo_final.webp" alt="Kaamhubs Logo" width="200" height="100" />
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

            sendLogs.push({
              id: crypto.randomUUID(),
              to: recipient.email,
              subject: customSubject,
              status: "SENT",
              error: null,
              timestamp: new Date().toISOString(),
            });
          } catch (err) {
            sendLogs.push({
              id: crypto.randomUUID(),
              to: recipient.email,
              subject: customSubject,
              status: "FAILED",
              error: err instanceof Error ? err.message : String(err),
              timestamp: new Date().toISOString(),
            });
          }
        }
      )
    );

    // Persist logs to lowdb
    await db.read();
    db.data!.emailLogs = db.data!.emailLogs || [];
    db.data!.emailLogs.push({
      id: `log_${Date.now()}`,
      subject: customSubject,
      sentAt: new Date().toISOString(),
      totalRecipients: recipients.length,
      sent: sendLogs.filter((s) => s.status === "SENT").length,
      failed: sendLogs.filter((s) => s.status === "FAILED").length,
      recipients: sendLogs,
    });
    await db.write();

    return Response.json({ success: true, logs: sendLogs });
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

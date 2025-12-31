import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import KaamhubsMarketingEmail from "@/emails/join";
import KaamhubsFeedbackEmail from "@/emails/promotion";
import { initEmailLogDB } from "@/app/lib/db";

export const runtime = "nodejs";

// Map templates to component + subject
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templatesMap: Record<string, { component: any; subject: string }> = {
  marketing: {
    component: KaamhubsMarketingEmail,
    subject: "Welcome to Kaamhubs!",
  },
  feedback: {
    component: KaamhubsFeedbackEmail,
    subject: "Give feedback to Kaamhubs!",
  },
};

export async function POST(req: Request) {
  try {
    const { recipients } = await req.json();

    if (!recipients || recipients.length === 0) {
      return Response.json(
        { error: "No recipients selected" },
        { status: 400 }
      );
    }

    // Limit batch size
    if (recipients.length > 50) {
      return Response.json(
        { error: "Max 50 recipients allowed per batch" },
        { status: 400 }
      );
    }

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password
      },
    });

    // Ensure LowDB initialized
    await initEmailLogDB();

    const sendLogs: Array<{
      id: number;
      to: string;
      template: string;
      subject: string;
      status: string;
      error: string | null;
      timestamp: string;
    }> = [];

    const emailPromises = recipients.map(
      async (recipient: {
        email: string;
        firstName: string;
        lastName?: string;
        contactNumber?: string;
        template?: string;
      }) => {
        // Select template + subject
        
        const requestedTemplate =
          recipient.template?.toLowerCase() || "feedback";
        const templateData =
          templatesMap[requestedTemplate] || templatesMap["feedback"];
        const SelectedTemplate = templateData.component;
        const subject = templateData.subject;

        // Render HTML
        const emailHtml = await render(
          SelectedTemplate({
            firstName: recipient.firstName,
            lastName: recipient.lastName,
            email: "Kaamhubs@supportgmail.com",
            contactNumber: "+977-9898989898",
            ctaLink: "https://kaamhubs.com",
          })
        );

        try {
          // Send email
          await transporter.sendMail({
            from: `"Kaamhubs" <${process.env.EMAIL_USER}>`,
            bcc: recipient.email,
            subject,
            html: emailHtml,
            text: emailHtml.replace(/<[^>]+>/g, ""),
          });

          // Log success
          const logEntry = {
            id: Date.now() + Math.random(),
            to: recipient.email,
            template: recipient.template,
            subject,
            status: "SENT",
            error: null,
            timestamp: new Date().toISOString(),
          };
          sendLogs.push(logEntry);
          return logEntry;
        } catch (err) {
          // Log failure
          const logEntry = {
            id: Date.now() + Math.random(),
            to: recipient.email,
            template,
            subject,
            status: "FAILED",
            error: err instanceof Error ? err.message : String(err),
            timestamp: new Date().toISOString(),
          };
          sendLogs.push(logEntry);
          return logEntry;
        }
      }
    );

    await Promise.all(emailPromises);

    return Response.json({ success: true, logs: sendLogs });
  } catch (error) {
    console.error("Bulk email failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

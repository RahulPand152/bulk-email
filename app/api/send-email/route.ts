import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import KaamhubsMarketingEmail from "@/emails/join";

export const runtime = "nodejs";

export async function POST() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailHtml = await render(
    KaamhubsMarketingEmail({
      firstName: "chandan",
      lastName: "Pandit",
      email: "rahultoprove982687@gmail.com",
      contactNumber: "+977-98989898989898",
      ctaLink: "https://kaamhubs.com",
      
    })
  );

  await transporter.sendMail({
    from: `"Kaamhubs" <${process.env.EMAIL_USER}>`,
    to: "rahultoprove982687@gmail.com",
    subject: "Welcome to Kaamhubs ",
    html: emailHtml,
  });

  return Response.json({ success: true });
}

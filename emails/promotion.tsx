import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { pixelBasedPreset } from "@react-email/components";

interface KaamhubsFeedbackEmailProps {
  firstName: string;
  lastName?: string;
  email: string;
  contactNumber?: string;
  ctaLink?: string;
   htmlContent: string;
}

const baseUrl = process.env.KAAMHUBS_URL
  ? process.env.KAAMHUBS_URL
  : "http://localhost:3000";

export const KaamhubsFeedbackEmail = ({
  firstName,
  email,
  contactNumber,
  ctaLink,
  
}: KaamhubsFeedbackEmailProps) => {
  const previewText = `We’d love your feedback at Kaamhubs!`;

  return (
    <Html>
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="mx-auto bg-white px-4 font-sans">
          <Preview>{previewText}</Preview>

          <Container className="mx-auto rounded border border-[#eaeaea] p-6">
            {/* Logo */}
            <Section className="text-center mb-4">
              <Img
                src={`${baseUrl}/logo_final.webp`}
                width="60"
                height="50"
                alt="Kaamhubs Logo"
                className="mx-auto"
              />
            </Section>

            {/* Greeting */}
            <Text className="text-[14px] text-black">
              Hello {firstName} ,
            </Text>

            {/* Message */}
            <Text className="text-[14px] leading-relaxed">
              We hope you are enjoying Kaamhubs! We would love to hear your
              feedback on your experience so far. Your insights help us improve
              and serve you better.
            </Text>

            {/* User Info */}
            {email && (
              <Section className="bg-gray-50 rounded p-4 my-4">
                <Text className="text-[13px] text-black mb-1">
                  <strong>Email:</strong> {email}
                </Text>
                {contactNumber && (
                  <Text className="text-[13px] text-black">
                    <strong>Contact:</strong> {contactNumber}
                  </Text>
                )}
              </Section>
            )}

            {/* CTA */}
            <Section className="text-center my-6">
              <Button
                href={ctaLink ?? "https://kaamhubs.com/feedback"}
                className="rounded px-6 py-3 text-[13px] font-semibold bg-[#3777bd] text-white no-underline"
              >
                Give Feedback
              </Button>
            </Section>

            {/* Backup link */}
            <Text className="text-[13px] text-black">
              Or visit:
              <a
                href={ctaLink ?? "https://kaamhubs.com/feedback"}
                className="text-blue-600 ml-1 no-underline"
              >
                {ctaLink ?? "https://kaamhubs.com/feedback"}
              </a>
            </Text>

            <Hr className="my-4 border border-[#eaeaea]" />

            {/* Footer */}
            <Text className="text-[11px] text-[#666666] leading-relaxed">
              This email was sent to {email}. You are receiving this message
              because your contact information is associated with Kaamhubs. If
              you no longer wish to receive emails, you may unsubscribe at any
              time.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

KaamhubsFeedbackEmail.PreviewProps = {
  firstName: "Rahul",
  email: "Kaamhubs@supportgmail.com",
  contactNumber: "+977-9826874445",
  ctaLink: "https://kaamhubs.com/feedback",
} as KaamhubsFeedbackEmailProps;

export default KaamhubsFeedbackEmail;

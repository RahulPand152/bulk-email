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
} from '@react-email/components';
import { pixelBasedPreset } from '@react-email/components';

interface KaamhubsFeedbackEmailProps {
  firstName: string;
  lastName:string,
  email: string;
  contactNumber?: string;
  ctaLink?: string;
}

const baseUrl = process.env.KAAMHUBS_URL ?? 'http://localhost:3000';

export const KaamhubsFeedbackEmail = ({
  firstName,
  lastName,
  email,
  contactNumber,
  ctaLink,
}: KaamhubsFeedbackEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={{ presets: [pixelBasedPreset] }}>
      <Body className="mx-auto bg-white px-4 font-sans">
        <Preview>We’d love your feedback at Kaamhubs!</Preview>
        <Container className="mx-auto rounded border border-[#eaeaea] p-6">
          <Section className="text-center mb-4">
            <Img
              src={`${baseUrl}/logo_final.webp`}
              width="60"
              height="50"
              alt="Kaamhubs Logo"
              className="mx-auto"
            />
          </Section>
          <Text className="text-[14px] text-black">Hello {firstName} {lastName}</Text>
          <Text className="text-[14px] leading-relaxed">
            We hope you are enjoying Kaamhubs! We would love to hear your feedback
            to improve your experience.
          </Text>
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
          <Section className="text-center my-6">
            <Button
              href={ctaLink ?? 'https://kaamhubs.com/feedback'}
              className="rounded px-6 py-3 text-[13px] font-semibold bg-[#3777bd] text-white no-underline"
            >
              Give Feedback
            </Button>
          </Section>
          <Text className="text-[11px] text-[#666666] leading-relaxed">
            This email was sent to {email}. If you no longer wish to receive emails,
            you may unsubscribe at any time.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default KaamhubsFeedbackEmail;

"use client";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

interface KaamhubsMarketingEmailProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  ctaLink?: string;
}

export const KaamhubsMarketingEmail = ({
  firstName,
  lastName,
  email,
  contactNumber,
  ctaLink,
}: KaamhubsMarketingEmailProps) => {
  const previewText = `Discover opportunities with Kaamhubs`;

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
                src={`${baseUrl}/logo_final_2.png`}
                width="44"
                height="44"
                alt="Kaamhubs Logo"
                className="mx-auto"
              />
            </Section>

            {/* Heading */}
            <Heading className="text-center text-[24px] font-semibold text-black">
              Grow Your Career with{" "}
              <strong>
                <span className="text-[#3777bd]">Kaam</span>
                <span className="text-[#85c635]">Hubs</span>
              </strong>
            </Heading>

            {/* Greeting */}
            <Text className="text-[14px] text-black">
              Hello {firstName} {lastName},
            </Text>

            {/* Marketing Message */}
            <Text className="text-[14px] text-black leading-relaxed">
              Kaamhubs is a modern platform designed to connect professionals,
              freelancers, and businesses with meaningful opportunities. Whether
              you're looking to hire, collaborate, or grow your career, Kaamhubs
              helps you move faster and smarter.
            </Text>

            {/* User Info (Optional for CRM personalization) */}
            <Section className="bg-gray-50 rounded p-4 my-4">
              <Text className="text-[13px] text-black mb-1">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="text-[13px] text-black">
                <strong>Contact:</strong> {contactNumber}
              </Text>
            </Section>

            {/* CTA */}
            <Section className="text-center my-6">
              <Button
                href={ctaLink}
                className="rounded bg-black px-6 py-3 text-[13px] font-semibold text-white no-underline"
              >
                Explore Kaamhubs
              </Button>
            </Section>

            {/* Backup Link */}
            <Text className="text-[13px] text-black">
              Or visit:
              <Link href={ctaLink} className="text-blue-600 ml-1 no-underline">
                {ctaLink}
              </Link>
            </Text>

            <Hr className="my-4 border border-[#eaeaea]" />

            {/* Footer */}
            <Text className="text-[11px] text-[#666666] leading-relaxed">
              This email was sent to {email}. You are receiving this message
              because your contact information is associated with Kaamhubs. If
              you no longer wish to receive promotional emails, you may
              unsubscribe at any time.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

KaamhubsMarketingEmail.PreviewProps = {
  firstName: "Rahul",
  lastName: "Pandit",
  email: "rahulpandit@email.com",
  contactNumber: "+977-9826874445",
  ctaLink: "https://kaamhubs.com",
} as KaamhubsMarketingEmailProps;

export default KaamhubsMarketingEmail;

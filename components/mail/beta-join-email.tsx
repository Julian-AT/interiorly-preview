import React from "react";
import {
  Tailwind,
  Button,
  Html,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Image,
} from "@react-email/components";
import { siteConfig } from "@/config/site";

interface BetaJoinEmailProps {
  firstName: string;
}

const BetaJoinEmail = ({ firstName }: BetaJoinEmailProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
                mutedForeground: "#737373",
                background: "#f3f4f6",
                secondaryForeground: "#5B21B6",
              },
            },
          },
        }}
      >
        <Container className="mx-auto p-10 border rounded-xl bg-white max-w-4xl">
          <Section className="flex items-baseline space-x-3 justify-center">
            {/* Inline SVG or Image can be used here */}
            <svg
              className="w-8 h-8"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG content */}
            </svg>
            <Text className="text-2xl font-bold my-auto">Interiorly AI</Text>
          </Section>
          <Section className="text-center mt-5">
            <Heading size={3} className="font-bold">
              Welcome to the Beta!
            </Heading>
            <Text>
              Hi {firstName}, You have successfully joined the beta. <br />
              We&nquot;ll notify you when Interiorly is ready for you. <br />
            </Text>
            <Text className="text-sm text-mutedForeground">
              You can try the{" "}
              <Link
                href="https://interiorly.vercel.app/"
                className="text-secondaryForeground p-1 text-sm inline-flex items-center justify-center gap-1 hover:underline"
              >
                Preview of Interiorly AI
              </Link>{" "}
              in the meantime.
            </Text>
            <Button
              href="https://interiorly.vercel.app/"
              className="bg-brand px-3 py-2 font-medium leading-4 text-white mx-10"
            >
              Explore the preview
            </Button>
          </Section>
          <hr className="my-5" />
          <Section className="flex items-center justify-center gap-3">
            {/* Replace with appropriate icon or text */}
            <Link href={siteConfig.links.instagram} className="w-9 px-0">
              Instagram Icon
            </Link>
            <Link href={siteConfig.links.github} className="w-9 px-0">
              GitHub Icon
            </Link>
          </Section>
          <Section className="text-center my-5 text-sm text-mutedForeground">
            <Text>
              <i>
                This is an automated email. Please do not reply to this email.
                <br /> If you did not sign up for the beta, ignore this email.
              </i>
            </Text>
          </Section>
          <Text className="text-sm flex justify-center text-mutedForeground">
            © 2024 Interiorly AI
          </Text>
        </Container>
      </Tailwind>
    </Html>
  );
};

export default BetaJoinEmail;

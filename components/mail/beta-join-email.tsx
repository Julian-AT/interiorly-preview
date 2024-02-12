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
  Text,
  // @ts-ignore
} from "@react-email/components"; // @ts-ignore
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface InteriorlyBetaSignupProps {
  email: string;
  firstName: string;
  lastName: string;
  ip: string;
  geolocation: string;
}

const baseUrl = "https://interiorly.vercel.app";
const userImage =
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

export const InteriorlyBetaSignUpEmail = ({
  email,
  firstName,
  lastName,
  ip,
  geolocation,
}: InteriorlyBetaSignupProps) => {
  const previewText = `Interiorly - Beta Sign-Up Confirmation`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="text-black text-[28px] font-normal text-center p-0 mt-8 mx-0">
              <strong>Interiorly AI</strong>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 mb-6 mx-0">
              Welcome to the <strong>Beta.</strong>
            </Heading>
            <Section className="flex justify-center items-center text-center w-full">
              <Img
                className="rounded-full mx-auto"
                src={userImage}
                width="64"
                height="64"
              />
            </Section>
            <Text>
              Hi {firstName}, you have successfully signed up for the{" "}
              <strong>Beta version</strong> of Interiorly. We&apos;ll notify you
              once Interiorly is ready for you.
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] ">
              This message is intended for{" "}
              <span className="text-black">
                {firstName} {lastName}
              </span>
              . The Request was sent from{" "}
              <span className="text-black">{ip}</span> located in{" "}
              <span className="text-black">{geolocation}</span>. If you were not
              expecting this confirmation message, you can ignore this email.
              <br />
              <br />
            </Text>
            <Text className="flex w-full justify-center text-center">
              You can use the&nbsp;
              <span className="text-black">preview version</span>&nbsp;of
              Interiorly in the meantime
            </Text>
            <Section className="mt-[32px] mb-[32px] justify-center text-center">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={baseUrl}
              >
                Interiorly AI Preview
              </Button>
            </Section>
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              Click{" "}
              <Link
                href={`${baseUrl}/beta/leave?email=${encodeURIComponent(
                  email
                )}`}
                className="text-black hover:underline"
              >
                here
              </Link>{" "}
              if you wish to leave the Beta.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InteriorlyBetaSignUpEmail;

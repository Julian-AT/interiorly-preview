import { BetaSignupSchema } from "@/schemas/beta";
import { Resend } from "resend";
import BetaJoinEmail from "@/components/mail/beta-join-email";
import { geolocation, ipAddress } from "@vercel/edge";

export const runtime = "edge";

const { RESEND_API_KEY, RESEND_BETA_AUDIENCE_ID } = process.env;

let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const resend = new Resend(RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, firstName, lastName } = json;

    if (!email || !firstName || !lastName) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    await BetaSignupSchema.parseAsync({ email, firstName, lastName });

    const audience = await resend.contacts.list({
      audienceId: RESEND_BETA_AUDIENCE_ID!,
    });

    if (audience.data?.data.some((contact) => contact.email === email)) {
      return new Response(
        JSON.stringify({ error: "You have already signed up for the beta." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const contact = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: RESEND_BETA_AUDIENCE_ID!,
    });

    const { city, country } = geolocation(req);
    const region = country ? regionNames.of(country) : "Unknown";
    const ip = ipAddress(req) || "Unknown";

    await resend.emails.send({
      from: "Interiorly <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to the Beta!",
      react: BetaJoinEmail({
        email,
        firstName,
        lastName,
        ip,
        geolocation: city && country ? `${city}, ${region}` : "Unknown",
      }),
    });

    return new Response(
      JSON.stringify({
        message: "Successfully signed up for the beta.",
        id: contact.data?.id,
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log(error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

import { getVercelOidcToken } from "@vercel/functions/oidc";
import { ExternalAccountClient } from "google-auth-library";
import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";

import { defaultHandler, defaultResponder } from "@calcom/lib/server";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line turbo/no-undeclared-env-vars
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line turbo/no-undeclared-env-vars
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line turbo/no-undeclared-env-vars
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line turbo/no-undeclared-env-vars
// eslint-disable-next-line turbo/no-undeclared-env-vars
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line turbo/no-undeclared-env-vars
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

const scopes = ["https://www.googleapis.com/auth/calendar"];

// Initialize the External Account Client
const authClient = ExternalAccountClient.fromJSON({
  type: "external_account",
  audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
  subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
  token_url: "https://sts.googleapis.com/v1/token",
  service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  client_id: "", // Not needed for Workload Identity Federation
  client_secret: "", // Not needed for Workload Identity Federation
  subject_token_supplier: {
    getSubjectToken: getVercelOidcToken,
  },
});

async function createCalendarEvent({ userToImpersonate }: { userToImpersonate: string }) {
  try {
    // Get the access token
    const credentials = await authClient.getCredentials();
    const token = credentials.access_token;

    // Create a new OAuth2Client using the obtained token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    // Create the calendar client with the OAuth2Client
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: "Test Meeting - Workload Identity Federation",
      description: "Discuss project updates and plans.",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString(),
        timeZone: "America/Los_Angeles",
      },
      attendees: [{ email: "attendee1@domain.com" }, { email: "attendee2@domain.com" }],
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    console.log(`Event created: ${response.data.htmlLink}`);
    return response.data.htmlLink;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const userToImpersonate = req.query.userToImpersonate as string;
  const link = await createCalendarEvent({ userToImpersonate });
  return res.json({ link });
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(getHandler) }),
});

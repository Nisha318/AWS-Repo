// Runtime: nodejs20.x
// Handler: sendEmail.handler
// Env vars: TABLE_NAME=ContactMessages, REGION=us-east-1, RECEIVER=you@example.com, SENDER=verified@your-domain
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const REGION = process.env.REGION || "us-east-1";
const TABLE_NAME = process.env.TABLE_NAME || "ContactMessages";
const RECEIVER = process.env.RECEIVER || "owner@example.com";
const SENDER   = process.env.SENDER   || "sender-verified-in-ses@example.com";

// Lock CORS to your site origin
const ALLOW_ORIGIN = "https://theepicbooksofnisha.click";

const ses = new SESClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handler = async (event) => {
  // API Gateway REST (proxy) or direct invoke
  const body = typeof event?.body === "string" ? safeJson(event.body) : (event?.body ?? {});
  const { name = "", email = "", phone = "", message = "" } = body;

  if (!name.trim() || !EMAIL_RE.test(email)) {
    return resp(400, { error: "name and valid email are required" });
  }

  const id = randomUUID();
  const ts = new Date().toISOString();

  try {
    // 1) Persist to DynamoDB
    await ddb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: { id, name, email, phone, message, createdAt: ts }
    }));

    // 2) Notify owner via SES
    const emailParams = {
      Destination: { ToAddresses: [RECEIVER] },
      Source: SENDER,
      Message: {
        Subject: { Data: `New eBook lead: ${name}`, Charset: "UTF-8" },
        Body: {
          Text: {
            Data:
`A new eBook lead was captured.

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Message: ${message}

ID:   ${id}
Time: ${ts}`,
            Charset: "UTF-8"
          }
        }
      }
    };
    if (EMAIL_RE.test(email)) emailParams.ReplyToAddresses = [email];
    await ses.send(new SendEmailCommand(emailParams));

    return resp(200, { ok: true, id });
  } catch (err) {
    console.error("POST error:", err);
    return resp(500, { error: "Internal error" });
  }
};

function resp(statusCode, json) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key,X-Amz-Date,X-Amz-Security-Token",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    },
    body: JSON.stringify(json)
  };
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }

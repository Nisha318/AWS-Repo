// Runtime: nodejs20.x
// Handler: listContacts.handler
// Env vars: TABLE_NAME=ContactMessages, REGION=us-east-1
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.REGION || "us-east-1";
const TABLE_NAME = process.env.TABLE_NAME || "ContactMessages";
const ALLOW_ORIGIN = "https://theepicbooksofnisha.click";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

export const handler = async (event) => {
  try {
    const qs = event?.queryStringParameters || {};
    const limit = clampInt(qs.limit, 1, 50, 10); // default 10, max 50
    const lastKey = decodeKey(qs.lastKey);

    const scanParams = {
      TableName: TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey: lastKey || undefined
    };

    const out = await ddb.send(new ScanCommand(scanParams));

    // Sort newest first by createdAt (ISO string)
    const items = (out.Items || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    // Encode the LastEvaluatedKey so it’s URL-safe
    const nextKey = out.LastEvaluatedKey ? encodeKey(out.LastEvaluatedKey) : null;

    return resp(200, { items, lastKey: nextKey, count: items.length });
  } catch (err) {
    console.error("GET error:", err);
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

function clampInt(v, min, max, fallback) {
  const n = parseInt(v, 10);
  if (Number.isFinite(n)) return Math.min(Math.max(n, min), max);
  return fallback;
}

function encodeKey(obj) { return Buffer.from(JSON.stringify(obj), "utf8").toString("base64"); }
function decodeKey(s) {
  if (!s) return null;
  try { return JSON.parse(Buffer.from(s, "base64").toString("utf8")); }
  catch { return null; }
}

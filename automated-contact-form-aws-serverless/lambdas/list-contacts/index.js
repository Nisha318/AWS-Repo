const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  const limit = event.queryStringParameters?.limit
    ? parseInt(event.queryStringParameters.limit)
    : 5;
  const lastKey = event.queryStringParameters?.lastKey
    ? JSON.parse(Buffer.from(event.queryStringParameters.lastKey, "base64"))
    : undefined;

  try {
    const params = {
      TableName: TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey: lastKey,
      ScanIndexForward: false, // newest first if using sort key
    };

    const result = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        items: result.Items,
        lastKey: result.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
              "base64"
            )
          : null,
        count: result.Count,
      }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://theepicbooksofnisha.click",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    "Access-Control-Allow-Headers":
      "Content-Type,Authorization,X-Api-Key,X-Amz-Date,X-Amz-Security-Token",
  };
}

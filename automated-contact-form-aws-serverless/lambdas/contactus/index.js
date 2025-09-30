const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

const TABLE_NAME = process.env.TABLE_NAME;
const SES_EMAIL = process.env.SES_EMAIL; // your verified SES email

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body);

    // Basic validation
    if (!body.name || !body.email) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Name and email are required." }),
      };
    }

    const item = {
      id: AWS.util.uuid.v4(),
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      message: body.message || "",
      createdAt: new Date().toISOString(),
    };

    // Save to DynamoDB
    await dynamodb.put({ TableName: TABLE_NAME, Item: item }).promise();

    // Send SES email notification
    const emailParams = {
      Destination: { ToAddresses: [SES_EMAIL] },
      Message: {
        Body: {
          Text: { Data: `New lead:\n\n${JSON.stringify(item, null, 2)}` },
        },
        Subject: { Data: "New Contact Form Submission" },
      },
      Source: SES_EMAIL,
    };

    await ses.sendEmail(emailParams).promise();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Submission successful", item }),
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

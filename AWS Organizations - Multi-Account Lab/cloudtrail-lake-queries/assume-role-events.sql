SELECT
  eventTime,
  userIdentity.arn AS callingPrincipal,
  userIdentity.type AS principalType,
  json_extract_scalar(CAST(requestParameters AS JSON), '$.roleArn') AS assumedRole,
  sourceIPAddress,
  awsRegion
FROM
  a1108ccd-5700-4d23-9b7f-cfbae7c1308b
WHERE
  eventName = 'AssumeRole'
ORDER BY
  eventTime DESC
LIMIT 50;

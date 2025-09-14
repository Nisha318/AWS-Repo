-- Recent AssumeRole activity (last 50)
SELECT
  eventTime,
  userIdentity.arn,
  userIdentity.type,
  json_extract_scalar(requestParameters, '$.roleArn')     AS assumedRole,
  sourceIPAddress,
  awsRegion
FROM a1108ccd-5700-4d23-9b7f-cfbae7c1308b
WHERE eventSource = 'sts.amazonaws.com'
  AND eventName   = 'AssumeRole'
ORDER BY eventTime DESC
LIMIT 50;

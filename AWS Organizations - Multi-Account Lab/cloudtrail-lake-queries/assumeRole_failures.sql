-- Failed AssumeRole attempts (errorCode present) last 30 days
SELECT
  eventTime,
  userIdentity.arn,
  json_extract_scalar(requestParameters, '$.roleArn') AS attemptedRole,
  errorCode,
  errorMessage,
  sourceIPAddress,
  awsRegion
FROM a1108ccd-5700-4d23-9b7f-cfbae7c1308b
WHERE eventSource = 'sts.amazonaws.com'
  AND eventName   = 'AssumeRole'
  AND errorCode IS NOT NULL
  AND eventTime >= current_timestamp - INTERVAL '30' DAY
ORDER BY eventTime DESC;

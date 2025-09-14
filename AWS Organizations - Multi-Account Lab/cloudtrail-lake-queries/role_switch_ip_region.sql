-- Distinct IPs & regions used when assuming roles (last 30 days)
SELECT DISTINCT
  coalesce(userIdentity.sessionContext.sessionIssuer.userName, '(unknown)') AS sessionIssuer,
  json_extract_scalar(requestParameters, '$.roleArn') AS roleArn,
  sourceIPAddress,
  awsRegion
FROM a1108ccd-5700-4d23-9b7f-cfbae7c1308b
WHERE eventSource = 'sts.amazonaws.com'
  AND eventName   = 'AssumeRole'
  AND eventTime  >= current_timestamp - INTERVAL '30' DAY
ORDER BY sessionIssuer, roleArn, sourceIPAddress, awsRegion;

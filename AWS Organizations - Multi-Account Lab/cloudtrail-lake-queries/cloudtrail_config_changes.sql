-- CloudTrail configuration changes (org-wide trail governance evidence)
SELECT
  eventTime,
  eventName,
  userIdentity.arn,
  sourceIPAddress,
  awsRegion,
  errorCode,
  errorMessage
FROM a1108ccd-5700-4d23-9b7f-cfbae7c1308b
WHERE eventSource = 'cloudtrail.amazonaws.com'
  AND eventName IN (
    'CreateTrail','UpdateTrail','DeleteTrail',
    'StartLogging','StopLogging',
    'PutEventSelectors','PutInsightSelectors'
  )
  AND eventTime >= current_timestamp - INTERVAL '30' DAY
ORDER BY eventTime DESC;

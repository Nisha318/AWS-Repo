-- IAM admin-scope changes for roles/users/policies (last 30 days)
SELECT
  eventTime,
  eventName,
  userIdentity.arn,
  requestParameters,
  awsRegion,
  errorCode
FROM a1108ccd-5700-4d23-9b7f-cfbae7c1308b
WHERE eventSource = 'iam.amazonaws.com'
  AND eventName IN (
    'CreateRole','DeleteRole','UpdateAssumeRolePolicy','PutRolePolicy',
    'AttachRolePolicy','DetachRolePolicy',
    'CreateUser','DeleteUser','AttachUserPolicy','DetachUserPolicy'
  )
  AND eventTime >= current_timestamp - INTERVAL '30' DAY
ORDER BY eventTime DESC;

-- Count of AssumeRole events by recipient (target) account (last 7 days)
SELECT
  recipientAccountId,
  count(*) AS assumeRole_events_7d
FROM a1108ccd-5700-4d23-9b7f-cfbae7c1308b
WHERE eventSource = 'sts.amazonaws.com'
  AND eventName   = 'AssumeRole'
  AND eventTime  >= current_timestamp - INTERVAL '7' DAY
GROUP BY 1
ORDER BY assumeRole_events_7d DESC;

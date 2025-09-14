# 📎 Evidence Screenshots

This folder contains all screenshots captured during the **AWS Organizations: Multi-Account Governance Lab**.

They serve as **evidence artifacts** to demonstrate correct implementation and support the associated **NIST SP 800-53 Rev 5 / RMF controls** documented in the main [README](../README.md) and [rmf-mapping.md](../rmf-mapping.md).

---

## 🧩 Contents

| Filename                          | Description                                               | Related Step         |
|----------------------------------|-------------------------------------------------------------|--------------------------|
| `aws-console-org-hierarchy.png`   | AWS Organizations console showing Management, Prod, Dev accounts | Step 1 (Architecture)   |
| `role-prod-trust-policy.png`      | Trust policy for `OrganizationAccountAccessRole` in Production | Step 2 (Verify Role Creation) |
| `role-dev-trust-policy.png`       | Trust policy for `OrganizationAccountAccessRole` in Development | Step 2 (Verify Role Creation) |
| `role-switch-success-prod.png`    | Switched from Management IAM user into Production account      | Step 4 (Test Role Switching) |
| `role-switch-success-dev.png`     | Switched from Management IAM user into Development account     | Step 4 (Test Role Switching) |
| `cloudtrail-org-trail.png`        | CloudTrail `org-cloudtrail` trail applied org-wide               | Step 5 (CloudTrail Setup) |
| `cloudtrail-trail-config.png`     | CloudTrail trail configuration with log validation + S3 bucket  | Step 5 (CloudTrail Setup) |
| `cloudtrail-assumerole-events.png`| CloudTrail showing `AssumeRole` events captured                  | Step 5 (CloudTrail Setup) |
| `cloudtrail-lake-query.png`       | CloudTrail Lake query used to search for AssumeRole events      | Step 6 (CloudTrail Lake Verification) |
| `cloudtrail-lake-results.png`     | Query results showing Management IAM user assuming member roles | Step 6 (CloudTrail Lake Verification) |

---

📌 **Note:** These screenshots are for demonstration and professional development purposes only and are not part of a formal RMF authorization package.

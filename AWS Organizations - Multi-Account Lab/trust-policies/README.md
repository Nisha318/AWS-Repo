# 📜 Trust Policy JSON Files

This folder contains the IAM role trust policy documents used in the  
**AWS Organizations: Multi-Account Governance Lab**.

These policies define the cross-account trust relationship that allows an IAM user  
in the **Management account (`XXXXXXXX5055`)** to assume the  
`OrganizationAccountAccessRole` in the **Production** and **Development** accounts.

---

## 📁 Files

| Filename                  | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| `management-to-prod.json` | Trust policy allowing the Management account to assume the `OrganizationAccountAccessRole` in the Production account |
| `management-to-dev.json`  | Trust policy allowing the Management account to assume the `OrganizationAccountAccessRole` in the Development account |

---

## 📑 Example Trust Policy (Redacted)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::XXXXXXXX5055:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}

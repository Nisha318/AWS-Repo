# 📜 Trust Policy JSON Files

This folder contains the **IAM role trust policy documents** used in the  
**AWS Organizations: Multi-Account Governance Lab**.

They define the cross-account trust relationship that allows an IAM user  
in the **Management account (394425152055)** to assume the  
`OrganizationAccountAccessRole` in the **Production** and **Development** accounts.

---

## 📁 Files

| Filename                     | Description                                                   |
|-------------------------------|--------------------------------------------------------------|
| `management-to-prod.json`     | Trust policy allowing the Management account to assume the `OrganizationAccountAccessRole` in the Production account |
| `management-to-dev.json`      | Trust policy allowing the Management account to assume the `OrganizationAccountAccessRole` in the Development account |

---

📌 **Note:** These policies were captured directly from the IAM console after role creation and are included as evidence of correct cross-account configuration.

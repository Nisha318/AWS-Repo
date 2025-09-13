# AWS Organizations: Multi-Account Governance Lab

## 📌 Overview
This lab demonstrates how to build a secure multi-account AWS environment using **AWS Organizations**.  
It implements a **Management account**, a **Production account**, and a **Development account** to support environment isolation, centralized governance, and cross-account administrative access.

**Key Learning Objectives**
- Create and manage multiple AWS accounts using AWS Organizations
- Establish secure cross-account access using IAM role trust policies
- Apply security architecture principles: separation of duties, least privilege, and centralized logging
- Map hands-on AWS implementation to NIST RMF controls

---

## 🖼️ Architecture

```mermaid
graph TD
    A[👩‍💼 Management Account<br/>AWS-General-Management<br/>394425152055]:::mgmt
    B[🏭 Production Account<br/>AWS-Production<br/>347948520061<br/>OrganizationAccountAccessRole]:::member
    C[🧪 Development Account<br/>AWS-Development<br/>914215749281<br/>OrganizationAccountAccessRole]:::member

    A -- sts:AssumeRole --> B
    A -- sts:AssumeRole --> C

    classDef mgmt fill:#1d4ed8,color:#fff,stroke:#0f172a,stroke-width:2px;
    classDef member fill:#0ea5e9,color:#fff,stroke:#0f172a,stroke-width:2px;

## ⚙️ Implementation Steps

### 1. Create the AWS Organization
- Enable AWS Organizations in the Management account
- Invite or create member accounts (Production and Development)

### 2. Verify Role Creation
- Confirm that each member account automatically created the `OrganizationAccountAccessRole`

### 3. Establish Cross-Account Access
- From the Management account, create a **Switch Role** profile for both Prod and Dev accounts
- Verify trust policy (example):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::<management-account-id>:root" },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

4. Test Role Switching

Log in as an IAM user in the Management account

Switch into the OrganizationAccountAccessRole for the Prod account

Switch into the OrganizationAccountAccessRole for the Dev account

Confirm you can switch back to your Management IAM user session

📜 Verification

Capture CloudTrail logs showing AssumeRole and SwitchRole events

Save screenshots of successful role switching

Document IAM trust policies used

🛡️ Security & RMF Control Mapping

This lab demonstrates alignment to the following NIST SP 800-53 Rev 5 controls:

Control	Description
AC-2 (CCI-000015)	Account management: Creates and manages organizational accounts
AC-3 (CCI-000213)	Access enforcement: Trust policy limits access to the Management account
AC-5 (CCI-000770)	Separation of duties: Isolates environments and admin privileges
AC-6 (CCI-000366)	Least privilege: Only temporary elevation via role assumption
IA-2 (CCI-000764)	Identification & authentication: IAM user auth before assuming roles
AU-2 (CCI-000126)	Event logging: CloudTrail logs all cross-account access events
PL-8 (CCI-002450)	Security architecture: Implements multi-account isolation

See the full mapping in rmf-mapping.md
.

📝 Notes

This lab is for personal professional development and is not part of a formal RMF package.

Future improvements may include adding SCPs for additional guardrails and enabling centralized logging to an S3 bucket.

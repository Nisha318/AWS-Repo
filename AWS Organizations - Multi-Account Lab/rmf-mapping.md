# RMF Control Mapping – AWS Organizations Multi-Account Lab

This document maps the implementation of a three-account AWS Organizations structure  
(**Management: 111122223333**, **Production: 444455556666**, **Development: 777788889999**)  
to NIST SP 800-53 Rev 5 controls and their corresponding DoD CCIs.

The lab demonstrates centralized governance, separation of duties, and cross-account role-based administration using the `OrganizationAccountAccessRole`.

---

## 🛡️ Access Control (AC)

| Control | CCI | How Implemented |
|---|---|---|
| **AC-2 – Account Management** | **CCI-000015** | Created dedicated AWS accounts (Prod and Dev) under AWS Organizations from the Management account to support distinct operational roles. |
| **AC-2(1) – Automated Account Management** | **CCI-001499** | AWS Organizations automatically created the `OrganizationAccountAccessRole` in each member account. |
| **AC-3 – Access Enforcement** | **CCI-000213** | Trust policy on each `OrganizationAccountAccessRole` restricts `sts:AssumeRole` access to the Management account `111122223333`. |
| **AC-5 – Separation of Duties** | **CCI-000770** | Production and Development activities are isolated from the Management account, and administrative access is granted only when users deliberately switch roles. |
| **AC-6 – Least Privilege** | **CCI-000366** | Users authenticate as standard IAM users in the Management account and assume admin privileges in Prod/Dev only temporarily through role switching. |

---

## 🔐 Identification and Authentication (IA)

| Control | CCI | How Implemented |
|---|---|---|
| **IA-2 – Identification and Authentication (Organizational Users)** | **CCI-000764** | Users must authenticate to the Management account with MFA before assuming roles into Prod and Dev. |
| **IA-4 – Identifier Management** | **CCI-000800** | IAM user identifiers are managed centrally in the Management account. |
| **IA-5 – Authenticator Management** | **CCI-000766** | Passwords and MFA for IAM users are maintained under Management account security policy. |

---

## 📜 Audit and Accountability (AU)

| Control | CCI | How Implemented |
|---|---|---|
| **AU-2 – Event Logging** | **CCI-000126** | CloudTrail in all three accounts logs `AssumeRole` and `SwitchRole` events to track cross-account access. |
| **AU-12 – Audit Record Generation** | **CCI-001464** | CloudTrail automatically generates audit records for each cross-account role assumption event. |

---

## 🏛️ Planning (PL)

| Control | CCI | How Implemented |
|---|---|---|
| **PL-2 – System Security and Privacy Plan** | **CCI-000093** | The security architecture decision to isolate workloads by account is documented as part of this lab design. |
| **PL-8 – Information Security Architecture** | **CCI-002450** | Implements logical separation of environments (Mgmt, Prod, Dev) under a centralized Root OU. |

---

## 📦 System and Communications Protection (SC)

| Control | CCI | How Implemented |
|---|---|---|
| **SC-2 – Application Partitioning** | **CCI-002418** | Each account isolates resources and permissions to prevent unauthorized access between environments. |

---

## ✅ Notes
- This mapping is for **personal professional development** and is **not part of a formal RMF authorization package**.  
- Evidence collected includes trust policies, CloudTrail `AssumeRole` logs, and screenshots of successful cross-account role switching.

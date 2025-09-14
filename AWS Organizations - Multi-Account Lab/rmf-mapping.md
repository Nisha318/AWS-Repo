<p align="center">
  <img src="https://github.com/Nisha318/Nisha318.github.io/blob/master/assets/images/aws/organizations-01.PNG" 
       alt="AWS Organizations RMF Mapping Banner" width="65%">
</p>

<h1 align="center">RMF Control Mapping — AWS Organizations Lab</h1>

<p align="center">
  <strong>Access Control • Audit & Accountability • Security Architecture</strong>
</p>

<p align="center">
  <a href="https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final">
    <img src="https://img.shields.io/badge/NIST-SP%20800--53%20Rev%205-blue" alt="NIST 800-53 Badge">
  </a>
  <a href="https://public.cyber.mil/rmf/">
    <img src="https://img.shields.io/badge/RMF-Control%20Mapping-purple" alt="RMF Badge">
  </a>
  <img src="https://img.shields.io/badge/Focus-Security%20Governance-green" alt="Security Governance Badge">
  <img src="https://img.shields.io/badge/Author-Nisha318-lightgrey" alt="Author Badge">
</p>

---

## 📌 Purpose

This document maps the controls implemented in the **AWS Organizations: Multi-Account Governance Lab**  
to their corresponding **NIST SP 800-53 Rev 5** control families and **DoD RMF CCIs**.

This mapping shows how multi-account architecture, role-based access, and centralized audit logging  
contribute to RMF compliance requirements.

---

## 🛡️ RMF Control Mapping Table

| Control | CCI         | Description                                                              | How Implemented in Lab                                                       |
| ------- | ------------| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| AC-2    | CCI-000015  | Account Management                                                       | AWS Organizations creates and manages isolated member accounts               |
| AC-3    | CCI-000213  | Access Enforcement                                                       | IAM trust policy enforces cross-account access from the Management account   |
| AC-5    | CCI-000770  | Separation of Duties                                                     | Admin privileges separated by environment (Mgmt vs Prod vs Dev)               |
| AC-6    | CCI-000366  | Least Privilege                                                          | Access granted only via temporary role assumption                            |
| IA-2    | CCI-000764  | Identification & Authentication                                          | IAM user authentication required before assuming roles                       |
| AU-2    | CCI-000126  | Event Logging                                                            | CloudTrail logs all management events including AssumeRole                    |
| AU-12   | CCI-001464  | Audit Record Generation                                                  | CloudTrail generates immutable audit records for cross-account access         |
| PL-8    | CCI-002450  | Security Architecture                                                     | Multi-account structure enforces logical separation of environments           |

---

## 📊 CloudTrail Lake Evidence Mapping

These queries are optional but provide strong, auditable evidence of the RMF control implementations in this lab.  
They are located in `cloudtrail-lake-queries/` and their CSV outputs are saved in `query-results/`.

| Query file                                | Purpose / Evidence                                               | RMF Controls (examples)                        |
|-------------------------------------------|------------------------------------------------------------------|------------------------------------------------|
| `assume-role-events.sql`                   | Lists all cross-account `AssumeRole` events (who, what, when)     | **AU-2 (CCI-000126)**, **AU-12 (CCI-001464)**  |
| `session-issuer.sql`                       | Shows which Management IAM user issued the session                | **IA-2 (CCI-000764)**, **AC-6 (CCI-000366)**   |
| `assume-role-ip-region.sql`                | Shows event IP addresses and AWS Regions                          | **AC-3 (CCI-000213)**, **AU-12 (CCI-001464)**  |
| `assume-role-access-denied.sql`             | Detects failed `AssumeRole` attempts                              | **AU-2 (CCI-000126)**, **AC-3 (CCI-000213)**   |
| `assume-role-count-by-user.sql`             | Counts `AssumeRole` events grouped by user                        | **AC-2 (CCI-000015)**, **IA-2 (CCI-000764)**   |

> **How to run:** In CloudTrail Lake, open **Lake → Query editor**, select your **Event data store**,  
> paste a query from the folder, and replace the placeholder **Event Data Store ID** with your own  
> (e.g., `a1108ccd-5700-4d23-9b7f-cfbae7c1308b`). Save results (CSV) into `query-results/` for audit artifacts.

---

## 📎 Notes

- This mapping is for educational and demonstration purposes only.  
- It is **not** part of a formal RMF authorization package.  
- Additional controls (e.g., SC, CM, CP families) may be applied in future iterations of this lab.

---

## 🔗 Related
- [Main Lab README](./README.md)

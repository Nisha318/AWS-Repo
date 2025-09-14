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

## 📎 Notes

- This mapping is for educational and demonstration purposes only.  
- It is **not** part of a formal RMF authorization package.  
- Additional controls (e.g., SC, CM, CP families) may be applied in future iterations of this lab.

---

## 🔗 Related
- [Main Lab README](./README.md)

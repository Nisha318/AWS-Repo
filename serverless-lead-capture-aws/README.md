
# Serverless Lead Capture on AWS

## Repo Highlights
- **Business Case:** Secure lead capture for a fictitious publisher (*Epic Books*) with global reach and compliance requirements  
- **Architecture:** CloudFront + S3 (static site), API Gateway + Lambda (POST/GET), DynamoDB (storage), SES (notifications), Route 53 + ACM (TLS & domain)  
- **Security:** Private S3 origin (OAC), HTTPS enforced, IAM least privilege, encryption at rest, audit logging, strict CORS, input validation  
- **Compliance Awareness:** RMF controls mapped (AC-3, AC-6, AU-2, SC-28, SI-10, etc.) with [evidence documented](./docs/RMF-mappings.md)  
- **Deliverables:** Working serverless app, architecture diagram, Lambda code, static admin page, compliance mapping  

---

## Case Study: Epic Books

### Problem
Epic Books needed a secure, scalable way to capture contact information from global visitors downloading their free eBook.  
Their pain points included:  
- No central record of downloads  
- No real-time notifications for Sales to follow up  
- No analytics for the data team  
- Compliance gaps around TLS, encryption, and audit logging  

### Approach
I designed and implemented a **serverless architecture on AWS**:

- **Static Website**  
  - Hosted in S3, distributed globally with CloudFront  
  - HTTPS with ACM, private bucket via Origin Access Control  
  - Custom domain: `theepicbooks.com`  

- **Contact Form (POST API)**  
  - API Gateway → Lambda → DynamoDB + SES  
  - Validates inputs server-side, stores record with UUID + timestamp, emails Sales  

- **Admin Listing (GET API)**  
  - API Gateway → Lambda → DynamoDB (Scan with pagination)  
  - Returns records sorted by `createdAt`  
  - Admin page (`contacts.html`) fetches and displays results in a table  

- **Security Controls**  
  - IAM least privilege for Lambda roles (only SES, DynamoDB, CloudWatch Logs)  
  - DynamoDB + S3 encrypted at rest, TLS enforced in transit  
  - Strict CORS (only `https://theepicbooks.com` allowed)  
  - CloudWatch logging, CloudTrail for full audit trail  

### Result
- Leads stored securely in DynamoDB with unique ID and timestamp  
- Sales team receives SES email notifications instantly  
- Admins view submissions on a read-only `contacts.html` page with pagination  
- Global performance via CloudFront edge caching  
- Cost is only a few dollars per month at this traffic level  

### Lesson
Even small marketing workflows can be hardened with **defense-in-depth**:  
- **Security-first:** private origins, least privilege IAM, strict CORS, input validation  
- **Compliance-ready:** encryption at rest, audit logging, mapped to RMF controls  
- **Future-proof:** extend with DynamoDB TTL for retention, AWS WAF for edge protection, or analytics pipelines  

---

## Architecture
![Architecture Diagram](./diagrams/architecture.png)

---

## Security & Compliance Highlights
- **AC-3 / AC-6:** IAM least privilege for Lambda roles  
- **AC-4:** CloudFront OAC to private S3 bucket  
- **AU-2 / AU-12:** Logging via CloudWatch Logs + CloudTrail  
- **IA-5(1):** TLS enforced with ACM certificate lifecycle management  
- **SC-7:** Boundary protection through CloudFront and API throttling  
- **SC-8 / SC-13:** HTTPS everywhere  
- **SC-28:** Encryption at rest for S3 and DynamoDB  
- **SI-10:** Input validation in Lambda, safe output encoding in HTML  
- **DM-2:** Data retention supported via DynamoDB TTL (optional)  

Full control mappings and AP test results: see [`/docs/RMF-mappings.md`](./docs/RMF-mappings.md)

---

## Demo Evidence
- ✅ Form submission recorded in DynamoDB with UUID + timestamp  
- ✅ SES email notification delivered to Sales team inbox  
- ✅ Admin page lists submissions with “Load more” pagination  
- ✅ CloudWatch logs show request IDs and Lambda execution details  
- ✅ ACM certificate “Issued” for `theepicbooks.com`  

---

## Repository Structure

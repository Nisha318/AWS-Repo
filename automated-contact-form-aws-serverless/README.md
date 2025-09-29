# Automated Contact Form Handling with AWS Serverless

## Overview
This project demonstrates how to automate the handling of contact form submissions using AWS serverless services.  
When a user submits a form, their information is automatically validated, stored securely in DynamoDB, and made available for retrieval via a protected API.  
This solution eliminates the need for manual data entry, reduces operational overhead, and scales seamlessly with traffic.

## Architecture
- **Amazon S3** – Hosts the static website and contact form.
- **Amazon API Gateway** – Provides REST API endpoints for form submissions (POST) and contact retrieval (GET).
- **AWS Lambda** – Handles backend logic for storing and retrieving data.
- **Amazon DynamoDB** – Stores contact submissions in a secure, serverless database.
- **Amazon SES (future enhancement)** – Will send automated confirmation emails.
- **CloudWatch Logs** – Provides monitoring and debugging visibility.

## Workflow
1. **User submits form** on the static website hosted in S3.  
2. **API Gateway** invokes the appropriate Lambda function.  
3. **Lambda POST** stores the submission into **DynamoDB**.  
4. **Lambda GET** retrieves submissions for admin review.  
5. **CORS settings** ensure that only the approved website can call the API.  

## Problem → Approach → Result → Lesson
- **Problem:** Businesses with contact forms often face bottlenecks when leads are emailed manually or tracked inconsistently.  
- **Approach:** Build an automated, serverless workflow where form submissions go directly into DynamoDB via Lambda and API Gateway.  
- **Result:** Contacts are captured instantly, stored reliably, and retrievable through a secure API, improving responsiveness and eliminating manual errors.  
- **Lesson:** A serverless-first approach can drastically simplify operations while still providing scalability and integration opportunities (SES emails, analytics, etc.).  

## Repo Structure
```plaintext
automated-contact-form-aws-serverless/
├── lambdas/
│   ├── contactus/                  # POST Lambda source
│   │   ├── index.js
│   │   └── package.json
│   └── list_contacts/              # GET Lambda source
│       ├── index.js
│       └── package.json
├── static-site/
│   ├── index.html                  # Landing page with form
│   ├── contacts.html               # Admin page to view leads
│   └── assets/
│       └── css/
│       └── js/
├── architecture/
│   └── architecture-diagram.png
├── docs/
│   ├── screenshots/                # Collected test evidence
│   │   ├── form-submission.png
│   │   ├── dynamodb-entry.png
│   │   ├── api-gateway-test.png
│   │   └── curl-response.png
│   └── next-steps.md               # Planned improvements (SES, IAM auth, etc.)
└── README.md

# Automated Contact Form Handling with AWS Serverless

## Overview
This project solves a common small-business problem: contact form submissions getting lost in email inboxes or tracked inconsistently.  

By automating the workflow with AWS serverless services, every submission is:  
- **Validated** to prevent bad input  
- **Stored in DynamoDB** for reliable, structured tracking  
- **Sent as an email notification via Amazon SES** (currently routed to Gmail, with future support for a validated domain identity)  

The result is a hands-off system where leads are captured instantly, stored safely, and delivered in real time — ensuring businesses never miss an opportunity.  


## Architecture

![Architecture Diagram](./architecture/architecture-diagram.png)

- **Amazon S3** – Hosts the static website and contact form  
- **Amazon API Gateway** – Exposes REST endpoints (`POST` for form submissions, `GET` for retrieving contacts)  
- **AWS Lambda** – Handles form logic
  - `epicreads_contactus`: POST → validate input, write to DynamoDB, trigger SES email  
  - `epicreads_list_contacts`: GET → fetch submissions from DynamoDB  
- **Amazon DynamoDB** – Stores contact submissions  
- **Amazon SES** – Sends notifications (currently routed to Gmail; will be updated to a validated domain identity)  
- **Amazon CloudWatch** – Provides logging and monitoring  
 
## Workflow
1. **User submits form** on the static website hosted in S3.  
2. **API Gateway** invokes the appropriate Lambda function.  
3. **Lambda POST** validates the input, stores the submission into **DynamoDB**, and triggers **Amazon SES** to send an email notification (currently routed to Gmail).  
4. **Lambda GET** retrieves submissions for admin review.  
5. **CORS settings** ensure that only the approved website can call the API.  
6. **CloudWatch Logs** capture execution details for monitoring and troubleshooting.
   

## Problem → Approach → Result → Lesson

- **Problem:** Small businesses often rely on static websites with contact forms that simply email leads to an inbox. This creates bottlenecks, risks missed opportunities, and provides no structured storage for follow-up.  

- **Approach:** Build a fully automated serverless solution where contact form submissions are validated, stored in DynamoDB for reliability, and immediately sent as email notifications via Amazon SES. The workflow leverages S3, API Gateway, and Lambda to provide a scalable, low-maintenance system.  

- **Result:** Leads are captured instantly, logged in DynamoDB, and delivered to email in real-time. Admins can also query submissions securely through an API, reducing manual errors and ensuring no lead is ever overlooked.  

- **Lesson:** A serverless-first architecture not only eliminates manual inbox monitoring but also provides flexibility for future enhancements — such as IAM-authenticated admin access, validated domain SES integration, or analytics pipelines — without re-architecting the solution.  


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

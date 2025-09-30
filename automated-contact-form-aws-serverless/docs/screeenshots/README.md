# Evidence Walkthrough

This section provides evidence that the automated contact form system is fully functional.  
Each screenshot demonstrates a stage in the workflow, tied to the Problem → Approach → Result → Lesson framework.  

---

## 1. Form Submission (Problem)
Users often fill out contact forms on static sites, but without automation, these submissions may be missed or inconsistently tracked.  
Here we demonstrate a form submission from the hosted static site.  

![Form Submission](./screenshots/form-submission.png)  

---

## 2. DynamoDB Storage (Approach)
Our approach ensures every submission is automatically validated and persisted in DynamoDB via the **POST Lambda**.  
This provides reliable, queryable storage instead of relying on unstructured email inboxes.  

![DynamoDB Entry](./screenshots/dynamodb-entry.png)  

---

## 3. API Testing with cURL – POST

We verified the `POST` endpoint by sending a new lead directly to the API Gateway endpoint with `curl`.  
This confirms the **contact-us Lambda** correctly validates and stores submissions.

**Test Command:**

```bash
curl -i -X POST "https://w6ibd0d18e.execute-api.us-east-1.amazonaws.com/dev/epicreads_resource" \
  -H "Origin: https://theepicbooksofnisha.click" \
  -H "Content-Type: application/json" \
  -d '{"name":"Final Test User","email":"finaltestuser@example.com","message":"Interested in your work, Nisha!"}'
```
![Curl Post Request](./screenshots/curl-post-request.png) 


**Evidence:**  
- New entry appears in DynamoDB  
- SES notification email is delivered  
- Lead is retrievable with the `GET` test (next section)  

---

## 4. API Testing with cURL and API Gateway Console (Lesson, Part 2)

To confirm reliability and observability, the system was tested directly act the API layer.  
- The `GET` endpoint successfully returned stored submissions via **cURL**.  
- API Gateway console testing confirmed the **list_contacts Lambda** integration worked as designed.  

![cURL Response](./screenshots/curl-response.png)  
![API Gateway Test](./screenshots/api-gateway-test.png) 

---

## 5. Admin Page – Contact Review (Lesson, Part 1)
To validate lessons learned about accessibility and operational ease, we created an **admin page (contacts.html)** that queries the API to retrieve stored contacts.  
This allows simple, centralized review of captured leads.  

![Contacts Admin Page](./screenshots/contacts-admin-page.png)  

---

## 6. SES Email Notification (Result)
Each submission triggers an **Amazon SES email notification**, ensuring stakeholders are alerted in real time.  
The screenshot below shows a delivered notification routed to Gmail.  

![SES Email](./screenshots/ses-email.png)  

---


## Summary
The evidence above confirms the system works **end-to-end**:  
- **Problem:** Manual lead handling risks missed opportunities.  
- **Approach:** Automate submissions with AWS serverless services.  
- **Result:** Submissions are instantly stored, emailed, and retrievable.  
- **Lesson:** Serverless automation reduces operational overhead while ensuring leads are never lost.  

Automated EC2 Network Security: RMF Continuous Control Enforcement (AC-4, CA-7, SC-7)

The vulnerability with having publicly accessible Remote Desktop Protocol (RDP) port 3389 and Secure Shell (SSH) port 22 sourced from 0.0.0.0/0 (the entire internet) is critical and represents a massive, unmitigated attack surface.

This configuration is the equivalent of leaving the front door to your most sensitive servers wide open.

The Core Vulnerability: Unrestricted Network Exposure (SC-7 Violation)
The key vulnerability is unrestricted network access, which violates the RMF control SC-7 (System and Communications Protection).

Component	Port	Protocol	Risk Level
SSH	22	TCP	High. Allows direct command-line access.
RDP	3389	TCP	Critical. Allows full desktop graphical access.
Source	0.0.0.0/0	N/A	Maximum. The connection can originate from any IP address on the globe.

Export to Sheets
When combined, these elements expose the system to three major attack vectors:

1. Brute-Force Attacks (Credential Guessing)
Automated bots constantly scan the internet for ports 22 and 3389. Since these ports are open to the world (0.0.0.0/0), attackers can launch massive, sustained brute-force campaigns.

SSH Risk: Bots attempt to guess common usernames (e.g., admin, ubuntu, ec2-user) and passwords until they gain command-line access to the server.

RDP Risk: Bots attempt to guess credentials to gain a full, interactive desktop session on the server, often leading to immediate compromise.

2. Zero-Day/Unpatched Vulnerability Exploits
If the SSH or RDP service itself contains a zero-day or recently disclosed vulnerability that allows remote code execution (RCE) before authentication, the public exposure allows an attacker to exploit the server instantly.

Example (RDP): The 2019 BlueKeep vulnerability (CVE-2019-0708) allowed attackers to gain RCE via RDP without credentials. Publicly exposed port 3389 was the primary vector for mass exploitation.

3. Footprinting and Reconnaissance
Even if the server is perfectly patched, leaving administrative services open provides unnecessary information. An attacker can easily determine the operating system (Linux vs. Windows) and its version simply by interacting with the open ports, aiding in further, targeted attacks.

Mitigation and RMF Control
The only secure solution is to enforce the Principle of Least Functionality/Least Privilege via network controls:

Network Segregation (SC-7): The access should be restricted to only authorized, known corporate IP ranges or bastion hosts/VPNs (e.g., a specific corporate CIDR like 203.0.113.0/24).

Access Control (AC-4): Implementing a control like the one in your project ensures that unauthorized (world-open) access is immediately blocked and remediated.


1. Detection and Auditing (AWS Config)
AWS Config provides the continuous auditing required by CA-7.

Continuous Resource Evaluation: The specialized Config Rules (Incoming-SSH-Disabled and Incoming-RDP-Disabled) are set up to automatically and continuously monitor every single EC2 Security Group in your AWS environment.

Near Real-Time Status: If a non-compliant change (e.g., opening port 22 to 0.0.0.0/0) is made, Config flags the resource as Noncompliant within minutes, providing an immediate, auditable status of your network control posture. This establishes the baseline for the automation.

2. Remediation Execution and Logging (SSM & Lambda)
The automated enforcement ensures the monitoring loop is closed, and the resulting logs provide the mandatory audit trail for action taken.

Automation Record: The SSM Automation Document is the orchestrated workflow. All its executions (start time, end time, inputs, status) are recorded in the SSM Automation History, showing exactly when the remediation was initiated in response to the Config violation.

Action Traceability: The Lambda function, which performs the actual security fix (ec2:RevokeSecurityGroupIngress), writes detailed logs to CloudWatch Logs. These logs are the most critical evidence for CA-7:

They prove the function received the non-compliant Security Group ID.

They show a clear, timestamped record of the decisive action taken (e.g., "Revoked 1 rule(s) on sg-xxxxxxxx").

Self-Correction: The remediation mechanism itself (Config → SSM → Lambda) proves the system is self-monitoring and self-correcting, the strongest form of continuous monitoring.


2. Solution Architecture
graph TD
    subgraph Detection (CA-7)
        A[AWS Config Rule: Incoming-SSH-Disabled / Incoming-RDP-Disabled] -- Detects Non-Compliance --> B(EC2 Security Group Resource)
    end

    subgraph Remediation Orchestration & Execution (AC-4, SC-7)
        B -- Triggers --> C[Config Remediation Configuration]
        C -- Invokes --> D[SSM Automation Document: RemediateOpenSgDoc]
        D -- Calls Lambda with SG ID --> E[AWS Lambda: ConfigSGRevokerLambda]
        E -- RevokeSecurityGroupIngress API Call --> B
    end

    subgraph Logging & Audit Trail (CA-7)
        E -- Outputs detailed logs --> F(CloudWatch Logs)
        D -- Records execution details --> G(SSM Automation History)
    end

    style A fill:#D4EDDA,stroke:#28A745,stroke-width:2px,color:#333
    style B fill:#FFF3CD,stroke:#FFC107,stroke-width:2px,color:#333
    style C fill:#D1ECF1,stroke:#17A2B8,stroke-width:2px,color:#333
    style D fill:#CCE5FF,stroke:#007BFF,stroke-width:2px,color:#333
    style E fill:#D1ECF1,stroke:#17A2B8,stroke-width:2px,color:#333
    style F fill:#E2E3E5,stroke:#6C757D,stroke-width:2px,color:#333
    style G fill:#E2E3E5,stroke:#6C757D,stroke-width:2px,color:#333

graph TD
    A[AWS Config Rule<br>(Detects Non-compliant SG)] -->|Triggers| B[SSM Automation Document<br>(Remediation Workflow)]
    B -->|Invokes| C[AWS Lambda Function<br>(ConfigSGRevokerLambda)]
    C -->|Calls API| D[Amazon EC2 API<br>(RevokeSecurityGroupIngress)]

    subgraph AWS Config Remediation Flow
    A --> B --> C --> D
    end

Detection (CA-7): The AWS Config Rules are the first line of defense, continuously monitoring your EC2 Security Groups for any open SSH/RDP ports.

Remediation Orchestration & Execution (AC-4, SC-7):

The Config Remediation Configuration acts as the glue, linking a non-compliant finding directly to an automated action.

The SSM Automation Document provides the robust and auditable workflow for triggering the Lambda.

The AWS Lambda function contains the core logic to identify and remove the specific offending rules by making direct API calls.

Logging & Audit Trail (CA-7): Crucially, every step leaves a clear record in CloudWatch Logs (for Lambda execution details) and SSM Automation History (for orchestration details), providing a comprehensive audit trail for compliance.


3. Step-by-Step Validation (Embed Screenshots Here)
This is the most critical section. Structure the images to tell the story of the automated fix:

Detection Phase:

Initial AWS Config Console showing compliant :



Image of the initial EC2 SG rule (SSH/RDP open to 0.0.0.0/0).

Image of the AWS Config Console showing the specific rule (Incoming-SSH-Disabled) flagged as Noncompliant.

Enforcement Phase:

Image of the CloudWatch Logs showing the Lambda successfully executing Revoked X rule(s) and the 200 status code.

Final State:

Image of the EC2 SG inbound rules after the remediation, confirming the rogue rule is deleted.

4. Technical Deep Dive (Code Highlights)
Include links to your key files and highlight specific code snippets:

Configuration: Link to cloudformation/remediation-stack.yaml.

Logic: Link to lambda-remediation/revoke_rules_handler.py.

Proof of Concept: Embed the short video clip of the automated fix here (e.g., upload the video to YouTube/Vimeo and link it, or upload the .gif version directly to GitHub).

Embedding images directly in the README.md using Markdown syntax (e.g., ![Alt Text](link/to/image.png)) is the standard professional approach.
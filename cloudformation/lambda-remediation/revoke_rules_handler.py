import boto3
import json

ec2_client = boto3.client('ec2')

def lambda_handler(event, context):
    """
    Handler triggered by AWS Config to revoke non-compliant ingress rules (0.0.0.0/0 on 22/3389).
    This enforces AC-4 and SC-7 controls.
    """
    
    print(f"Received event: {json.dumps(event)}")
    
    # Extract the Security Group ID from the Config event payload
    try:
        # Config passes the resource ID in the 'resourceId' parameter
        sg_id = event['resourceId']
    except KeyError:
        # Handle the structure if the event is passed directly (for testing)
        try:
            sg_id = event['detail']['resourceId']
        except Exception:
            print("ERROR: Could not find Security Group ID. Exiting.")
            return {'statusCode': 400, 'body': 'Missing Security Group ID'}

    print(f"Processing Security Group: {sg_id}")
    
    # 1. Describe the SG to inspect its current rules
    try:
        response = ec2_client.describe_security_groups(GroupIds=[sg_id])
        sg_data = response['SecurityGroups'][0]
    except Exception as e:
        print(f"ERROR: Failed to describe SG {sg_id}. Details: {e}")
        raise

    rules_to_revoke = []
    
    # 2. Identify the specific non-compliant rules
    for permission in sg_data.get('IpPermissions', []):
        from_port = permission.get('FromPort')
        to_port = permission.get('ToPort')
        protocol = permission.get('IpProtocol')

        # Criteria: SSH (22) or RDP (3389)
        is_high_risk_port = (from_port == 22 and to_port == 22) or \
                           (from_port == 3389 and to_port == 3389)

        if is_high_risk_port:
            for ip_range in permission.get('IpRanges', []):
                cidr = ip_range.get('CidrIp')
                # Criteria: Open to the world
                if cidr in ['0.0.0.0/0', '::/0']:
                    print(f"FOUND VIOLATION: {protocol}:{from_port}-{to_port} from {cidr}")
                    rules_to_revoke.append({
                        'IpProtocol': protocol,
                        'FromPort': from_port,
                        'ToPort': to_port,
                        'CidrIp': cidr
                    })

    if not rules_to_revoke:
        print("INFO: No non-compliant rules found. Remediation skipped.")
        return {'statusCode': 200, 'body': 'Compliance check passed.'}

    # 3. Revoke the ingress rules (The Decisive Action)
    try:
        print(f"REVOKING {len(rules_to_revoke)} rule(s) on SG {sg_id}.")
        ec2_client.revoke_security_group_ingress(
            GroupId=sg_id,
            IpPermissions=rules_to_revoke
        )
        print("SUCCESS: Non-compliant rules revoked. Compliance restored.")
        
        return {'statusCode': 200, 'body': 'Remediation successful.'}
        
    except Exception as e:
        print(f"FATAL ERROR during revocation: {e}")
        raise
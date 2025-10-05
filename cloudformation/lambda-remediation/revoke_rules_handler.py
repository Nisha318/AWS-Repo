import boto3
import json
from botocore.exceptions import ClientError

ec2 = boto3.client('ec2')

def lambda_handler(event, context):
    """
    Revoke world-open ingress on SSH (22) and RDP (3389).
    Works with the SSM Automation payload: {"resourceId": "<sg-id>"}.
    """

    print(f"Received event: {json.dumps(event)}")

    # Extract Security Group ID
    sg_id = None
    if isinstance(event, dict):
        sg_id = event.get('resourceId') or event.get('detail', {}).get('resourceId')
    if not sg_id:
        return {"statusCode": 400, "body": "Missing Security Group ID"}

    # Describe the security group
    try:
        resp = ec2.describe_security_groups(GroupIds=[sg_id])
        sg = resp["SecurityGroups"][0]
    except ClientError as e:
        print(f"DescribeSecurityGroups failed for {sg_id}: {e}")
        raise

    ip_permissions_to_revoke = []

    # Iterate through ingress rules
    for p in sg.get("IpPermissions", []):
        proto = p.get("IpProtocol")
        from_port = p.get("FromPort")
        to_port = p.get("ToPort")

        # Target only SSH (22) and RDP (3389), or all traffic (-1)
        is_ssh = (from_port == 22 and to_port == 22)
        is_rdp = (from_port == 3389 and to_port == 3389)
        all_traffic = (proto == "-1")

        if not (is_ssh or is_rdp or all_traffic):
            continue

        # IPv4 public rules
        for r in p.get("IpRanges", []):
            if r.get("CidrIp") == "0.0.0.0/0":
                if all_traffic:
                    ip_permissions_to_revoke.extend([
                        {"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]},
                        {"IpProtocol": "tcp", "FromPort": 3389, "ToPort": 3389, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]},
                    ])
                else:
                    ip_permissions_to_revoke.append({
                        "IpProtocol": proto,
                        "FromPort": from_port,
                        "ToPort": to_port,
                        "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                    })

        # IPv6 public rules
        for r6 in p.get("Ipv6Ranges", []):
            if r6.get("CidrIpv6") == "::/0":
                if all_traffic:
                    ip_permissions_to_revoke.extend([
                        {"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "Ipv6Ranges": [{"CidrIpv6": "::/0"}]},
                        {"IpProtocol": "tcp", "FromPort": 3389, "ToPort": 3389, "Ipv6Ranges": [{"CidrIpv6": "::/0"}]},
                    ])
                else:
                    ip_permissions_to_revoke.append({
                        "IpProtocol": proto,
                        "FromPort": from_port,
                        "ToPort": to_port,
                        "Ipv6Ranges": [{"CidrIpv6": "::/0"}],
                    })

    # No offending rules found
    if not ip_permissions_to_revoke:
        print("No non-compliant rules found")
        return {"statusCode": 200, "body": "Compliant"}

    # Deduplicate permissions to avoid InvalidPermission.Duplicate errors
    def key(p):
        return (
            p["IpProtocol"],
            p.get("FromPort"),
            p.get("ToPort"),
            tuple(sorted([r.get("CidrIp") for r in p.get("IpRanges", []) if "CidrIp" in r])),
            tuple(sorted([r.get("CidrIpv6") for r in p.get("Ipv6Ranges", []) if "CidrIpv6" in r])),
        )
    unique = {key(p): p for p in ip_permissions_to_revoke}
    ip_permissions_to_revoke = list(unique.values())

    # Attempt to revoke rules
    try:
        ec2.revoke_security_group_ingress(GroupId=sg_id, IpPermissions=ip_permissions_to_revoke)
        print(f"Revoked {len(ip_permissions_to_revoke)} rule(s) on {sg_id}")
        return {"statusCode": 200, "body": "Remediation successful"}
    except ClientError as e:
        # Gracefully handle already-fixed or missing rules
        if e.response["Error"]["Code"] in ("InvalidPermission.NotFound",):
            print(f"Rules already removed for {sg_id}")
            return {"statusCode": 200, "body": "Already remediated"}
        print(f"Revoke failed for {sg_id}: {e}")
        raise
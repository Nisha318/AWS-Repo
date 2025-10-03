
aws cloudformation deploy \
  --template-file cloudformation/remediation-stack.yaml \
  --stack-name RMF-Auto-SG-Revoker \
  --capabilities CAPABILITY_NAMED_IAM 
  --region us-east-1